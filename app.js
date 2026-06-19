// Kanban Task Board - app.js with LocalStorage persistence

document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById("add-task-btn");
    const resetBoardBtn = document.getElementById("reset-board-btn"); // will be added in HTML

    // Global board data structure
    const boardData = {
        todo: [],
        inprogress: [],
        done: []
    };

    // Utility: Save state to LocalStorage
    function saveBoardState() {
        try {
            localStorage.setItem("kanbanBoardState", JSON.stringify(boardData));
        } catch (e) {
            console.warn("LocalStorage save failed:", e);
        }
    }

    // Utility: Load state from LocalStorage
    function loadBoardState() {
        const saved = localStorage.getItem("kanbanBoardState");
        if (!saved) return false;
        try {
            const data = JSON.parse(saved);
            // Clear existing columns
            document.querySelectorAll(".task-list").forEach(list => list.innerHTML = "");
            // Render each task
            for (const column in data) {
                data[column].forEach(task => {
                    createTaskCard(task.text, column, task.id, false);
                });
            }
            // Sync in-memory boardData with loaded data
            Object.assign(boardData, data);
            return true;
        } catch (e) {
            console.warn("Failed to parse board state:", e);
            return false;
        }
    }

    // Update boardData from DOM (used after drag, edit, delete)
    function updateBoardDataFromDOM() {
        boardData.todo = [];
        boardData.inprogress = [];
        boardData.done = [];
        const columnMap = {
            "todo-list": "todo",
            "inprogress-list": "inprogress",
            "done-list": "done"
        };
        document.querySelectorAll('.task-list').forEach(list => {
            const colKey = columnMap[list.id];
            if (!colKey) return;
            list.querySelectorAll('.task-card').forEach(card => {
                const textEl = card.querySelector('.task-text');
                if (textEl) {
                    boardData[colKey].push({ id: card.id, text: textEl.textContent });
                }
            });
        });
        saveBoardState();
    }

    // Create a task card; column can be 'todo', 'inprogress', 'done'
    function createTaskCard(text, column = "todo", providedId = null, persist = true) {
        const listEl = document.getElementById(`${column}-list`);
        if (!listEl) return;

        const card = document.createElement("div");
        card.classList.add("task-card");
        card.setAttribute("draggable", "true");
        const id = providedId || `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        card.setAttribute("id", id);

        card.innerHTML = `
            <p class="task-text">${text}</p>
            <div class="task-actions">
                <button class="btn-edit">Edit</button>
                <button class="btn-delete">Delete</button>
            </div>
        `;

        // Drag events
        card.addEventListener("dragstart", (e) => {
            card.classList.add("dragging");
            e.dataTransfer.setData("text/plain", card.id);
        });
        card.addEventListener("dragend", () => {
            card.classList.remove("dragging");
        });

        listEl.appendChild(card);

        if (persist) {
            boardData[column].push({ id, text });
            saveBoardState();
        }
    }

    // Add task button
    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", () => {
            const taskText = prompt("Enter task description:");
            if (taskText && taskText.trim() !== "") {
                createTaskCard(taskText.trim()); // default to todo column
            }
        });
    }

    // Reset board button
    if (resetBoardBtn) {
        resetBoardBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to reset the board? All tasks will be lost.")) {
                localStorage.removeItem("kanbanBoardState");
                location.reload();
            }
        });
    }

    // Click handling for edit / delete
    const board = document.querySelector(".board-container");
    if (board) {
        board.addEventListener("click", (event) => {
            if (event.target.classList.contains("btn-delete")) {
                const card = event.target.closest(".task-card");
                if (card) {
                    card.remove();
                    updateBoardDataFromDOM();
                }
            } else if (event.target.classList.contains("btn-edit")) {
                const card = event.target.closest(".task-card");
                if (card) {
                    const textEl = card.querySelector(".task-text");
                    if (textEl) {
                        const newText = prompt("Edit task description:", textEl.textContent);
                        if (newText && newText.trim() !== "") {
                            textEl.textContent = newText.trim();
                            updateBoardDataFromDOM();
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
            e.preventDefault(); // Required to allow drop
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
                updateBoardDataFromDOM();
            }
        });
    });

    // Initialise board – load persisted state or show demo tasks
    const hasState = loadBoardState();
    if (!hasState) {
        // Demo tasks for fresh users
        createTaskCard("Review UI design");
        createTaskCard("Submit End‑Sem code");
    }
});
