<?php
require_once '../../config/database.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Get token from Authorization header
$headers = getallheaders();
$authorization = isset($headers['Authorization'])
    ? $headers['Authorization']
    : (isset($headers['authorization']) ? $headers['authorization'] : '');

if (empty($authorization)) {
    http_response_code(401);
    echo json_encode(["error" => "No token provided"]);
    exit();
}

$token = str_replace('Bearer ', '', $authorization);

// Database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// INLINE TOKEN VERIFICATION
try {
    $decoded = json_decode(base64_decode($token), true);

    if (!$decoded || !isset($decoded['user_id']) || !isset($decoded['exp'])) {
        throw new Exception("Invalid token format");
    }

    // Check if token expired
    if ($decoded['exp'] < time()) {
        http_response_code(401);
        echo json_encode(["error" => "Token expired"]);
        exit();
    }

    // Fetch admin role ID dynamically
    $adminRoleQuery = "SELECT id FROM roles WHERE role_name = 'admin' LIMIT 1";
    $adminStmt = $db->prepare($adminRoleQuery);
    $adminStmt->execute();
    $adminRole = $adminStmt->fetch(PDO::FETCH_ASSOC);

    if (!$adminRole) {
        throw new Exception("Admin role not found");
    }

    $adminRoleId = $adminRole['id'];

    // Fetch user including role_id
    $query = "SELECT role_id FROM users WHERE id = :id LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $decoded['user_id'], PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        http_response_code(401);
        echo json_encode(["error" => "User not found"]);
        exit();
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if user is admin
    if ($user['role_id'] != $adminRoleId) {
        http_response_code(403);
        echo json_encode(["error" => "Access denied. Admin privileges required."]);
        exit();
    }

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid token: " . $e->getMessage()]);
    exit();
}

// Get form data
$name = $_POST['name'] ?? '';
$rarity = $_POST['rarity'] ?? '';
$element = $_POST['element'] ?? '';
$path = $_POST['path'] ?? '';
$description = $_POST['description'] ?? '';

// Validate required fields
if (empty($name) || empty($rarity) || empty($element) || empty($path)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit();
}

// Handle image upload
$imageName = null;
$debug_info = ['files' => $_FILES];

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $imageFile = $_FILES['image'];
    $imageTmpName = $imageFile['tmp_name'];
    $imageType = $imageFile['type'];
    $imageSize = $imageFile['size'];
    
    // Validate image type
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($imageType, $allowedTypes)) {
        echo json_encode(['success' => false, 'message' => 'Invalid image type. Only JPEG, PNG, GIF, and WebP are allowed', 'debug' => $debug_info]);
        exit();
    }
    
    // Validate image size (max 5MB)
    if ($imageSize > 5 * 1024 * 1024) {
        echo json_encode(['success' => false, 'message' => 'Image size too large. Maximum 5MB allowed', 'debug' => $debug_info]);
        exit();
    }
    
    // Generate image name based on character name
    $imageName = strtolower(str_replace(' ', '_', $name)) . '_portrait.jpg';
    $imagePath = __DIR__ . '/../../../public/images/' . $imageName;
    
    // Create directory if it doesn't exist
    $imageDir = dirname($imagePath);
    if (!is_dir($imageDir)) {
        if (!mkdir($imageDir, 0777, true)) {
            echo json_encode(['success' => false, 'message' => 'Failed to create images directory', 'debug' => $debug_info]);
            exit();
        }
    }
    
    // Move and process image
    if ($imageType === 'image/jpeg' || $imageType === 'image/jpg') {
        if (!move_uploaded_file($imageTmpName, $imagePath)) {
            echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file', 'debug' => $debug_info]);
            exit();
        }
    } else {
        // Convert non-JPEG images to JPEG
        $image = null;
        switch ($imageType) {
            case 'image/png':
                $image = imagecreatefrompng($imageTmpName);
                break;
            case 'image/gif':
                $image = imagecreatefromgif($imageTmpName);
                break;
            case 'image/webp':
                $image = imagecreatefromwebp($imageTmpName);
                break;
        }
        
        if ($image) {
            // Convert to JPEG with 85% quality
            if (!imagejpeg($image, $imagePath, 85)) {
                imagedestroy($image);
                echo json_encode(['success' => false, 'message' => 'Failed to save converted image', 'debug' => $debug_info]);
                exit();
            }
            imagedestroy($image);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to process image', 'debug' => $debug_info]);
            exit();
        }
    }
} else {
    $debug_info['upload_skipped'] = true;
    $debug_info['upload_error'] = $_FILES['image']['error'] ?? 'No image key';
}

try {
    $query = "INSERT INTO characters (name, rarity, element, path) VALUES (:name, :rarity, :element, :path)";
    $stmt = $db->prepare($query);

    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':rarity', $rarity);
    $stmt->bindParam(':element', $element);
    $stmt->bindParam(':path', $path);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Character added successfully",
            "id" => $db->lastInsertId(),
            "debug" => $debug_info
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Failed to add character"
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database error",
        "details" => $e->getMessage()
    ]);
}
?>
