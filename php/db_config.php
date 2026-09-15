<?php
$host = 'localhost';
$user = 'root';
$password = 'Aleksaleks123';
$database = 'mydb';
$port = 3307;

function getDBConnection() {
    global $host, $user, $password, $database, $port;
    
    $con = new mysqli($host, $user, $password, $database, $port);
    
    if ($con->connect_error) {
        die("Connection failed: " . $con->connect_error);
    }
    
    return $con;
}

define('BASE_URL', 'http://localhost/trivia/');
define('IMAGES_DIR', '../images');
define('CATEGORIES_DIR', '../categories');
define('WINNERS_DIR', '../winners');
define('GALLERY_DIR', '../galerija');

define('WEB_CATEGORIES_PATH', 'categories/');
define('WEB_IMAGES_PATH', 'images/');
define('WEB_GALLERY_PATH', 'galerija/');

function ensureDirectoriesExist() {
    $directories = [IMAGES_DIR, CATEGORIES_DIR, WINNERS_DIR, GALLERY_DIR];
    foreach ($directories as $dir) {
        if (!file_exists($dir)) {
            mkdir($dir, 0777, true);
        }
    }
}

ensureDirectoriesExist(); 