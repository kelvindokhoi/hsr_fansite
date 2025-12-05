<?php
require_once '../../config/database.php';

header("Content-Type: application/json");

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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    // Get form data
    $id = $_POST['id'] ?? '';
    $name = $_POST['name'] ?? '';
    $element = $_POST['element'] ?? '';
    $path = $_POST['path'] ?? '';
    $rarity = $_POST['rarity'] ?? 5;
    
    // Validate required fields
    if (empty($id) || empty($name) || empty($element) || empty($path)) {
        echo json_encode(['success' => false, 'message' => 'ID, name, element, and path are required']);
        exit();
    }
    
    // Handle image upload (optional)
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $imageFile = $_FILES['image'];
        $imageTmpName = $imageFile['tmp_name'];
        $imageType = $imageFile['type'];
        $imageSize = $imageFile['size'];
        
        // Validate image type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($imageType, $allowedTypes)) {
            echo json_encode(['success' => false, 'message' => 'Invalid image type. Only JPEG, PNG, GIF, and WebP are allowed']);
            exit();
        }
        
        // Validate image size (max 5MB)
        if ($imageSize > 5 * 1024 * 1024) {
            echo json_encode(['success' => false, 'message' => 'Image size too large. Maximum 5MB allowed']);
            exit();
        }
        
        // Generate image name based on character name
        $imageName = strtolower(str_replace(' ', '_', $name)) . '_portrait.jpg';
        $imagePath = __DIR__ . '/../../../public/images/' . $imageName;
        
        // Create directory if it doesn't exist
        $imageDir = dirname($imagePath);
        if (!is_dir($imageDir)) {
            if (!mkdir($imageDir, 0777, true)) {
                 echo json_encode(['success' => false, 'message' => 'Failed to create images directory']);
                 exit();
            }
        }
        
        // Move and process image
        if ($imageType === 'image/jpeg' || $imageType === 'image/jpg') {
            if (!move_uploaded_file($imageTmpName, $imagePath)) {
                 echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file']);
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
                    echo json_encode(['success' => false, 'message' => 'Failed to save converted image']);
                    exit();
                }
                imagedestroy($image);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to process image']);
                exit();
            }
        }
    }
    
    // Check if character exists
    $checkSql = "SELECT id FROM characters WHERE id = :id";
    $checkStmt = $db->prepare($checkSql);
    $checkStmt->bindParam(':id', $id, PDO::PARAM_INT);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Character not found']);
        exit();
    }
    
    // Update character in database
    $sql = "UPDATE characters SET name = :name, element = :element, path = :path, rarity = :rarity WHERE id = :id";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':element', $element);
    $stmt->bindParam(':path', $path);
    $stmt->bindParam(':rarity', $rarity);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true, 
            'message' => 'Character updated successfully'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update character']);
    }
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>