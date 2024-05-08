let taskIdCounter = 0; 

function changePriority(color) {
    resetButtons();
    if (color === 'red') {
      ifColorRed();
    } else if (color === 'orange') {
      ifColorOrange();
    } else if (color === 'green') {
      ifColorGreen();
    }
  }
  
  function ifColorRed() {
    let redButton = document.getElementById('redButton');
    redButton.style.backgroundColor = "red";
    redButton.style.color = "white";
    redButton.querySelector("img").src = "./img/angles-up-solid-2.svg"; 
  }
  
  function ifColorOrange() {
    let orangeButton = document.getElementById('orangeButton');
    orangeButton.style.backgroundColor = "orange";
    orangeButton.style.color = "white";
    orangeButton.querySelector("img").src = "./img/grip-lines-solid-2.svg"; 
  }
  
  function ifColorGreen() {
    let greenButton = document.getElementById('greenButton');
    greenButton.style.backgroundColor = "rgb(8,249,0)";
    greenButton.style.color = "white";
    greenButton.querySelector("img").src = "./img/angles-down-solid-2.svg"; 
  }
  
  function resetButtons() {
    resetRedButton();
  
    resetOrangeButton();
  
    resetGreenButton();
  }
  
  function resetRedButton() {
    let redButton = document.getElementById('redButton');
    redButton.style.backgroundColor = "";
    redButton.style.color = "black";
    redButton.querySelector("img").src = "./img/angles-up-solid.svg"; 
  }
  
  function resetOrangeButton() {
    let orangeButton = document.getElementById('orangeButton');
    orangeButton.style.backgroundColor = "";
    orangeButton.style.color = "black";
    orangeButton.querySelector("img").src = "./img/grip-lines-solid.svg"; 
  }
  
  function resetGreenButton() {
    let greenButton = document.getElementById('greenButton');
    greenButton.style.backgroundColor = "";
    greenButton.style.color = "black";
    greenButton.querySelector("img").src = "./img/angles-down-solid.svg"; 
  }


  const BASE_URL = "https://contact-storage-f1196-default-rtdb.europe-west1.firebasedatabase.app/";

  async function putData(path = "", data = {}) {
      try {
          const response = await fetch(BASE_URL + path + ".json", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(data)
          });
          const responseAsJson = await response.json();
          console.log(responseAsJson);
          return responseAsJson;
      } catch (error) {
          console.error('Error putting data: ', error);
          throw error;
      }
  }
  
  async function createTask() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const assignedTo = document.getElementById('AssignedTo').value;
    const dueDate = document.getElementById('gebdat').value;
    const priority = getPriority(); 
    const category = document.getElementById('dropdownContent').value;
    const subtasksInput = document.getElementById('Subtasks');
    const subtasks = subtasksInput.value.split('\n').filter(task => task.trim() !== ''); 

    const taskId = Date.now().toString();

    const taskData = {
        id: taskId,
        title: title,
        description: description,
        assignedTo: assignedTo,
        dueDate: dueDate,
        priority: priority,
        category: category,
        subtasks: subtasks 
    };

    try {
        await putData("tasks", taskData);
        console.log('Task created successfully.');

        await displayTasks();

        subtasks.forEach(subtask => addSubtask(subtask));
    } catch (error) {
        console.error('Error creating task: ', error);
    }
}

  async function getData(path = "") {
      try {
          const response = await fetch(BASE_URL + path + ".json");
          const data = await response.json();
          return data;
      } catch (error) {
          console.error('Error getting data: ', error);
          throw error;
      }
  }

  function getPriority() {
    const redButton = document.getElementById('redButton');
    const orangeButton = document.getElementById('orangeButton');
    const greenButton = document.getElementById('greenButton');

    if (redButton.style.backgroundColor === 'red') {
        return 'urgent';
    } else if (orangeButton.style.backgroundColor === 'orange') {
        return 'medium';
    } else if (greenButton.style.backgroundColor === 'rgb(8, 249, 0)') {
        return 'low';
    } else {
        return ''; 
    }
}

document.addEventListener("DOMContentLoaded", function() {
  const addButton = document.querySelector('.inputWithButton');

  addButton.addEventListener('click', function() {
      const inputField = document.getElementById('Subtasks');
      const subtaskValue = inputField.value.trim();
      
      if (subtaskValue !== '') {
          addSubtask(subtaskValue);
          inputField.value = ''; 
      }
  });
});

function addSubtask(subtask) {
  const subtaskList = document.getElementById('subtaskList');
  const newSubtask = document.createElement('li');
  newSubtask.textContent = subtask;
  subtaskList.appendChild(newSubtask);
}

function clearSubtasks() {
  const inputField = document.getElementById('Subtasks');
  inputField.value = ''; 
}

function addSubtaskToList() {
  const inputField = document.getElementById('Subtasks');
  const subtaskValue = inputField.value.trim();
  
  if (subtaskValue !== '') {
      addSubtask(subtaskValue);
      clearSubtasks(); 
  }
}

function replaceAddButton() {
  const inputWithButtonContainer = document.getElementById('inputWithButtonContainer');
  inputWithButtonContainer.innerHTML = `
      <input placeholder="Add new subtask" type="text" id="Subtasks" name="Subtasks" class="inputWithButton">
      <img class="vectorImg1" src="./img/VectorBlack.png" onclick="clearSubtasks()">
      <div class="divider"></div>
      <img class="vectorImg2" src="./img/Vector 17.png" onclick="addSubtaskToList()">
  `;
}