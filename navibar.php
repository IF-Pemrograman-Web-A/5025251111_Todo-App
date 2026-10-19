<aside class="addTask">
    <h2>Menu</h2>
    <ul>
        <li><a href="index.php?type=Personal" class="<?php echo ($currentType === 'Personal') ? 'active' : ''; ?>">Personal</a></li>
        <li><a href="index.php?type=Shared" class="<?php echo ($currentType === 'Shared') ? 'active' : ''; ?>">Shared</a></li>
    </ul>

    <hr style="margin: 20px 0; border: 0; border-top: 1px solid #ccc;">

    <h2>Add New Task</h2>
    <form id="todoForm" action="insertprocess.php" method="POST">
        <label for="newTask">Task Name:</label><br>
        <input type="text" id="newTask" name="name" required><br>

        <label for="taskTime">Task Time:</label><br>
        <input type="time" id="taskTime" name="task_time" required><br>

        <label for="taskNotificationTime">Notification Time:</label><br>
        <input type="time" id="taskNotificationTime" name="notification_time"><br>

        <label for="taskType">Type:</label><br>
        <select id="taskType" name="type">
            <option value="Personal" <?php echo (isset($_GET['type']) && $_GET['type'] == 'Shared') ? '' : 'selected'; ?>>Personal</option>
            <option value="Shared" <?php echo (isset($_GET['type']) && $_GET['type'] == 'Shared') ? 'selected' : ''; ?>>Shared</option>
        </select><br>

        <label>Task Image (Live Camera):</label><br>
        <video id="camera-video" width="100%" height="auto" autoplay></video>
        <div style="display: flex; gap: 5px; margin-bottom: 10px;">
            <button type="button" id="startCamera">Start Camera</button>
            <button type="button" id="takePhoto">Take Photo</button>
        </div>
        <canvas id="camera-canvas" style="display:none;"></canvas>
        <p id="photoStatus" style="font-size: 12px; color: green; display: none;">Foto berhasil diambil!</p>
        <input type="hidden" name="image_data" id="image_data">

        <button type="submit" style="margin-top: 15px;">Add Task</button>
    </form>
</aside>