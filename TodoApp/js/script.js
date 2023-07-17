// GET Elements
let createTodoBTN = document.getElementById("createTodoBTN"); // Get the 'createTodoBTN' element
let todoContent = document.getElementsByName("todoContent"); // Get elements with the name 'todoContent'
let addTodoForm = document.getElementById("addTodo"); // Get the 'addTodo' element
let removeBTN = document.getElementById("removeBTN"); // Get the 'removeBTN' element
let Todolist = document.getElementsByClassName("list")[0]; // Get the first element with class 'list' and store it in 'Todolist'
let removeAll = document.getElementById("removeAll"); // Get
let complatedRemoveAll = document.getElementById("complatedRemoveAll"); // Get
let hideTodo = document.getElementById("hideTodo")
let complated_list = document.getElementsByClassName("complated-list")[0]

let todoArr = []; // Database to store todo items

// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", getTodoList_Storge);

// Event listener for form submission
addTodoForm.addEventListener("submit", (event) => {
  getTodoValue(event); // Call the 'getTodoValue' function to get input value and update the array
});
// END Event

// ----------> Start Function addTodoForm
function getTodoValue(event) {
  event.preventDefault(); // Prevent page reload

  // Get the todo input value
  let TodoInput = document.getElementById("todoInput");
  let value = TodoInput.value;

  if (value.trim() === "") return; // If there is no value, do not update the database

  // Check if a todo with the same name already exists
  if (isDuplicateTodoName(value)) {
    alert("A todo with the same name already exists!");
    return;
  }

  // Create a todo object with a random ID, name, and initial checked value
  let valueObj = {
    _id: Math.floor(Math.random() * 1000),
    name: value,
    checked: false,
  };

  todoArr.push(valueObj); // Add the todo object to the 'todoArr' array
  console.log(valueObj);

  // Set the todo list in local storage
  setTodoList_Storge(valueObj);

  // Create the todo list item in the UI
  createTodoList_Ui(valueObj);

  // Clear the input value
  document.getElementById("todoInput").value = "";
}

// Check if a todo with the same name already exists
function isDuplicateTodoName(name) {
  return todoArr.some((todo) => todo.name === name);
}

function createTodoList_Ui(value) {
  // Get the todo list
  let TodoList = document.getElementsByClassName("list")[0];
  let complaedTodoList = document.getElementsByClassName("complated-list")[0];

  // Create an li element
  const liTag = document.createElement("li");
  liTag.classList.add("todoContent"); // Set the class name to "todoContent"
  TodoList.appendChild(liTag);

  // Create a checkbox element
  let ComplatedButton = document.createElement("input");
  ComplatedButton.setAttribute("type", "checkbox");
  ComplatedButton.classList.add("comlatedCheckbox"); // Set the class name to "comlatedCheckbox"
  if (value.checked === true) ComplatedButton.checked = true;
  liTag.appendChild(ComplatedButton);

  // Create a span element
  let spanTag = document.createElement("span");
  spanTag.innerHTML = value.name;
  liTag.appendChild(spanTag);

  // Create a remove button element
  const removeButton = document.createElement("button");
  removeButton.classList.add("removeBTN");
  removeButton.innerHTML = "Remove";
  liTag.appendChild(removeButton);

  if (value.checked === true) {
    complaedTodoList.appendChild(liTag);
    ComplatedButton.remove();
    let complatedMessage = document.createElement("p");
    complatedMessage.classList.add("complated");
    complatedMessage.textContent = "Completed";
    liTag.prepend(complatedMessage);
    removeButton.remove()
  } else {
    TodoList.appendChild(liTag);
  }
}

function setTodoList_Storge(value) {
  // Check if the todo list is already in local storage
  if (localStorage.getItem("TodoCollection") == null) {
    localStorage.setItem("TodoCollection", JSON.stringify([value])); // Set the todo object in local storage as an array
  } else {
    let prevStorage = JSON.parse(localStorage.getItem("TodoCollection"));
    prevStorage.push(value);
    localStorage.setItem("TodoCollection", JSON.stringify(prevStorage)); // Update the todo array in local storage
  }
}

function getTodoList_Storge() {
  let start = JSON.parse(localStorage.getItem("TodoCollection")); // Get the stored todo list from local storage
  if (localStorage.getItem("TodoCollection") === null) return;

  start.forEach((element) => {
    createTodoList_Ui(element); // Create the todo list items in the UI
  });
}

// ------------------> END Function addTodoForm

// Event listener for remove button click
Todolist.addEventListener("click", (event) => {
  if (event.target.className !== "removeBTN") return; // Check if the clicked element is the remove button
  removeTodo_Ui(event); // Call the 'removeTodo_Ui' function to remove the todo
});
// END Event Remove Button Click

// Start Function Remove Button Click
function removeTodo_Ui(event) {
  event.target.parentElement.remove(); // Remove the todo item from the UI

  // Get the name of the todo item to be deleted
  let elementDel = event.target.parentElement.children[1].textContent;
  removeTodo_Storge(elementDel); // Call the 'removeTodo_Storge' function to remove the todo from the storage
}

function removeTodo_Storge(elementDel) {
  if (localStorage.getItem("TodoCollection") === null) return;

  let Storage = JSON.parse(localStorage.getItem("TodoCollection"));

  Storage.forEach((element, index) => {
    if (elementDel === element.name) {
      Storage.splice(index, 1); // Remove the todo from the storage array
    }
    localStorage.setItem("TodoCollection", JSON.stringify(Storage)); // Update the todo list in local storage
  });
}

// END Function Remove Button Click

// Event listener for checkbox click
Todolist.addEventListener("click", (event) => {
  if (event.target.className !== "comlatedCheckbox") return; // Check if the clicked element is the checkbox
  checkCompletedTodo(event); // Call the 'checkCompletedTodo' function to mark the todo as completed
});

function checkCompletedTodo(event) {
  // Get the name of the todo item to be marked as completed
  let elementDel = event.target.parentElement.children[1].textContent;

  // Get the todo list from local storage
  let Storage = JSON.parse(localStorage.getItem("TodoCollection"));

  // Check if the checkbox is checked
  if (event.target.checked) {
    Storage.forEach((element, index) => {
      if (elementDel === element.name) {
        element.checked = true; // Set the 'checked' property to true for the corresponding todo
      }
      localStorage.setItem("TodoCollection", JSON.stringify(Storage)); // Update the todo list in local storage
    });
  } else {
    // If the checkbox is unchecked
    Storage.forEach((element, index) => {
      if (elementDel === element.name) {
        element.checked = false; // Set the 'checked' property to false for the corresponding todo
      }
      localStorage.setItem("TodoCollection", JSON.stringify(Storage)); // Update the todo list in local storage
    });
  }
}
// End  Function Remove button

// Run Event Remove All
removeAll.addEventListener("click", (event) => {
  removeAll_Storage();
  removeAll_UI();
});

// END event Remove All

//Start Function Remove All
function removeAll_Storage() {
  let Storage = JSON.parse(localStorage.getItem("TodoCollection"));
  let filteredStorage = Storage.filter((element) => element.checked);
  localStorage.setItem("TodoCollection", JSON.stringify(filteredStorage));
}

function removeAll_UI() {
  let checkboxes = document.getElementsByClassName("comlatedCheckbox");

  // Loop through the elements in reverse order to remove them
  for (let i = checkboxes.length - 1; i >= 0; i--) {
    let checkbox = checkboxes[i];
    let listItem = checkbox.parentNode; // Get the parent element (list item) of the checkbox
    listItem.parentNode.removeChild(listItem); // Remove the list item from its parent (the list)
  }
}
//END Funciton Remove All

// Run Event Remove All Completed
complatedRemoveAll.addEventListener("click", (event) => {
  complatedRemoveAll_Storage();
  complatedRemoveAll_UI();
});

// END event Remove All Completed

//Start Function Remove All Completed
function complatedRemoveAll_Storage() {
  let Storage = JSON.parse(localStorage.getItem("TodoCollection"));
  let filteredStorage = Storage.filter((element) => !element.checked);
  localStorage.setItem("TodoCollection", JSON.stringify(filteredStorage));
}

function complatedRemoveAll_UI() {
  let completed = document.getElementsByClassName("complated");

  // Loop through the elements in reverse order to remove them
  for (let i = completed.length - 1; i >= 0; i--) {
    let completed$ = completed[i];
    let listItem = completed$.parentNode; // Get the parent element (list item) of the completed message
    listItem.parentNode.removeChild(listItem); // Remove the list item from its parent (the list)
  }
}

// END Function Remove All Completed

hideTodo.addEventListener('click', () => { 
  complated_list.classList.toggle('active-hide');
})
