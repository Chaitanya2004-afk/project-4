let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks(filter = 'all') {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (filter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${index})">
            <span class="task-text">${task.text}</span>
            <span class="task-due">${task.dueDate ? 'Due: ' + formatDateTime(task.dueDate) : ''}</span>
            <div class="task-actions">
                <button onclick="editTask(${index})">✏️</button>
                <button onclick="deleteTask(${index})">🗑️</button>
            </div>
        `;
        
        taskList.appendChild(taskItem);
    });
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDateTime = document.getElementById('taskDateTime');
    
    if (taskInput.value.trim() === '') {
        alert('Please enter a task');
        return;
    }
    
    const newTask = {
        text: taskInput.value.trim(),
        completed: false,
        dueDate: taskDateTime.value || null,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();
    taskInput.value = '';
    taskDateTime.value = '';
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function editTask(index) {
    const newText = prompt('Edit your task:', tasks[index].text);
    if (newText !== null && newText.trim() !== '') {
        tasks[index].text = newText.trim();
        
        const newDateTime = prompt('Edit due date and time (YYYY-MM-DD HH:MM):', 
                                 tasks[index].dueDate ? formatDateTimeForInput(tasks[index].dueDate) : '');
        if (newDateTime !== null) {
            tasks[index].dueDate = newDateTime ? newDateTime : null;
        }
        
        saveTasks();
        renderTasks();
    }
}

function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

function filterTasks(filter) {
    renderTasks(filter);
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatDateTime(dateTimeString) {
    if (!dateTimeString) return '';
    
    const date = new Date(dateTimeString);
    return date.toLocaleString();
}

function formatDateTimeForInput(dateTimeString) {
    if (!dateTimeString) return '';
    
    const date = new Date(dateTimeString);
    const pad = num => num.toString().padStart(2, '0');
    
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
renderTasks();