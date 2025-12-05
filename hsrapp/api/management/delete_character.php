<?php
require_once 'config.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id']) || empty($input['id'])) {
        echo json_encode(['success' => false, 'message' => 'Character ID is required']);
        exit();
    }
    
    $id = intval($input['id']);
    
    // Get character info before deletion (to remove image)
    $getSql = "SELECT image FROM characters WHERE id = ?";
    $getStmt = $conn->prepare($getSql);
    $getStmt->bind_param('i', $id);
    $getStmt->execute();
    $getResult = $getStmt->get_result();
    
    if ($getResult->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Character not found']);
        exit();
    }
    
    $character = $getResult->fetch_assoc();
    $imageName = $character['image'];
    
    // Delete character from database
    $sql = "DELETE FROM characters WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if ($stmt === false) {
        echo json_encode(['success' => false, 'message' => 'Database prepare failed: ' . $conn->error]);
        exit();
    }
    
    $stmt->bind_param('i', $id);
    
    if ($stmt->execute()) {
        // Remove image file if it exists
        if (!empty($imageName)) {
            $imagePath = __DIR__ . '/../../../public/images/' . $imageName;
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }
        
        echo json_encode([
            'success' => true, 
            'message' => 'Character deleted successfully'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete character: ' . $stmt->error]);
    }
    
    $stmt->close();
    $getStmt->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

$conn->close();
?>