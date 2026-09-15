<?php
require_once 'db_config.php';

$fs_dir = GALLERY_DIR;
$files = array_values(array_diff(scandir($fs_dir), array('.', '..')));

$media = [];
foreach ($files as $file) {
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    $type = in_array($ext, ['jpg', 'jpeg', 'png', 'gif']) ? "image" : 
            (in_array($ext, ['mp4', 'webm', 'ogg']) ? "video" : "other");

    if ($type !== "other") {
        $media[] = [
            "type" => $type,
            "src" => BASE_URL . '/galerija/' . $file 
        ];
    }
}

header('Content-Type: application/json');
echo json_encode($media);
?>
