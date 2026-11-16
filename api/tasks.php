<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config.php';

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Internal Server Error: Koneksi database gagal"]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

// Helper function untuk memproses gambar Base64 dari kamera
function saveBase64Image($image_data) {
    if (empty($image_data)) return null;

    $image_parts = explode(";base64,", $image_data);
    if (count($image_parts) !== 2) {
        return false;
    }

    $image_base64 = base64_decode($image_parts[1], true);
    if ($image_base64 === false) {
        return false;
    }

    // Karena file ini berada di dalam folder api/, arahkan penyimpanan fisik ke ../uploads
    $upload_dir = '../uploads';
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $file_name = 'img_' . time() . '_' . uniqid() . '.png';
    $physical_path = $upload_dir . '/' . $file_name;
    $db_path = 'uploads/' . $file_name; // Path relatif dari root (index.php)

    if (file_put_contents($physical_path, $image_base64) !== false) {
        return $db_path;
    }
    return false;
}

switch ($method) {
    //GET
    case 'GET':
        if ($id !== null) {
            if ($id <= 0) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Bad Request: ID tugas tidak valid"]);
                exit();
            }

            $stmt = $conn->prepare("SELECT * FROM tasks WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($row = $result->fetch_assoc()) {
                $row['completed'] = (bool)$row['completed'];
                http_response_code(200);
                echo json_encode(["status" => "success", "data" => $row]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Not Found: Tugas dengan ID $id tidak ditemukan"]);
            }
        } else {
            $type = isset($_GET['type']) ? $_GET['type'] : 'Personal';
            if (!in_array($type, ['Personal', 'Shared'])) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Bad Request: Parameter type harus 'Personal' atau 'Shared'"]);
                exit();
            }

            $stmt = $conn->prepare("SELECT * FROM tasks WHERE type = ? ORDER BY task_time ASC");
            $stmt->bind_param("s", $type);
            $stmt->execute();
            $result = $stmt->get_result();

            $tasks = [];
            while ($row = $result->fetch_assoc()) {
                $row['completed'] = (bool)$row['completed'];
                $tasks[] = $row;
            }

            http_response_code(200);
            echo json_encode(["status" => "success", "data" => $tasks]);
        }
        break;

    //POST
    case 'POST':
        $input = json_decode(file_get_contents("php://input"), true);

        if (!is_array($input)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Bad Request: Format JSON tidak valid"]);
            exit();
        }

        $name = trim($input['name'] ?? '');
        $task_time = trim($input['task_time'] ?? '');
        $notification_time = !empty($input['notification_time']) ? trim($input['notification_time']) : null;
        $type = $input['type'] ?? 'Personal';
        $image_data = $input['image_data'] ?? null;

        // Validasi field wajib
        if (empty($name) || empty($task_time)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Bad Request: Field 'name' dan 'task_time' wajib diisi"]);
            exit();
        }

        if (!in_array($type, ['Personal', 'Shared'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Bad Request: Type harus 'Personal' atau 'Shared'"]);
            exit();
        }

        // Proses gambar Base64 jika dikirim
        $image_path = null;
        if (!empty($image_data)) {
            $image_path = saveBase64Image($image_data);
            if ($image_path === false) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Bad Request: Format gambar Base64 tidak valid"]);
                exit();
            }
        }

        $stmt = $conn->prepare("INSERT INTO tasks (name, task_time, notification_time, type, image_path) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $name, $task_time, $notification_time, $type, $image_path);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode([
                "status" => "success",
                "message" => "Tugas berhasil ditambahkan",
                "data" => [
                    "id" => $stmt->insert_id,
                    "name" => $name,
                    "task_time" => $task_time,
                    "notification_time" => $notification_time,
                    "type" => $type,
                    "image_path" => $image_path,
                    "completed" => false
                ]
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Internal Server Error: Gagal menyimpan tugas"]);
        }
        break;

    //PUT / PATCH
    case 'PUT':
    case 'PATCH':
        if (!$id || $id <= 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Bad Request: Parameter ID pada URL wajib disertakan"]);
            exit();
        }

        // Cek apakah data tugas ada di database terlebih dahulu
        $checkStmt = $conn->prepare("SELECT * FROM tasks WHERE id = ?");
        $checkStmt->bind_param("i", $id);
        $checkStmt->execute();
        $existingTask = $checkStmt->get_result()->fetch_assoc();

        if (!$existingTask) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Not Found: Tugas dengan ID $id tidak ditemukan"]);
            exit();
        }

        $input = json_decode(file_get_contents("php://input"), true) ?? [];

        // Jika request khusus untuk toggle status (misal: PATCH /api/tasks.php?id=1 tanpa body atau dengan {"action": "toggle"})
        if (empty($input) || (isset($input['action']) && $input['action'] === 'toggle')) {
            $newStatus = $existingTask['completed'] ? 0 : 1;
            $updateStmt = $conn->prepare("UPDATE tasks SET completed = ? WHERE id = ?");
            $updateStmt->bind_param("ii", $newStatus, $id);

            if ($updateStmt->execute()) {
                http_response_code(200);
                echo json_encode([
                    "status" => "success",
                    "message" => "Status tugas berhasil diperbarui",
                    "completed" => (bool)$newStatus
                ]);
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Internal Server Error: Gagal memperbarui status"]);
            }
            exit();
        }

        // Jika request untuk mengedit detail tugas (PUT/PATCH dengan payload JSON)
        $name = isset($input['name']) ? trim($input['name']) : $existingTask['name'];
        $task_time = isset($input['task_time']) ? trim($input['task_time']) : $existingTask['task_time'];
        $notification_time = array_key_exists('notification_time', $input)
            ? (!empty($input['notification_time']) ? trim($input['notification_time']) : null)
            : $existingTask['notification_time'];
        $type = isset($input['type']) ? $input['type'] : $existingTask['type'];
        $completed = isset($input['completed']) ? ($input['completed'] ? 1 : 0) : $existingTask['completed'];

        if (empty($name) || empty($task_time)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Bad Request: Field 'name' dan 'task_time' tidak boleh kosong"]);
            exit();
        }

        if (!in_array($type, ['Personal', 'Shared'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Bad Request: Type harus 'Personal' atau 'Shared'"]);
            exit();
        }

        // Jika ada gambar baru yang dikirim saat edit, simpan gambar baru & hapus gambar lama
        $image_path = $existingTask['image_path'];
        if (!empty($input['image_data'])) {
            $new_image_path = saveBase64Image($input['image_data']);
            if ($new_image_path === false) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Bad Request: Format gambar Base64 tidak valid"]);
                exit();
            }
            if (!empty($image_path) && file_exists('../' . $image_path)) {
                unlink('../' . $image_path);
            }
            $image_path = $new_image_path;
        }

        $stmt = $conn->prepare("UPDATE tasks SET name = ?, task_time = ?, notification_time = ?, type = ?, image_path = ?, completed = ? WHERE id = ?");
        $stmt->bind_param("sssssii", $name, $task_time, $notification_time, $type, $image_path, $completed, $id);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Tugas berhasil diperbarui",
                "data" => [
                    "id" => $id,
                    "name" => $name,
                    "task_time" => $task_time,
                    "notification_time" => $notification_time,
                    "type" => $type,
                    "image_path" => $image_path,
                    "completed" => (bool)$completed
                ]
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Internal Server Error: Gagal memperbarui tugas"]);
        }
        break;

    //Delete
    case 'DELETE':
        if (!$id || $id <= 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Bad Request: Parameter ID pada URL wajib disertakan"]);
            exit();
        }

        // Ambil path gambar sebelum baris dihapus agar file fisiknya juga bersih
        $checkStmt = $conn->prepare("SELECT image_path FROM tasks WHERE id = ?");
        $checkStmt->bind_param("i", $id);
        $checkStmt->execute();
        $task = $checkStmt->get_result()->fetch_assoc();

        if (!$task) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Not Found: Tugas dengan ID $id tidak ditemukan"]);
            exit();
        }

        $stmt = $conn->prepare("DELETE FROM tasks WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            if (!empty($task['image_path']) && file_exists('../' . $task['image_path'])) {
                unlink('../' . $task['image_path']);
            }
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Tugas berhasil dihapus"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Internal Server Error: Gagal menghapus tugas"]);
        }
        break;

    //method tidak valid
    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method Not Allowed: Metode $method tidak didukung"]);
        break;
}
?>