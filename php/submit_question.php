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

if (isset($_POST['action']) && $_POST['action'] === 'add_question') {
    $kategorija_id = $_POST['kategorija'];
    $question = $_POST['question'];
    $difficulty = $_POST['difficulty'];
    $correct_answer = $_POST['correctAnswer'];

    $check_state = $con->prepare("SELECT COUNT(*) FROM jautajums WHERE kategorija_id = ? AND Grutiba = ?");
    $check_state->bind_param("ii", $kategorija_id, $difficulty);
    $check_state->execute();
    $check_state->bind_result($count);
    $check_state->fetch();
    $check_state->close();

    if ($count > 0) {
        echo 'duplicate_question_points';
        exit;
    }

    $image_path = null;
    if (isset($_FILES['filename']) && $_FILES['filename']['error'] === UPLOAD_ERR_OK) {
        $image_name = basename($_FILES['filename']['name']);
        $upload_dir = IMAGES_DIR . '/';
        $filesystem_path = $upload_dir . $image_name;
        $image_path = WEB_IMAGES_PATH . $image_name;
        if (!move_uploaded_file($_FILES['filename']['tmp_name'], $filesystem_path)) {
            echo 'error_uploading_image';
            exit;
        }
    }

    $state = $con->prepare("INSERT INTO jautajums 
        (kategorija_id, Jautajums, Grutiba, PAtbilde, ImagePath) 
        VALUES (?, ?, ?, ?, ?)");

    if ($state === false) {
        echo 'error preparing query';
        exit;
    }

    $state->bind_param(
        "issss",
        $kategorija_id,
        $question,
        $difficulty,
        $correct_answer,
        $image_path
    );

    if ($state->execute()) {
        echo 'success';
    } else {
        echo 'error: ' . $state->error; 
    }

    $state->close();
} else {
    echo 'Invalid request';
}

$con->close();
?>
