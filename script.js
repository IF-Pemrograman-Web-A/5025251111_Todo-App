let tasks = [];

const taskList = document.getElementById('taskList');
const todoForm = document.getElementById('todoForm');
const newTaskInput = document.getElementById('newTask');
const taskTimeInput = document.getElementById('taskTime');
const themeToggle = document.getElementById('themeToggle');

function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

        taskItem.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${task.id})">
            <label>${task.time} - ${task.name}</label>
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
        completed: false
    };

    tasks.push(newTask);
    renderTasks();
    todoForm.reset(); 
});

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newName = prompt("Edit Task Name:", task.name);
    if (newName !== null && newName.trim() !== "") {
        task.name = newName;
        renderTasks();
    }
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed; 
        renderTasks();
    }
}

themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark');

    if (document.body.classList.contains('dark')) {
        themeToggle.textContent = 'Light Mode';
    } else {
        themeToggle.textContent = 'Dark Mode';
    }
});

renderTasks();