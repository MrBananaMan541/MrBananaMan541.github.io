//To update the source code and then bundle and transiple it so it can be used,
//enter the three commands below, in the following order:
//#1 - cd work-tracker (to make sure the node package manager sets up all the files in the correct folder)
//#2 - npm i -D typescript
//#3 - npm i -D webpack webpack-cli ts-loader
//#4 - npm i -D webpack-dev-server
//Then type - npm run build - to actually run the build and live update the code
//To stop running the build and quit it, click in the terminal and Press CTRL and C
//The webpack files can then be deleted to lower the file size of this project

import { readFromLocalStorage, writeToLocalStorage, doesUserExist, deleteUser } from './dataReader.js';

//An interface that holds the structure of work items to be properly filled out and displayed
type WorkItem = {
  id: number,
  classGroupName: string,
  title: string,
  status: string,
  dueDate: string,
  dueByTime: string,
}

//An enum with strongly typed properties to describe the progress of the work items
enum TodoStatus {
  todo = "Have not started yet",
  todoTitle = "todo",
  inProgress = "In Progress",
  inProgressTitle = "inProgress",
  done = "Done",
  doneTitle = "done"
}

//References to input fields and status bar for signing into a users "account"
let username = document.querySelector("#username") as HTMLInputElement;
let password = document.querySelector("#password") as HTMLInputElement;
let signInStatus = document.querySelector("#signInStatus") as HTMLDivElement;

//Current username and password that are saved while the user is using this page
let currentUsername = "";
let currentPassword = "";

//References to the input fields and button to add a new assignment
let classGroupName = document.querySelector("#classGroupName") as HTMLInputElement;
let title = document.querySelector("#workItemName") as HTMLInputElement;
let dueDate = document.querySelector("#dueDate") as HTMLInputElement;
let time = document.querySelector("#workTime") as HTMLSelectElement;
let timeOfDay = document.querySelector("#timeOfDay") as HTMLSelectElement;
let status = document.querySelector("#status") as HTMLDivElement;

//List of all todoItems to keep track of what is left, and then save to local storage
let todoItems = [];

//List of options from each select element from each work item
let workItemsSelects = [];
//List of buttons in each work item that will appear when the work item is considered 'Done'
let removeItemButtons = [];

//Add the new work item to a list to save in a separate file
function addTodoItem(classGroupName: string, title: string, itemStatus: string, dueDate: string, timeDueBy: string): WorkItem {
  const id = getNextId(todoItems);

  //Create temp object to then add to the todoItems list
  const newTodo = {
    id,
    classGroupName: classGroupName,
    title: title,
    status: itemStatus,
    dueDate: dueDate,
    dueByTime: timeDueBy
  };

  todoItems.push(newTodo);
  writeToLocalStorage(currentUsername, "workItems", todoItems);
  console.log(todoItems);

  //Display the number of items left to work on in the status bar
  if (todoItems.length == 1) {
    status.innerHTML = `There is ${todoItems.length} item left to work on`;
  }
  else {
    status.innerHTML = `There are ${todoItems.length} items left to work on`;
  }

  return newTodo;
}

//Gets the next id in the array for the item that's being added
function getNextId(items: WorkItem[]): number {
  return items.reduce((max, x) => x.id > max ? x.id : max, 0) + 1;
}

//Formats both class/group names and title names and returns them in an array
function formatClassGroupTitles(classGroupName: string, title: string): string[] {
  let newClassGroupName = "";
    
  //Split the class/group name into an array to easily cut out any spaces and format the first word in the array
  let classGroupNameSeparated: string[] = classGroupName.split(" ");

  //Format the class group name to use for the class list id
  for (let i = 0; i < classGroupNameSeparated.length; i++) {
    if (i == 0) {
      newClassGroupName += classGroupNameSeparated[i].toLowerCase();
    }
    else {
      newClassGroupName += classGroupNameSeparated[i];
    }
  }

  //Also format the title of the assignment, if that is too long
  let titleListId = "";
  let titleSeparated = title.split(" ");
  for (let i = 0; i < titleSeparated.length; i++) {
    if (i == 0) {
      titleListId += titleSeparated[i].toLowerCase();
    }
    else {
      titleListId += titleSeparated[i];
    }
  }

  let formattedStrings: string[] = [newClassGroupName, titleListId];
  return formattedStrings;
}

//Adds a new work item to the page
function addNewItem(classGroupName: string, title: string, itemStatus: string, dueDate: string, timeDueBy: string) {
  //Add the new item to the todoItems array and save it in a local variable
  let tempToDoItem = addTodoItem(classGroupName, title, itemStatus, dueDate, timeDueBy);

  //Format the names and save them to a temp array
  let formattedTitles: string[] = formatClassGroupTitles(classGroupName, title);
  
  let newListItem;

  //Create the select element to help detect when the user selects that the work item is completed,
  //and then reveal the remove button
  let select = document.createElement('select');
  select.className = select.name = "todoStatus";
  select.innerHTML = 
    `<option class="${TodoStatus.todoTitle}" value="todo">${TodoStatus.todo}</option>` +
    `<option class="${TodoStatus.inProgressTitle}" value="inProgress">${TodoStatus.inProgress}</option>` +
    `<option class="${TodoStatus.doneTitle}" value="done">${TodoStatus.done}</option>`;

  //Set the select to the given itemStatus string, and if it's marked done, then reveal the remove button for this work item
  select.value = itemStatus;

  //Create a remove button to help with keeping track of which work item this button will delete
  let removeButton = document.createElement('button');
  removeButton.className = "removeItem";
  removeButton.name = formattedTitles[1];
  removeButton.innerHTML = "Remove Item";
  //If the work item was saved as being done, then immediately reveal the remove button
  if (select.value == "done") {
    removeButton.hidden = false;
  }
  //Otherwise, then hide the remove button
  else {
    removeButton.hidden = true;
  }

  //If there is already another assignment for the same class/group as the new one, add this assignment into the class list
  if (document.querySelector(`#${formattedTitles[0]}List`)) {
    //Create the new assignment and pass in the requried data
    newListItem = document.createElement("li");
    newListItem.id = `${formattedTitles[1]}`;
    newListItem.innerHTML = 
    '<h3>' + 
      `<p>${title}</p>` +
      `<p> Due By: ${dueDate}, ${timeDueBy} </p>` +
      '<p>' + 
        'Progress: ' +
      '</p>' +
    '</h3>';
    
    //Add the new item to the same class/group list
    document.querySelector(`#${formattedTitles[0]}List`)?.appendChild(newListItem);
  }
  //Otherwise, create a new class/group list to hold this new assignment 
  else {
    //Create the div element
    newListItem = document.createElement("div");
    newListItem.id = formattedTitles[0];

    //Create the work item to display to the screen
    newListItem.innerHTML = 
      `<h2>${classGroupName}</h2>` +
      `<ul id=${formattedTitles[0]}List>` +
        `<li id=${formattedTitles[1]}>` +
          '<h3>' + 
            `<p>${title}</p>` +
            `<p> Due By: ${dueDate}, ${timeDueBy} </p>` +
            '<p>' + 
              'Progress: ' +
            '</p>' +
          '</h3>'
        '</li>'
      '</ul';
    
    //Append the new work item to the screen
    document.querySelector("#workItems")?.appendChild(newListItem);
  }

  //Add the removeTodoItemItem function to the removeButton
  removeButton.addEventListener('click', (e: Event) => removeTodoItem(
    tempToDoItem,
    newListItem.querySelector("h3").parentElement
  ));

  //Add the hideAndRevealRemoveButton function to the select list
  select.addEventListener('change', (e: Event) => hideAndRevealRemoveButton(
    tempToDoItem,
    e.target,
    removeButton
  ));

  //Add the select to the work item and push it to the workItemsSelects array
  newListItem.querySelector('h3')?.lastChild?.appendChild(select);
  workItemsSelects.push(select);

  //Add the remove button to the work item and push it to the removeItemButtons Array
  newListItem.querySelector("h3")?.appendChild(removeButton);
  removeItemButtons.push(removeButton);
}

//Either hides or reveals the remove button on each work item, button on what option is chosen
function hideAndRevealRemoveButton(toDoItem: {}, option, removeButton: HTMLButtonElement) {
  //If the user selects done, then reveal the remove button for this work item
  if (option.value == "done") {
    removeButton.hidden = false;
  }
  //Otherwise, ensure the remove button is hidden
  else {
    removeButton.hidden = true;
  }

  toDoItem["status"] = option.value;
  todoItems[todoItems.indexOf(toDoItem)] = toDoItem;

  //Save the status of the work item to local storage
  writeToLocalStorage(currentUsername, "workItems", todoItems);
}

//Removes the given work item from the screen, the todoItems array, and external storage
function removeTodoItem(toDoItem: {}, htmlToDoItem: HTMLElement) {
  //Remove the toDoItem from the array
  todoItems.splice(todoItems.indexOf(toDoItem), 1);

  //Remove the event listener for the select, and then remove it from the workItemsSelect array
  workItemsSelects[workItemsSelects.indexOf(htmlToDoItem.querySelector('select'))].removeEventListener(
    'change', 
    (e: Event) => hideAndRevealRemoveButton
  );
  workItemsSelects.splice(workItemsSelects.indexOf(htmlToDoItem.querySelector('select')), 1);

  //Remove the toDoItem from localStorage be overriding the previous workItems
  writeToLocalStorage(currentUsername, "workItems", todoItems);

  //If this is the last todo item for this class/group, remove the class/group entirely
  if (htmlToDoItem.parentElement.childElementCount == 1) {
    htmlToDoItem.parentElement.parentElement.remove();
  }
  //Otherwise, remove the item from the page
  else {
    htmlToDoItem.remove();
  }

  console.log(todoItems);

  //Update the new number of items left to work on, or if there are none at all
  if (todoItems.length == 0) {
    status.innerHTML = "There are no more things left to work on. Hell yeah!";
  }
  else {
    status.innerHTML = ` There are ${todoItems.length} items left to work on`;
  }

  //Finally remove the removeButton from the button array
  removeItemButtons.splice(removeItemButtons.indexOf(this), 1);
}

//Load in any previous items that still need to be worked on
function loadSavedWorkItems(username: string) {
  const json = readFromLocalStorage(username, "workItems");
  //Quick check to make sure that there are items in the users workItems that can be displayed
  if (json) {
    for (let i = 0; i < json.length; i++) {
      //Loop through each work item and add it to the screen and the appropriate arrays
      addNewItem(
        json[i].classGroupName,
        json[i].title,
        json[i].status,
        json[i].dueDate,
        json[i].dueByTime
      );
    }
  }
  
}

//Hide the sign in screen and load the main app
function loadWorkTracker(currentUsername: string) {
  //Hide the sign in screen
  username.hidden = true;
  password.hidden = true;
  const signInButton = document.querySelector("#signInButton") as HTMLInputElement;
  signInButton.hidden = true;
  const createAccountButton = document.querySelector("#createAccountButton") as HTMLInputElement;
  createAccountButton.hidden = true;
  signInStatus.hidden = true;

  //Load in the main work tracker app
  classGroupName.hidden = false;
  title.hidden = false;
  dueDate.hidden = false;
  time.hidden = false;
  timeOfDay.hidden = false;
  status.hidden = false;
  const addItem = document.querySelector("#addItem") as HTMLInputElement;
  addItem.hidden = false;
  const deleteAccountButton = document.querySelector("#deleteUserButton") as HTMLInputElement;
  deleteAccountButton.hidden = false;

  //Then load in any saved work items the user may have
  loadSavedWorkItems(currentUsername);
}

//This function handles the user signing in with an existing account, and will any missing or inaccurate data in the process
function signIn(username: string, password: string, signInButton: HTMLInputElement) {
  //If the user has no account, then return an error status message and do nothing else
  if (!doesUserExist(username)) {
    signInStatus.innerText = "ERROR:\nUser does not exist; Create an account before continuing";
  }
  //Otherwise, continue below
  else {
    //Otherwise, if the users password is incorrect, inform them and do nothing else
    if (readFromLocalStorage(username, "password") != password) {
      signInStatus.innerText = "ERROR:\nIncorrect password; Please input correct password to continue";
    }
    //Then if they put in the correct password, continue below and load the actual page
    else {
      signInStatus.innerText = "Successfully signed in!";
      
      //Save the users username and password to help with saving and removing work items
      currentUsername = username;
      currentPassword = password;

      //Load in the work tracker (and any previous work items they may have)
      loadWorkTracker(username);
    }
  }
  
}

//Handles creating an account for the first time, and then calls signIn() to then enter the page
function createAccount(username: string, password: string, signInButton: HTMLInputElement) {
  //If the user hasn't entered a username, update the sign in status and stop here
  if (username == "") {
    signInStatus.innerText = "ERROR:\nEnter a username before trying to create an account";
  }
  //Otherwise, if the user hasn't entered a password, update the sign in status and stop here
  else if (password == "") {
    signInStatus.innerText = "ERROR:\nEnter a password before trying to create an account";
  }
  //Otherwise, if the user has entered a username that already exists, update the sign in status and stop here
  else if (doesUserExist(username)) {
    signInStatus.innerText = "ERROR:\nUsername already exists, enter a new username or sign into the already existing account";
  }
  //If the user has entered a valid name and password that they haven't already used, then create the account
  else {
    signInStatus.innerText = "Creating account, please wait...";
    writeToLocalStorage(username, "password", password);
    
    //Save the users new username and password to help with saving and removing work items
    currentUsername = username;
    currentPassword = password;
    
    //Load in the work tracker
    loadWorkTracker(username);
  }
}

//Simple function that deletes the users account, hides the main app screen, and reveals the user sign in screen again
function deleteAccount() {
  //Delete the users information in local storage, and empty the currentUsername and currentPassword
  deleteUser(currentUsername);
  currentUsername = "";
  currentPassword = "";

  //Clear any and all info that may still be left in the main page
  const workItemsList = document.querySelector("#workItems") as HTMLDivElement;
  workItemsList.innerHTML = "";

  //Hide the main work tracker app
  classGroupName.hidden = true;
  classGroupName.value = "";
  title.hidden = true;
  title.value = "";
  dueDate.hidden = true;
  dueDate.value = "";
  time.hidden = true;
  time.value = "1";
  timeOfDay.hidden = true;
  timeOfDay.value = "AM";
  status.hidden = true;
  status.innerHTML = "There are no more things left to work on. Hell yeah!";
  const addItem = document.querySelector("#addItem") as HTMLInputElement;
  addItem.hidden = true;
  const deleteAccountButton = document.querySelector("#deleteUserButton") as HTMLInputElement;
  deleteAccountButton.hidden = true;

  //Load in the sign in screen
  username.hidden = false;
  username.value = "";
  currentUsername = "";
  password.hidden = false;
  password.value = "";
  currentPassword = "";
  const signInButton = document.querySelector("#signInButton") as HTMLInputElement;
  signInButton.hidden = false;
  const createAccountButton = document.querySelector("#createAccountButton") as HTMLInputElement;
  createAccountButton.hidden = false;
  signInStatus.hidden = false;
  signInStatus.innerHTML = "Sign in or create a new user sign in to access your saved work";
}

//Function to quickly check and make sure the user has entered fields
function checkNewItemInputs(classGroupName: string, title: string, itemStatus: string, dueDate: string, timeDueBy: string) {
  //Check to see if there the user forgot to add either a title for class/group, title for the work item, or a due date
  if (classGroupName == "" || title == "" || dueDate == "") {
    status.innerText = "ERROR: You have forgotten to add:";

    //If the user forgot the class/group title, add it onto the status message
    if (classGroupName == "") {
      status.innerText += "\nA title for the class/group";
    }
    //If the user forgot the work item title, add it onto the status message
    if (title == "") {
      status.innerText += "\nA title for the work item";
    }
    //If the user forgot the due date, add it onto the status message
    if (dueDate == "") {
      status.innerText += "\nA due date for the work item";
    }

    status.innerText += "\n\nPlease enter the above information before creating a new item";
  }
  //Otherwise, continue to add the item
  else {
    addNewItem(classGroupName, title, itemStatus, dueDate, timeDueBy);
  }
}

//Load in necessary functions for the program to use on start
function loadTracker() {
  //Ensure that the currentUsername and currentPassword are empty, in case they somehow keep the previous user's sign in info
  currentUsername = "";
  currentPassword = "";
  
  const addItem = document.querySelector("#addItem") as HTMLInputElement;
  addItem.addEventListener("click", (e: Event) => checkNewItemInputs(
    classGroupName.value,
    title.value,
    TodoStatus.todoTitle,
    dueDate.value,
    `${time.value}${timeOfDay.value}`
  ));

  const signInButton = document.querySelector("#signInButton") as HTMLInputElement;
  signInButton.addEventListener("click", (e: Event) => signIn(
    username.value,
    password.value,
    signInButton
  ));

  const createAccountButton = document.querySelector("#createAccountButton") as HTMLInputElement;
  createAccountButton.addEventListener("click", (e: Event) => createAccount(
    username.value,
    password.value,
    signInButton
  ));

  const deleteAccountButton = document.querySelector("#deleteUserButton") as HTMLInputElement;
  deleteAccountButton.addEventListener("click", (e: Event) => deleteAccount());

  classGroupName.hidden = true;
  title.hidden = true;
  dueDate.hidden = true;
  time.hidden = true;
  timeOfDay.hidden = true;
  status.hidden = true;
  addItem.hidden = true;
  deleteAccountButton.hidden = true;
}

window.onload = () => { loadTracker(); };