<?php
require_once 'db_config.php';
$host = 'localhost';
$user = 'root';
$password = 'Aleksaleks123';
$database = 'mydb';
$port = 3307;

$con = new mysqli($host, $user, $password, $database, $port);

if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $image_path = null;
    if (isset($_FILES['categoryImage']) && $_FILES['categoryImage']['error'] === UPLOAD_ERR_OK) {
        $image_name = basename($_FILES['categoryImage']['name']);
        $upload_dir = CATEGORIES_DIR . '/';
        $filesystem_path = $upload_dir . $image_name;
        $image_path = WEB_CATEGORIES_PATH . $image_name;

        if (!move_uploaded_file($_FILES['categoryImage']['tmp_name'], $filesystem_path)) {
            echo 'error_uploading_image';
            exit;
        }
    }
    $state = $con->prepare("INSERT INTO kategorija (kategorija, kategorija_img) VALUES (?, ?)");
    $state->bind_param('ss', $name, $image_path);

    if ($state->execute()) {
        echo 'success';
    } else {
        echo 'error';
    }

    $state->close();
}

$con->close();
?>
