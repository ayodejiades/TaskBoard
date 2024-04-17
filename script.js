const laneTaskActive = document.querySelector(".activeLane");
const laneTaskCompleted = document.querySelector(".completedLane");
const modal = document.getElementById("taskModal");
const addStuff = document.getElementById("addContent");
const addButton = document.getElementById("addBtn");
const closeBtn = modal.querySelector(".close");
const mainPage = document.querySelector("main");

closeBtn.addEventListener("click", () => {
  modal.style.display = "none"; 
});

const taskContent = {
  name: modal.getElementById("taskName"),
  description: modal.getElementById("taskDescription"),
  tags: modal.getElementById("taskTags"),
  priority: modal.getElementById("taskPriority"),
  estimate: modal.getElementById("taskEstimate"),
  deadline: modal.getElementById("taskDeadline"),
}

function createTaskElement(taskContent) {
  const taskList = document.getElementById(".ul");
  const task = document.createElement("li");
  task.classList.add("task");
  task.draggable = true;
  task.id = "task" + (taskList.length + 1);

  task.innerHTML = `
    <header>
      <h3>${taskContent.name}</h3>
    </header>
    <div class="task__body">
      <small>${taskContent.description}</small>
    </div>
    <div class="task__indicators">
      <time class="deadline hi--positive" datetime="${taskContent.deadline}">${taskContent.deadline}</time>
      <data class="priority hi--negative" value="${taskContent.priority}">
        <span></span>
        <span></span>
        <span></span>
        ${taskContent.priority}
      </data>
    </div>
    <dl class="task__meta-data">
      <dt>
        <svg width="16" height="16">
          <use href="./assets/icons/Clock.svg#icon" />
        </svg>
      </dt>
      <dd>${taskContent.estimate} <small>h estimated</small></dd>
    </dl>
    <ul class="tag-list">
      <li>${taskContent.tags}</li>
    </ul>
    <div class="task__actions">
      <button class="action" title="Edit" onclick="handleEditTask('${task.id}')">
        
      </button>
      <button class="action" title="Move" onclick="moveTask('${task.id}')">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Iconly/Light/Move">
          <g id="Move">
            <path
              id="Stroke 1"
              d="M12 21V3"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              id="Stroke 2"
              d="M3 12H21"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              id="Stroke 3"
              d="M7.5 7.5L12 3L16.5 7.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              id="Stroke 4"
              d="M7.5 16.5L12 21L16.5 16.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              id="Stroke 5"
              d="M16.5 7.5L21 12L16.5 16.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              id="Stroke 6"
              d="M7.5 7.5L3 12L7.5 16.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </g>
      </svg>
      </button>
      <button
      class="action"
      title="Delete"
      onclick="deleteTask('${task.id}')"
      type="button"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Iconly/Light/Delete">
          <g id="Delete">
            <path
              id="Stroke 1"
              d="M19.325 9.4682C19.325 9.4682 18.782 16.2032 18.467 19.0402C18.317 20.3952 17.48 21.1892 16.109 21.2142C13.5 21.2612 10.888 21.2642 8.28003 21.2092C6.96103 21.1822 6.13803 20.3782 5.99103 19.0472C5.67403 16.1852 5.13403 9.4682 5.13403 9.4682"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              id="Stroke 3"
              d="M20.7082 6.23969H3.75024"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              id="Stroke 5"
              d="M17.4406 6.23967C16.6556 6.23967 15.9796 5.68467 15.8256 4.91567L15.5826 3.69967C15.4326 3.13867 14.9246 2.75067 14.3456 2.75067H10.1126C9.53358 2.75067 9.02558 3.13867 8.87558 3.69967L8.63258 4.91567C8.47858 5.68467 7.80258 6.23967 7.01758 6.23967"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </g>
      </svg>
    </button>
    </div>
  `;
  return task;
  taskList.appendChild(task);

  function deleteTask(id) {
    const taskElement = document.getElementById(id);
    const deleteMessage = "Are you sure you want to delete this task?";
    const deleted = confirm(deleteMessage);
    if(deleted){ taskElement.remove()};
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
}



function deleteTask(id) {
  const taskElement = document.getElementById(id);
  const deleteMessage = "Are you sure you want to delete this task?";
  const deleted = confirm(deleteMessage);
  if(deleted){ taskElement.remove()};
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