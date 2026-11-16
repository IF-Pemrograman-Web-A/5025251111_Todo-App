<?php $currentType = isset($_GET['type']) ? $_GET['type'] : 'Personal'; ?>
<aside class="addTask">
    <button id="install-button" class="btn-install" hidden>
        Install 
    </button>

    <h2>Menu</h2>
    <ul>
        <li><a href="index.php?type=Personal" class="nav-type <?php echo ($currentType === 'Personal') ? 'active' : ''; ?>" data-type="Personal">Personal</a></li>
        <li><a href="index.php?type=Shared" class="nav-type <?php echo ($currentType === 'Shared') ? 'active' : ''; ?>" data-type="Shared">Shared</a></li>
    </ul>

    <hr style="margin: 20px 0; border: 0; border-top: 1px solid #ccc;">

    <h2 id="formTitle">Add New Task</h2>
    <form id="todoForm">
        <input type="hidden" id="edit_task_id" value="">

        <label for="newTask">Task Name:</label><br>
        <input type="text" id="newTask" name="name" required><br>

        <label for="taskTime">Task Time:</label><br>
        <input type="time" id="taskTime" name="task_time" required><br>

        <label for="taskNotificationTime">Notification Time:</label><br>
        <input type="time" id="taskNotificationTime" name="notification_time"><br>

        <label for="taskType">Type:</label><br>
        <select id="taskType" name="type">
            <option value="Personal" <?php echo ($currentType === 'Shared') ? '' : 'selected'; ?>>Personal</option>
            <option value="Shared" <?php echo ($currentType === 'Shared') ? 'selected' : ''; ?>>Shared</option>
        </select><br>

        <label>Task Image (Live Camera):</label><br>
        <video id="camera-video" width="100%" height="auto" autoplay style="border-radius: 6px; margin-bottom: 5px;"></video>
        <div style="display: flex; gap: 5px; margin-bottom: 10px;">
            <button type="button" id="startCamera">Start Camera</button>
            <button type="button" id="takePhoto">Take Photo</button>
        </div>
        <canvas id="camera-canvas" style="display:none;"></canvas>
        <p id="photoStatus" style="font-size: 12px; color: green; display: none;">Foto berhasil diambil!</p>
        <input type="hidden" name="image_data" id="image_data">

        <div style="display: flex; gap: 8px; margin-top: 15px;">
            <button type="submit" id="submitBtn" style="flex: 1;">Add Task</button>
            <button type="button" id="cancelEditBtn" style="display: none; background-color: #7f8c8d;">Batal</button>
        </div>
    </form>
</aside>