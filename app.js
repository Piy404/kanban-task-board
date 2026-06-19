document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById("add-task-btn");

    function createTaskCard(text) {
        const todoList = document.getElementById("todo-list");
        if (!todoList) return;

        const card = document.createElement("div");
        card.classList.add("task-card");

        card.innerHTML = `
            <p class="task-text">${text}</p>
            <div class="task-actions">
                <button class="btn-edit">Edit</button>
                <button class="btn-delete">Delete</button>
            </div>
        `;

        todoList.appendChild(card);
    }

    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", () => {
            const taskText = prompt("Enter task description:");
            if (taskText && taskText.trim() !== "") {
                createTaskCard(taskText.trim());
            }
        });
    }
});
