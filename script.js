const API_URL = 'api/tasks.php';
let currentCategory = new URLSearchParams(window.location.search).get('type') || 'Personal';
let currentTasks = [];
let cameraStream = null;

document.addEventListener('DOMContentLoaded', () => {
    registerServiceWorker();
    setupPWAInstall();
    setupCamera();
    setupNavigation();
    setupForm();
    loadTasks(currentCategory);
    startNotificationChecker();
});


async function loadTasks(type) {
    currentCategory = type;
    const taskList = document.getElementById('taskList');
    const categoryTitle = document.getElementById('categoryTitle');
    const loadingIndicator = document.getElementById('loadingIndicator');

    if (categoryTitle) categoryTitle.textContent = `${type} Tasks`;
    if (loadingIndicator) loadingIndicator.style.display = 'inline';

    try {
        const response = await fetch(`${API_URL}?type=${encodeURIComponent(type)}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Gagal memuat data tugas');
        }

        currentTasks = result.data || [];
        renderTasks(currentTasks);
    } catch (error) {
        console.error('Error GET:', error);
        if (taskList) {
            taskList.innerHTML = `<p style="color: #e74c3c;">Gagal memuat tugas: ${error.message}</p>`;
        }
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }
}

function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    if (tasks.length === 0) {
        taskList.innerHTML = `<p style="color: #7f8c8d;">Belum ada tugas untuk kategori ${currentCategory}.</p>`;
        return;
    }

    taskList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}" style="border: 1px solid #ddd; padding: 12px; margin-bottom: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; gap: 12px;">
            <div style="display: flex; align-items: flex-start; gap: 10px; flex: 1;">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskStatus(${task.id})" style="margin-top: 5px; cursor: pointer;">
                <div>
                    <strong style="font-size: 16px; ${task.completed ? 'text-decoration: line-through; color: #888;' : ''}">
                        ${escapeHTML(task.name)}
                    </strong>
                    <div style="font-size: 13px; color: #555; margin-top: 4px;">
                        ⏰ Waktu: ${task.task_time}
                        ${task.notification_time ? ` | 🔔 Pengingat: ${task.notification_time}` : ''}
                    </div>
                    ${task.image_path ? `<img src="${task.image_path}" alt="Foto Tugas" style="max-width: 160px; border-radius: 6px; margin-top: 8px; display: block;">` : ''}
                </div>
            </div>
            <div style="display: flex; gap: 6px;">
                <button type="button" onclick="startEditTask(${task.id})" style="background-color: #f39c12; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;">Edit</button>
                <button type="button" onclick="deleteTask(${task.id})" style="background-color: #e74c3c; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;">Hapus</button>
            </div>
        </div>
    `).join('');
}

function setupForm() {
    const form = document.getElementById('todoForm');
    const cancelBtn = document.getElementById('cancelEditBtn');

    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetFormMode);
    }

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const editId = document.getElementById('edit_task_id').value;
        const payload = {
            name: document.getElementById('newTask').value.trim(),
            task_time: document.getElementById('taskTime').value,
            notification_time: document.getElementById('taskNotificationTime').value || null,
            type: document.getElementById('taskType').value,
            image_data: document.getElementById('image_data').value || null
        };

        const isEdit = editId !== '';
        const url = isEdit ? `${API_URL}?id=${editId}` : API_URL;
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                alert(`Error (${response.status}): ${result.message}`);
                return;
            }

            // Sinkronkan tab kategori aktif jika user memilih kategori berbeda saat submit
            if (payload.type !== currentCategory) {
                switchCategoryTab(payload.type);
            } else {
                loadTasks(currentCategory);
            }

            resetFormMode();
        } catch (error) {
            console.error(`Error ${method}:`, error);
            alert('Terjadi kesalahan jaringan saat menghubungi server API.');
        }
    });
}

function startEditTask(id) {
    const task = currentTasks.find(t => Number(t.id) === Number(id));
    if (!task) return;

    document.getElementById('edit_task_id').value = task.id;
    document.getElementById('newTask').value = task.name;
    document.getElementById('taskTime').value = task.task_time;
    document.getElementById('taskNotificationTime').value = task.notification_time || '';
    document.getElementById('taskType').value = task.type;
    document.getElementById('image_data').value = '';
    document.getElementById('photoStatus').style.display = 'none';

    document.getElementById('formTitle').textContent = 'Edit Task';
    document.getElementById('submitBtn').textContent = 'Update Task';
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
    document.getElementById('newTask').focus();
}

function resetFormMode() {
    const form = document.getElementById('todoForm');
    if (form) form.reset();

    document.getElementById('edit_task_id').value = '';
    document.getElementById('image_data').value = '';
    document.getElementById('taskType').value = currentCategory;
    document.getElementById('photoStatus').style.display = 'none';

    document.getElementById('formTitle').textContent = 'Add New Task';
    document.getElementById('submitBtn').textContent = 'Add Task';
    document.getElementById('cancelEditBtn').style.display = 'none';
}

async function toggleTaskStatus(id) {
    try {
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'toggle' })
        });

        const result = await response.json();
        if (!response.ok) {
            alert(`Error (${response.status}): ${result.message}`);
            return;
        }

        loadTasks(currentCategory);
    } catch (error) {
        console.error('Error PATCH:', error);
    }
}

async function deleteTask(id) {
    if (!confirm('Yakin ingin menghapus tugas ini?')) return;

    try {
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        if (!response.ok) {
            alert(`Error (${response.status}): ${result.message}`);
            return;
        }

        loadTasks(currentCategory);
    } catch (error) {
        console.error('Error DELETE:', error);
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-type');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedType = link.getAttribute('data-type');
            switchCategoryTab(selectedType);
        });
    });
}

function switchCategoryTab(type) {
    document.querySelectorAll('.nav-type').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-type') === type);
    });
    document.getElementById('taskType').value = type;

    const newUrl = `${window.location.pathname}?type=${encodeURIComponent(type)}`;
    window.history.pushState({}, '', newUrl);
    loadTasks(type);
}


function setupCamera() {
    const startBtn = document.getElementById('startCamera');
    const takeBtn = document.getElementById('takePhoto');
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const imageInput = document.getElementById('image_data');
    const photoStatus = document.getElementById('photoStatus');

    if (startBtn && video) {
        startBtn.addEventListener('click', async () => {
            try {
                cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = cameraStream;
            } catch (err) {
                alert('Tidak dapat mengakses kamera: ' + err.message);
            }
        });
    }

    if (takeBtn && video && canvas) {
        takeBtn.addEventListener('click', () => {
            if (!video.srcObject) {
                alert('Nyalakan kamera terlebih dahulu!');
                return;
            }
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);

            imageInput.value = canvas.toDataURL('image/png');
            if (photoStatus) photoStatus.style.display = 'block';
        });
    }
}


function startNotificationChecker() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    const notifiedIds = new Set();
    setInterval(() => {
        const now = new Date();
        const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        currentTasks.forEach(task => {
            if (!task.completed && task.notification_time && task.notification_time.startsWith(currentHHMM)) {
                const key = `${task.id}-${currentHHMM}`;
                if (!notifiedIds.has(key)) {
                    notifiedIds.add(key);
                    triggerNotification('Pengingat Tugas!', `${task.name} (Pukul ${task.task_time})`);
                }
            }
        });
    }, 15000);
}

function triggerNotification(title, body) {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            title: title,
            body: body
        });
    } else if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
    }
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}


function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(err => console.error('SW error:', err));
    }
}

function setupPWAInstall() {
    let deferredPrompt;
    const installBtn = document.getElementById('install-button');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installBtn) installBtn.hidden = false;
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            await deferredPrompt.prompt();
            deferredPrompt = null;
            installBtn.hidden = true;
        });
    }

    window.addEventListener('appinstalled', () => {
        if (installBtn) installBtn.hidden = true;
        deferredPrompt = null;
    });
}