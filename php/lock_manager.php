<?php
session_start();
$lockFile = __DIR__ . '/session.lock';

function isPageLocked() {
    global $lockFile;
    if (file_exists($lockFile)) {
        $lockTime = filemtime($lockFile);
        $currentTime = time();
        if ($currentTime - $lockTime > 300) {
            unlink($lockFile);
            return false;
        }
        if (isset($_SESSION['lock_id']) && file_get_contents($lockFile) !== $_SESSION['lock_id']) {
            return true;
        }
    }
    
    return false;
}

function acquireLock() {
    global $lockFile;
    $lockId = uniqid();
    if (file_put_contents($lockFile, $lockId)) {
        $_SESSION['lock_id'] = $lockId;
        return true;
    }
    
    return false;
}

function releaseLock() {
    global $lockFile;
    if (isset($_SESSION['lock_id']) && file_exists($lockFile)) {
        $currentLockId = file_get_contents($lockFile);
        if ($currentLockId === $_SESSION['lock_id']) {
            unlink($lockFile);
            unset($_SESSION['lock_id']);
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isPageLocked()) {
        header('HTTP/1.1 403 Forbidden');
        echo json_encode(['error' => 'Page is currently in use by another user. Please try again later.']);
        exit;
    }
    if (!isset($_SESSION['lock_id'])) {
        acquireLock();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'unload') {
    releaseLock();
    echo json_encode(['success' => true]);
    exit;
}

if (!headers_sent()) {
    header('Content-Type: application/json');
}
if (ob_get_length() === 0) {
    echo '{}';
}
?> 