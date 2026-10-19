<?php
$type = isset($_GET['type']) ? $_GET['type'] : 'Personal';

echo "<h2>$type Tasks</h2>";

$stmt = $conn->prepare("SELECT * FROM tasks WHERE type = ? ORDER BY task_time ASC");
$stmt->bind_param("s", $type);
$stmt->execute();
$result = $stmt->get_result();

echo "<div id='taskList'>";
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $status = $row['completed'] ? "completed" : "";
        $checked = $row['completed'] ? "checked" : "";
        
        $image_element = "";
        if (!empty($row['image_path']) && file_exists($row['image_path'])) {
            $image_element = "<img src='" . htmlspecialchars($row['image_path']) . "' alt='Bukti' style='width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 10px;'>";
        }
        
        echo "<div class='task-item $status'>";
        echo "<input type='checkbox' $checked onchange=\"location.href='statustoggle.php?id=" . $row['id'] . "&type=$type'\">"; 
        echo $image_element;
        echo "<label>" . htmlspecialchars($row['task_time']) . " - " . htmlspecialchars($row['name']) . "</label>";
        
        echo "<div class='task-actions'>";
        echo "<a href='deletepro.php?id=" . $row['id'] . "&type=$type' class='btn-delete' style='text-decoration:none; padding:6px 12px;'>Delete</a>";
        echo "</div>";
        echo "</div>";
    }
} else {
    echo "<p>Belum ada tugas di kategori ini.</p>";
}
echo "</div>";
?>