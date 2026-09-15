<?php
ob_clean();
require_once 'db_config.php';

header('Content-Type: text/plain');

$con = getDBConnection();

if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['question_id'])) {
    $question_id = $data['question_id'];

    $getImageQuery = "SELECT ImagePath FROM Jautajums WHERE jautajums_id = ?";
    $stmtImage = $con->prepare($getImageQuery);
    $stmtImage->bind_param("i", $question_id);
    $stmtImage->execute();
    $resultImage = $stmtImage->get_result();
    $image_path_from_db = null;
    if ($row = $resultImage->fetch_assoc()) {
        $image_path_from_db = $row['ImagePath'];
    }
    $stmtImage->close();

    $query = "DELETE FROM Jautajums WHERE jautajums_id = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("i", $question_id);

    if ($stmt->execute()) {
        if ($image_path_from_db) {
            $filesystem_path = str_replace('/Trivia/', '../', $image_path_from_db);
            if (file_exists($filesystem_path)) {
                unlink($filesystem_path);
            }
        }
        echo 'success';
    } else {
        echo 'error';
    }
    $stmt->close();
} else {
    echo 'No question_id received';
}
$con->close();
?>
