<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$targetDir = __DIR__ . '/../../../public/images/';
$testFile = $targetDir . 'test_permission_' . time() . '.txt';

echo "Target Directory: " . realpath($targetDir) . "\n";
echo "Directory Exists: " . (is_dir($targetDir) ? 'Yes' : 'No') . "\n";
echo "Directory Writable: " . (is_writable($targetDir) ? 'Yes' : 'No') . "\n";

if (file_put_contents($testFile, "test content")) {
    echo "Write Test: SUCCESS. File created at $testFile\n";
    unlink($testFile); // Clean up
    echo "Cleanup: SUCCESS. File deleted.\n";
} else {
    echo "Write Test: FAILED. Check permissions.\n";
    $error = error_get_last();
    if ($error) {
        echo "Error details: " . print_r($error, true) . "\n";
    }
}
?>
