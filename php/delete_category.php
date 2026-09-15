<?php
require_once 'db_config.php';

$con = getDBConnection();

if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);
if (isset($data['category_id'])) {
    $category_id = $data['category_id'];

    $getImageQuery = "SELECT kategorija_img FROM kategorija WHERE kategorija_id = ?";
    $stmtImage = $con->prepare($getImageQuery);
    $stmtImage->bind_param("i", $category_id);
    $stmtImage->execute();
    $resultImage = $stmtImage->get_result();
    $image_path_from_db = null;
    if ($row = $resultImage->fetch_assoc()) {
        $image_path_from_db = $row['kategorija_img'];
    }
    $stmtImage->close();

    $query = "DELETE FROM kategorija WHERE kategorija_id = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("i", $category_id);

    if ($stmt->execute()) {
        if ($image_path_from_db) {
            $relative_path = str_replace(BASE_URL, '', $image_path_from_db);
            $relative_path = ltrim($relative_path, '/');
            $filesystem_path = '../' . $relative_path;
            if (!file_exists($filesystem_path)) {
                $filesystem_path = CATEGORIES_DIR . '/' . basename($relative_path);
            }
            if (file_exists($filesystem_path)) {
                unlink($filesystem_path);
            }
        }
        echo 'success';
    } else {
        echo 'error';
    }
    $stmt->close();
}
$con->close();
?>