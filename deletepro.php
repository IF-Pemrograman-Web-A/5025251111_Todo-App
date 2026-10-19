<?php
include 'config.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $type = isset($_GET['type']) ? $_GET['type'] : 'Personal';

    $stmt = $conn->prepare("DELETE FROM tasks WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
}

header("Location: index.php?type=" . $type);
exit();
?>