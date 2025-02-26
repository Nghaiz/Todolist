const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const loadingState = document.getElementById('loading-state');
const apiErrorState = document.getElementById('api-error-state');
const parsingErrorState = document.getElementById('parsing-error-state');
const emptyState = document.getElementById('empty-state');
const retryBtn = document.getElementById('retry-btn');
const retryBtnParse = document.getElementById('retry-btn-parse');

let todos = [];

function showState(stateElement) {
    loadingState.classList.add('hidden');
    apiErrorState.classList.add('hidden');
    parsingErrorState.classList.add('hidden');
    emptyState.classList.add('hidden');
    todoList.classList.add('hidden');

    stateElement.classList.remove('hidden');
}

function renderTodos() {
    if (todos.length === 0) {
        showState(emptyState);
        return;
    }

    todoList.innerHTML = '';
    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('todo-checkbox');
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodoStatus(todo.id));

        const todoText = document.createElement('span');
        todoText.classList.add('todo-text');
        if (todo.completed) {
            todoText.classList.add('completed');
        }
        todoText.textContent = todo.title;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('todo-delete');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        todoItem.appendChild(checkbox);
        todoItem.appendChild(todoText);
        todoItem.appendChild(deleteBtn);

        todoList.appendChild(todoItem);
    });

    showState(todoList);
}

function fetchTodos() {
    showState(loadingState);

    const demoTodos = [
        { id: 1, title: "a", completed: false },
        { id: 2, title: "b", completed: true },
        { id: 3, title: "c", completed: false },
        { id: 4, title: "d", completed: false },
        { id: 5, title: "e", completed: true }
    ];

    fetch("https://jsonplaceholder.typicode.com/todos")
        .then((response) => {
            console.log("Data fetched");
            if (!response.ok) {
                throw new Error("API response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            todos = data.length > 0 ? data.slice(0, 5) : demoTodos;
            renderTodos();
        })
        .catch((error) => {
            console.log("Error parsing data:", error);
            showState(parsingErrorState);
        });
}

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === '') return;

    const newTodo = {
        id: Date.now(),
        title: todoText,
        completed: false
    };

    todos.push(newTodo);
    todoInput.value = '';
    renderTodos();
}

function toggleTodoStatus(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });

    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

retryBtn.addEventListener('click', fetchTodos);
retryBtnParse.addEventListener('click', fetchTodos);

document.addEventListener('DOMContentLoaded', () => {
    fetchTodos();

    console.log("Script start");

    setTimeout(() => {
        console.log("setTimeout callback");
    }, 0);

    Promise.resolve().then(() => {
        console.log("Promise resolved");
    });

    console.log("End of script");
});