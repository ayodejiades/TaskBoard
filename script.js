const laneTaskActive = document.querySelector(".activeLane");
const laneTaskCompleted = document.querySelector(".completedLane");
const modal = document.getElementById("taskModal");
const addStuff = document.getElementById("addContent");
const addButton = document.getElementById("addTaskBtn");
const closeBtn = modal.querySelector(".close");
const mainPage = document.querySelector

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  
});


function deleteTask(id) {
  const taskElement = document.getElementById(id);
  taskElement.remove();
}
function moveTask(id) {
  const taskElement = document.getElementById(id);
  const taskBody = taskElement.querySelector(".task__body small");

  if (taskElement.parentNode === laneTaskActive) {
    const confirmMessage = "Are you sure you want to move this task?";
    const confirmed = confirm(confirmMessage);
    if (confirmed) {
      laneTaskCompleted.appendChild(taskElement);
      taskBody.textContent = "Task completed successfully";
      taskElement.querySelectorAll(".deadline, .task__meta-data, .task__actions, .tag-list, .priority")
               .forEach(element => element.remove());
    }
  } else {
    laneTaskActive.appendChild(taskElement);
  }
}