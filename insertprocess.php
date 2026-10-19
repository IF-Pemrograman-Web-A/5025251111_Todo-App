<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $task_time = $_POST['task_time'];
    $notification_time = !empty($_POST['notification_time']) ? $_POST['notification_time'] : NULL;
    $type = $_POST['type'];
    $image_data = $_POST['image_data'];
    $image_path = NULL;

    if (!empty($image_data)) {
        $image_parts = explode(";base64,", $image_data);
        if (count($image_parts) === 2) {
            $image_base64 = base64_decode($image_parts[1]);
            
            if (!file_exists('uploads')) {
                mkdir('uploads', 0777, true);
            }
            
            $file_name = 'uploads/img_' . time() . '_' . uniqid() . '.png';
            file_put_contents($file_name, $image_base64);
            $image_path = $file_name;
        }
    }

    $stmt = $conn->prepare("INSERT INTO tasks (name, task_time, notification_time, type, image_path) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $name, $task_time, $notification_time, $type, $image_path);
    $stmt->execute();

    header("Location: index.php?type=" . $type);
    exit();
}
?>