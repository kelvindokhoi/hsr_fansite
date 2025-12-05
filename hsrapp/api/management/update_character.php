<?php
require_once 'config.php';

header("Content-Type: application/json");

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
    $description = $_POST['description'] ?? '';
    
    // Validate required fields
    if (empty($id) || empty($name) || empty($element) || empty($path)) {
        echo json_encode(['success' => false, 'message' => 'ID, name, element, and path are required']);
        exit();
    }
    
    // Handle image upload (optional)
    $imageName = null;
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
        $imageName = strtolower(str_replace(' ', '_', $name)) . '.jpg';
        $imagePath = __DIR__ . '/../../../public/images/' . $imageName;
        
        // Create directory if it doesn't exist
        $imageDir = dirname($imagePath);
        if (!is_dir($imageDir)) {
            mkdir($imageDir, 0777, true);
        }
        
        // Move and process image
        if ($imageType === 'image/jpeg' || $imageType === 'image/jpg') {
            move_uploaded_file($imageTmpName, $imagePath);
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
                imagejpeg($image, $imagePath, 85);
                imagedestroy($image);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to process image']);
                exit();
            }
        }
    }
    
    // Check if character exists
    $checkSql = "SELECT id FROM characters WHERE id = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param('i', $id);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Character not found']);
        exit();
    }
    
    // Update character in database
    if ($imageName !== null) {
        // Update with new image
        $sql = "UPDATE characters SET name = ?, element = ?, path = ?, rarity = ?, description = ?, image = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sssissi', $name, $element, $path, $rarity, $description, $imageName, $id);
    } else {
        // Update without changing image
        $sql = "UPDATE characters SET name = ?, element = ?, path = ?, rarity = ?, description = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sssisi', $name, $element, $path, $rarity, $description, $id);
    }
    
    if ($stmt === false) {
        echo json_encode(['success' => false, 'message' => 'Database prepare failed: ' . $conn->error]);
        exit();
    }
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true, 
            'message' => 'Character updated successfully'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update character: ' . $stmt->error]);
    }
    
    $stmt->close();
    $checkStmt->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

$conn->close();
?>