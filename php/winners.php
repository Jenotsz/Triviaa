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
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM winners";
    $result = $con->query($sql);
    $winners = [];

    while ($row = $result->fetch_assoc()) {
        if (!empty($row['image_path'])) {
            $row['image_path'] = BASE_URL . '/' . $row['image_path'];
        }
        $winners[] = $row;
    }
    header('Content-Type: application/json');
    echo json_encode($winners);
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name1 = $_POST['name1'] ?? null;
    $name2 = $_POST['name2'] ?? null;
    $name3 = $_POST['name3'] ?? null;
    $currentImages = [];
    $sql = "SELECT image_path FROM winners";
    $result = $con->query($sql);
    while ($row = $result->fetch_assoc()) {
        $currentImages[] = $row['image_path'];
    }
    $img1 = $_FILES['image1']['name'] ? WINNERS_DIR . "/" . basename($_FILES['image1']['name']) : $currentImages[0];
    $img2 = $_FILES['image2']['name'] ? WINNERS_DIR . "/" . basename($_FILES['image2']['name']) : $currentImages[1];
    $img3 = $_FILES['image3']['name'] ? WINNERS_DIR . "/" . basename($_FILES['image3']['name']) : $currentImages[2];
    if ($img1 !== $currentImages[0] && !empty($currentImages[0]) && file_exists($currentImages[0])) {
        unlink($currentImages[0]);
    }
    if ($img1 !== $currentImages[0]) {
        move_uploaded_file($_FILES['image1']['tmp_name'], $img1);
    }
    if ($img2 !== $currentImages[1] && !empty($currentImages[1]) && file_exists($currentImages[1])) {
        unlink($currentImages[1]);
    }
    if ($img2 !== $currentImages[1]) {
        move_uploaded_file($_FILES['image2']['tmp_name'], $img2);
    }
    if ($img3 !== $currentImages[2] && !empty($currentImages[2]) && file_exists($currentImages[2])) {
        unlink($currentImages[2]);
    }
    if ($img3 !== $currentImages[2]) {
        move_uploaded_file($_FILES['image3']['tmp_name'], $img3);
    }
    if ($img3 !== $currentImages[3] && !empty($currentImages[3]) && file_exists($currentImages[3])) {
        unlink($currentImages[3]);
    }
    $queries = [];
    if ($name1 || $img1) {
        $queries[] = "UPDATE winners SET name=?, image_path=? WHERE winner_id=1";
    }
    if ($name2 || $img2) {
        $queries[] = "UPDATE winners SET name=?, image_path=? WHERE winner_id=2";
    }
    if ($name3 || $img3) {
        $queries[] = "UPDATE winners SET name=?, image_path=? WHERE winner_id=3";
    }
    if (!empty($queries)) {
        foreach ($queries as $query) {
            $stmt = $con->prepare($query);
            if ($stmt) {
                if (strpos($query, 'winner_id=1') !== false) {
                    $stmt->bind_param("ss", $name1, $img1);
                } elseif (strpos($query, 'winner_id=2') !== false) {
                    $stmt->bind_param("ss", $name2, $img2);
                } elseif (strpos($query, 'winner_id=3') !== false) {

                    $stmt->bind_param("ss", $name3, $img3);
                }

                if ($stmt->execute()) {
                    echo "Winner updated successfully!";
                } else {
                    echo "Error updating winner: " . $stmt->error;
                }
                $stmt->close();
            } else {
                echo "Failed to prepare statement: " . $con->error;
            }
        }
    } else {
        echo "No data to update.";
    }
}

$con->close();
?>
