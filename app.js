document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById("add-task-btn");

    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", () => {
            const taskText = prompt("Enter task description:");
            if (taskText && taskText.trim() !== "") {
                console.log("Task input captured:", taskText.trim());
            }
        });
    }
});
