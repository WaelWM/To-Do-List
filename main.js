window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");
    let tasks = [];

    // Load tasks from localStorage when the page is loaded
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks.forEach(taskText => {
            const task_el = createTaskElement(taskText);
            list_el.appendChild(task_el);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = input.value.trim();

        if (task === '') {
            alert('Please write something to add a task!');
            return;
        }

        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        const task_el = createTaskElement(task);
        list_el.appendChild(task_el);

        input.value = '';
    });

    list_el.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            const task_el = e.target.closest('.task');
            const taskText = task_el.querySelector('.text').value;
            const confirmDelete = confirm(`Are you sure you want to delete the task: "${taskText}"?`);
            if (confirmDelete) {
                const index = tasks.indexOf(taskText);
                if (index !== -1) {
                    tasks.splice(index, 1);
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                }
                task_el.remove();
            }
        } else if (e.target.classList.contains('edit')) {
            const task_el = e.target.closest('.task');
            const task_input_el = task_el.querySelector('.text');
            if (e.target.innerText.toLowerCase() === "edit") {
                e.target.innerText = "Save";
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();
            } else {
                e.target.innerText = "Edit";
                task_input_el.setAttribute("readonly", "readonly");

                // Get the index of the task being edited
                const index = Array.from(list_el.children).indexOf(task_el);
                if (index !== -1) {
                    // Update the task in the tasks array
                    tasks[index] = task_input_el.value;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                }
            }
        }
    });

    function createTaskElement(taskText) {
        const task_el = document.createElement('div');
        task_el.classList.add('task');

        const task_content_el = document.createElement('div');
        task_content_el.classList.add('content');

        const task_input_el = document.createElement('input');
        task_input_el.classList.add('text');
        task_input_el.type = 'text';
        task_input_el.value = taskText;
        task_input_el.setAttribute('readonly', 'readonly');

        const task_actions_el = document.createElement('div');
        task_actions_el.classList.add('actions');

        const task_edit_el = document.createElement('button');
        task_edit_el.classList.add('edit');
        task_edit_el.innerText = 'Edit';

        const task_delete_el = document.createElement('button');
        task_delete_el.classList.add('delete');
        task_delete_el.innerText = 'Delete';

        task_content_el.appendChild(task_input_el);
        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);
        task_el.appendChild(task_content_el);
        task_el.appendChild(task_actions_el);

        return task_el;
    }
});
