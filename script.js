// Retrieve tasks from local storage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to render tasks based on current filter
let currentFilter = 'all'; // all, active, completed

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    // Filter tasks based on currentFilter
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        if (task.completed) {
            li.classList.add('completed');
        }
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleComplete(${index})">
            <span class="task-text" onclick="editTask(${index})">${task.text}</span>
            <div class="actions">
                <button onclick="editTask(${index})">✏️</button>
                <button onclick="removeTask(${index})">❌</button>
            </div>
        `;
        taskList.appendChild(li);
    });

    updateTaskCounter();
}

function updateTaskCounter() {
    const counter = document.getElementById('task-counter');
    const activeTasks = tasks.filter(task => !task.completed).length;
    counter.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
}

function addTask() {
    const input = document.getElementById('task-input');
    const taskText = input.value.trim();

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const newTask = {
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    input.value = '';
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function removeTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

function editTask(index) {
    const li = document.querySelectorAll('#task-list li')[index];
    li.classList.add('edit-mode');

    const span = li.querySelector('.task-text');
    const currentText = tasks[index].text;
    span.innerHTML = `<input type="text" id="edit-input-${index}" value="${currentText}">`;

    // Change the edit button to save
    const editButton = li.querySelector('.actions button:first-child');
    editButton.textContent = '💾'; // Save icon
    editButton.onclick = () => saveEdit(index);

    // Focus on the input field
    const editInput = document.getElementById(`edit-input-${index}`);
    editInput.focus();
}

function saveEdit(index) {
    const editInput = document.getElementById(`edit-input-${index}`);
    const newText = editInput.value.trim();

    if (newText === '') {
        alert('Task cannot be empty!');
        return;
    }

    tasks[index].text = newText;
    saveTasks();
    renderTasks();
}

function clearCompleted() {
    if (confirm('Are you sure you want to clear all completed tasks?')) {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    }
}

function filterTasks(filter) {
    currentFilter = filter;

    // Update active state on filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === filter) {
            btn.classList.add('active');
        }
        if (filter === 'all' && btn.textContent.toLowerCase() === 'all') {
            btn.classList.add('active');
        }
    });

    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add event listener to detect 'Enter' key press
document.getElementById('task-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Initial render
renderTasks();
