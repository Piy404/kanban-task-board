document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById("add-task-btn");

    function createTaskCard(text) {
        const todoList = document.getElementById("todo-list");
        if (!todoList) return;

        const card = document.createElement("div");
        card.classList.add("task-card");
        card.setAttribute("draggable", "true");
        card.setAttribute("id", `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`);

        card.innerHTML = `
            <p class="task-text">${text}</p>
            <div class="task-actions">
                <button class="btn-edit">Edit</button>
                <button class="btn-delete">Delete</button>
            </div>
        `;

        // Native drag event listeners
        card.addEventListener("dragstart", (e) => {
            card.classList.add("dragging");
            e.dataTransfer.setData("text/plain", card.id);
        });

        card.addEventListener("dragend", () => {
            card.classList.remove("dragging");
        });

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

    const board = document.querySelector(".board-container");
    if (board) {
        board.addEventListener("click", (event) => {
            if (event.target.classList.contains("btn-delete")) {
                const card = event.target.closest(".task-card");
                if (card) {
                    card.remove();
                }
            } else if (event.target.classList.contains("btn-edit")) {
                const card = event.target.closest(".task-card");
                if (card) {
                    const textEl = card.querySelector(".task-text");
                    if (textEl) {
                        const newText = prompt("Edit task description:", textEl.textContent);
                        if (newText && newText.trim() !== "") {
                            textEl.textContent = newText.trim();
                        }
                    }
                }
            }
        });
    }

    // Column drop zone event listeners
    const taskLists = document.querySelectorAll(".task-list");
    taskLists.forEach(list => {
        list.addEventListener("dragover", (e) => {
            e.preventDefault(); // Required to allow drop event
        });

        list.addEventListener("dragenter", (e) => {
            e.preventDefault();
            list.classList.add("drag-over");
        });

        list.addEventListener("dragleave", () => {
            list.classList.remove("drag-over");
        });

        list.addEventListener("drop", (e) => {
            list.classList.remove("drag-over");
            const cardId = e.dataTransfer.getData("text/plain");
            const card = document.getElementById(cardId);
            if (card) {
                list.appendChild(card);
            }
        });
    });

    // Pre-populate some initial tasks for demonstration
    createTaskCard("Review UI design");
    createTaskCard("Submit End-Sem code");
});
