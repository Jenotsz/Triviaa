<?php
require_once 'db_config.php';

header('Content-Type: application/json');

try {
    $con = getDBConnection();

    $result = $con->query("SELECT kategorija_id, kategorija, kategorija_img FROM kategorija");

    if (!$result) {
        throw new Exception("Failed to fetch categories: " . $con->error);
    }

    $kategorijas = [];

    while ($row = $result->fetch_assoc()) {
        if (!empty($row['kategorija_img']) && strpos($row['kategorija_img'], 'http') !== 0) {
            $row['kategorija_img'] = BASE_URL . $row['kategorija_img'];
        }
        $kategorijas[] = $row;
    }
    echo json_encode($kategorijas);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    if (isset($con)) {
        $con->close();
    }
}
?>
