<?php
require_once 'db_config.php';

header('Content-Type: application/json');

try {
    $con = getDBConnection();

    if (!isset($_GET['category_id']) || !isset($_GET['points'])) {
        throw new Exception('Category ID and points are required');
    }

    $category_id = intval($_GET['category_id']);
    $points = intval($_GET['points']);

    $query = "
        SELECT J.Jautajums_id, J.Jautajums, J.Grutiba, J.PAtbilde, J.ImagePath, K.kategorija
        FROM Jautajums J 
        INNER JOIN kategorija K ON J.kategorija_id = K.kategorija_id
        WHERE J.kategorija_id = ? AND J.Grutiba = ?
    ";
    $stmt = $con->prepare($query);
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $con->error);
    }
    $stmt->bind_param("ii", $category_id, $points); 
    if (!$stmt->execute()) {
        throw new Exception("Failed to execute query: " . $stmt->error);
    }

    $result = $stmt->get_result();
    $questions = [];

    while ($row = $result->fetch_assoc()) {
        if (!empty($row['ImagePath'])) {
            $row['ImagePath'] = BASE_URL . $row['ImagePath'];
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
