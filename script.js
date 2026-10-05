let swRegistration = null;
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => { swRegistration = reg; })
        .catch(err => console.error(err));
}

if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
}

const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('themePreference');

if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = 'Light Mode';
}

themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('themePreference', 'dark');
        themeToggle.textContent = 'Light Mode';
    } else {
        localStorage.setItem('themePreference', 'light');
        themeToggle.textContent = 'Dark Mode';
    }
});

let tasks = [];
let db;
const dbRequest = indexedDB.open("TodoAppDB", 1);

dbRequest.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("tasksStore")) {
        db.createObjectStore("tasksStore", { keyPath: "id" });
    }
};

dbRequest.onsuccess = function(event) {
    db = event.target.result;
    loadTasksFromDB();
};

function loadTasksFromDB() {
    const transaction = db.transaction(["tasksStore"], "readonly");
    const store = transaction.objectStore("tasksStore");
    const getRequest = store.getAll();
    getRequest.onsuccess = function() {
        tasks = getRequest.result || [];
        renderTasks();
    };
}

function saveSingleTaskToDB(taskObject) {
    const transaction = db.transaction(["tasksStore"], "readwrite");
    const store = transaction.objectStore("tasksStore");
    store.put(taskObject);
}

function removeTaskFromDB(id) {
    const transaction = db.transaction(["tasksStore"], "readwrite");
    const store = transaction.objectStore("tasksStore");
    store.delete(id);
}

const taskList = document.getElementById('taskList');
const todoForm = document.getElementById('todoForm');
const newTaskInput = document.getElementById('newTask');
const taskTimeInput = document.getElementById('taskTime');
const taskNotificationTimeInput = document.getElementById('taskNotificationTime');

const cameraVideo = document.getElementById('camera-video');
const cameraCanvas = document.getElementById('camera-canvas');
const startCameraBtn = document.getElementById('startCamera');
const takePhotoBtn = document.getElementById('takePhoto');
const photoStatus = document.getElementById('photoStatus');
let capturedPhotoData = null;

async function getStream() {
    return await navigator.mediaDevices.getUserMedia({ video: true });
}

function cameraLaunch(stream) {
    cameraVideo.srcObject = stream;
    cameraVideo.play();
}

startCameraBtn.addEventListener('click', async () => {
    try {
        const stream = await getStream();
        cameraLaunch(stream);
        photoStatus.style.display = 'none';
        capturedPhotoData = null;
    } catch (err) {
        console.error(err);
    }
});

takePhotoBtn.addEventListener('click', () => {
    if (cameraVideo.srcObject) {
        const context = cameraCanvas.getContext('2d');
        cameraCanvas.width = cameraVideo.videoWidth || 320;
        cameraCanvas.height = cameraVideo.videoHeight || 240;
        context.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);
        capturedPhotoData = cameraCanvas.toDataURL('image/png');
        photoStatus.style.display = 'block';
    }
});

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        const imageElement = task.image ? `<img src="${task.image}" alt="Task Image" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 10px;">` : '';

        taskItem.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${task.id})" aria-label="Tandai selesai untuk ${task.name}">
            ${imageElement}
            <label tabindex="0">${task.time} - ${task.name}</label>
            <div class="task-actions">
                <button type="button" class="btn-edit" onclick="editTask(${task.id})">Edit</button>
                <button type="button" class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const newTask = {
        id: Date.now(),
        name: newTaskInput.value,
        time: taskTimeInput.value,
        notificationTime: taskNotificationTimeInput.value || null,
        image: capturedPhotoData, 
        completed: false,
        notified: false
    };
    tasks.push(newTask);
    saveSingleTaskToDB(newTask);
    renderTasks();
    todoForm.reset();
    
    capturedPhotoData = null;
    photoStatus.style.display = 'none';
    if (cameraVideo.srcObject) {
        cameraVideo.srcObject.getTracks().forEach(track => track.stop());
        cameraVideo.srcObject = null;
    }
});

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    removeTaskFromDB(id);
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newName = prompt("Edit Task Name:", task.name);
    if (newName !== null && newName.trim() !== "") {
        task.name = newName;
        saveSingleTaskToDB(task);
        renderTasks();
    }
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveSingleTaskToDB(task);
        renderTasks();
    }
}

setInterval(() => {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    tasks.forEach(task => {
        if (!task.completed && !task.notified && task.notificationTime === currentTime) {
            task.notified = true;
            saveSingleTaskToDB(task);
            if (swRegistration && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'SHOW_NOTIFICATION',
                    title: 'Pengingat ToDo List!',
                    body: `Waktunya untuk: ${task.name} pada jam ${task.time}`
                });
            }
        }
    });
}, 10000);