const taskInput = document.querySelector(".task-input input");
const taskBox = document.querySelector(".task-box");
const clearBtn = document.querySelector(".clear-btn");
const filters = document.querySelectorAll(".filters span");

let editId;
let isEditedTask = false;

// getting localStorage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    // console.log(btn);

    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");

    showTodo(btn.id);
  });
});

/* -------------------------------- Show Todo ------------------------------- */
function showTodo(filter) {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      //if todo status is completed, set the isCompleted value ti checked
      let isCompleted = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        li += `<li class="task">
              <label for="${id}">
                <input type="checkbox" onclick="updateStatus(this)" id="${id}" ${isCompleted}/>
                <p class="${isCompleted}">${todo.name}</p>
              </label>
              <div class="settings">
                <span onclick="showMenu(this)" class="material-symbols-outlined"> more_horiz </span>
                <ul class="task-menu">
                  <li onclick="editTask(${id}, '${todo.name}')"><span class="material-symbols-outlined">edit </span>Edit</li>
                  <li onclick="deleteTask(${id}, '${filter}')"><span class="material-symbols-outlined"> delete </span>Delete</li>
                </ul>
              </div>
            </li>`;
      }
    });
  }
  taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
}
showTodo("all");
/* -------------------------------- /Show Todo ------------------------------- */

/* -------------------------------- Show Menu ------------------------------- */
function showMenu(selectedTask) {
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");

  // remove class from the task menu on the document click
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "SPAN" || e.target != selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}
/* -------------------------------- /Show Menu ------------------------------- */

/* -------------------------- Update LoacalStaorage ------------------------- */

function updateLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todos));
}
/* -------------------------- /Update LoacalStaorage ------------------------- */

/* ------------------------------- Delete Task ------------------------------ */
function deleteTask(taskId, filter) {
  //remove selected task from array todos
  isEditedTask = false;
  todos.splice(taskId, 1);
  updateLocalStorage();
  showTodo(filter);
}
/* ------------------------------- /Delete Task ------------------------------ */

/* ------------------------------- Edit Task ------------------------------ */

function editTask(taskId, taskName) {
  editId = taskId;
  isEditedTask = true;
  taskInput.value = taskName;
  taskInput.focus();
  taskInput.classList.add('active')
}
/* ------------------------------- Edit Task ------------------------------ */

/* ------------------------------ Update status ----------------------------- */
function updateStatus(selectedTask) {
  // console.log(selectedTask);
  // getting paragraph that contains task name
  let taskName = selectedTask.parentElement.lastElementChild;
  console.log(taskName);
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    // updating the status of selected task to "completed"
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    // updating the status of selected task to "pending"
    todos[selectedTask.id].status = "pending";
  }
  updateLocalStorage();
}
/* ------------------------------ /Update status ----------------------------- */

/* ------------------------------ Add new task ------------------------------ */
taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();

  if (e.key == "Enter" && userTask) {
    // if isEditedTask isnt true
    if (!isEditedTask) {
      //if todos isnt to exists pass an empty array to todos
      todos = !todos ? [] : todos;
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo); // adding new task to todos
    } else {
      isEditedTask = false;
      todos[editId].name = userTask;
    }

    taskInput.value = "";
    updateLocalStorage();
    showTodo(document.querySelector('span.active').id);
  }
});
/* ------------------------------ Add new task ------------------------------ */

/* -------------------------------- Clear All ------------------------------- */
clearBtn.addEventListener("click", () => {
  isEditedTask = false;
  todos.splice(0, todos.length);
  updateLocalStorage();
  showTodo("all");
});
/* -------------------------------- /Clear All ------------------------------- */
