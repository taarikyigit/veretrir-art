<?php
/* =============================================================
   save-data.php — API endpoint to save data.js directly
   Place this file in your website root alongside data.js
   ============================================================= */

// Security: Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Security: Check for auth token (matches admin password)
$headers = getallheaders();
$authToken = isset($headers['X-Auth-Token']) ? $headers['X-Auth-Token'] : '';

// You can change this password - it should match your admin panel password
$validToken = 'mandalinac31';

if ($authToken !== $validToken) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Get the JSON data from request body
$inputData = file_get_contents('php://input');
$jsonData = json_decode($inputData, true);

if (!$jsonData || !isset($jsonData['content'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data']);
    exit;
}

// The content to write to data.js
$dataJsContent = $jsonData['content'];

// Path to data.js (same directory as this PHP file)
$dataJsPath = __DIR__ . '/data.js';

// Create backup before overwriting
$backupPath = __DIR__ . '/data.backup.' . date('Y-m-d-H-i-s') . '.js';
if (file_exists($dataJsPath)) {
    copy($dataJsPath, $backupPath);
    
    // Keep only last 10 backups
    $backups = glob(__DIR__ . '/data.backup.*.js');
    if (count($backups) > 10) {
        usort($backups, function($a, $b) {
            return filemtime($a) - filemtime($b);
        });
        // Delete oldest backups
        $toDelete = array_slice($backups, 0, count($backups) - 10);
        foreach ($toDelete as $old) {
            unlink($old);
        }
    }
}

// Write the new data.js
$result = file_put_contents($dataJsPath, $dataJsContent);

if ($result === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write file. Check file permissions.']);
    exit;
}

// Success response
header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'message' => 'data.js saved successfully',
    'bytes' => $result,
    'backup' => basename($backupPath)
]);
