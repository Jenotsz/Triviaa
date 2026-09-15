<?php
require_once 'db_config.php';

header('Content-Type: application/json');

try {
    $con = getDBConnection();

    $query = "SELECT j.jautajums_id, j.Jautajums, j.Grutiba, j.PAtbilde, k.kategorija_id, k.kategorija 
              FROM jautajums j
              JOIN kategorija k ON j.kategorija_id = k.kategorija_id
              ORDER BY k.kategorija_id, j.Grutiba"; 

    $result = $con->query($query);

    if (!$result) {
        throw new Exception("Failed to fetch answers: " . $con->error);
    }

    $all_questions = [];

    while ($row = $result->fetch_assoc()) {
        $all_questions[] = $row;
    }

    echo json_encode($all_questions);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    if (isset($con)) {
        $con->close();
    }
}
?> 