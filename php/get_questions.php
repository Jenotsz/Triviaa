<?php
require_once 'db_config.php';

header('Content-Type: application/json');

try {
    if (!isset($_GET['category_id'])) {
        throw new Exception('Category ID is required');
    }

    $category_id = intval($_GET['category_id']);
    $con = getDBConnection();

    $stmt = $con->prepare("SELECT jautajums_id, Jautajums, Grutiba, PAtbilde, ImagePath FROM jautajums WHERE kategorija_id = ?");
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $con->error);
    }

    $stmt->bind_param("i", $category_id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to execute query: " . $stmt->error);
    }

    $result = $stmt->get_result();
    $questions = [];

    while ($row = $result->fetch_assoc()) {
        if (!empty($row['ImagePath'])) {
            $row['ImagePath'] = BASE_URL . $row['ImagePath'] . '?v=' . time();
        } else {
            $row['ImagePath'] = null;
        }
        $questions[] = $row;
    }

    echo json_encode($questions);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($con)) {
        $con->close();
    }
}
?>
