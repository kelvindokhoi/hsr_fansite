<?php
// Database configuration removed - using central database.php instead

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Image path configuration
define('IMAGE_UPLOAD_PATH', 'C:/Users/BTB/Documents/Fall 2025/UI/hsr_fansite/public/images/');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
