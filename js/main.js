"use strict";

const list = getSelector("wrapper");

function getSelector(selector) {
  return document.querySelector(`.${selector}`);
}

async function getData(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`ОШИБКА ПО АДРЕСУ. НЕКОРРЕКТНЫЙ АДРЕС: ${url}, 
      СТАТУС ОШИБКИ ${response.status}`);
  }

  return await response.json();
}

function rowGenerator(targetRow, arrowData, element) {
  return arrowData.forEach((value) => {
    let row = document.createElement(`${element}`);
    row.innerHTML = value;
    targetRow.append(row);
  });
}

function createHeadRow(arr) {
  const mainRow = document.createElement("tr");
  let uniqueRow = Array.from(new Set(arr.flatMap(Object.keys)));
  rowGenerator(mainRow, uniqueRow, "th");
  list.insertAdjacentElement("beforeend", mainRow);
}

function createRow(obj) {
  const row = document.createElement("tr");
  const dataRow = Object.values(obj);
  rowGenerator(row, dataRow, "td");
  list.insertAdjacentElement("beforeend", row);
}

function sortTable(column) {
  let count = 0;
  let switching = true;
  let direction = "asc";

  while (switching) {
    switching = false;

    let rows = list.getElementsByTagName("TR");
    let shouldSwitch = false;

    for (var i = 1; i < rows.length - 1; i++) {
      let x = rows[i].getElementsByTagName("TD")[column];
      let y = rows[i + 1].getElementsByTagName("TD")[column];

      if (direction == "asc") {
        if (undefined) continue;
        else if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (direction == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }

    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      count++;
    } else {
      if (count == 0 && direction == "asc") {
        direction = "desc";
        switching = true;
      }
    }
  }
}

function bindSortToTable(sortLogic) {
  let tableHead = document.getElementsByTagName("TH");
  for (let i = 0; i < tableHead.length; i++) {
    tableHead[i].addEventListener("click", () => {
      sortLogic(i);
    });
  }
}

function isAnyCellsEmpty() {
  let tableHead = document.getElementsByTagName("TH");
  let tableRow = document.getElementsByTagName("tr");
  for (let i = 0; i < tableRow.length; i++) {
    let cellsLength = tableRow[i].cells.length;
    while (cellsLength < tableHead.length) {
      let cell = document.createElement("td");
      tableRow[i].appendChild(cell);
      cellsLength++;
    }
  }
}

function createDeleteButton() {
  let tableRow = document.getElementsByTagName("tr");

  for (let i = 1; i < tableRow.length; i++) {
    let closeBtn = document.createElement("a");
    closeBtn.classList.add("delete");
    tableRow[i].append(closeBtn);
    closeBtn.addEventListener("click", () => {
      closeBtn.parentNode.parentNode.removeChild(closeBtn.parentNode);
    });
  }
}

function createEditButton(editor, dataStore, logic) {

  let tableRow = document.getElementsByTagName("tr");

  for (let i = 1; i < tableRow.length; i++) {
    let closeBtn = document.createElement("button");
    closeBtn.innerText = "EDIT";
    closeBtn.classList.add("edit");
    tableRow[i].append(closeBtn);
    closeBtn.addEventListener("click", () => {
      let getStore = dataStore(closeBtn);
      editor(getStore, logic);
    });
  }
}

function rowStore(button) {
  let store = [];
  let row = button.parentNode;
  for (let i = 0; i < row.childElementCount - 2; i++) {
    let cellValue = row.cells[i].innerText;
    store.push(cellValue);
  }
  return store;
}

function initial() {
  getData("./db/test.json").then((data) => {
    createHeadRow(data);
    data.forEach(createRow);
    bindSortToTable(sortTable);
    isAnyCellsEmpty();
    createDeleteButton();
    createEditButton(createEditWindow, rowStore, editWindowLogic);
  });
  createPopupWindow();
  popupLogic();
  submitBtn();
}

initial();

function createPopupWindow() {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.insertAdjacentHTML(
    "beforeend",
    `<div class='popup-container'>
        <div class='popup-content'>
        <h2>Введите данные</h2>

        <form class="form" id="form">

            <div class="form-control">
            <label for="user-id">ID</label>
            <input class="form-input" id="user-id">
            <i class="fas fa-check-circle"></i>
            <i class="fas fa-exclamation-circle"></i>
      <small>Wrong message</small>
            </div>

            <div class="form-control">
            <label for="name">NAME</label>
            <input class="form-input" id ="name">
            <i class="fas fa-check-circle"></i>
            <i class="fas fa-exclamation-circle"></i>
      <small>Wrong message</small>
            </div>

            <div class="form-control">
            <label for="age">AGE</label>
            <input class="form-input" id="age">
            <i class="fas fa-check-circle"></i>
            <i class="fas fa-exclamation-circle"></i>
      <small>Wrong message</small>
            </div>      		

					  </form>
          <button class='close popup-close'>&times;</button>
          <button class="btn form-btn" type="submit">Сохранить</button>
        </div>
    </div>`
  );

  document.body.insertAdjacentElement("beforeend", popup);
}

function createEditWindow([id, name, age], logic) {
  const popup = document.createElement("div");
  popup.className = "window";
  popup.insertAdjacentHTML(
    "beforeend",
    `<div class='window-container'>
        <div class='window-content'>
        <h2>Введите данные</h2>

        <form class="form" id="form">

            <div class="form-control">
            <label for="user-id">ID</label>
            <input class="form-input" id="user-id" value='${id}'>
            <i class="fas fa-check-circle"></i>
            <i class="fas fa-exclamation-circle"></i>
      <small>Wrong message</small>
            </div>

            <div class="form-control">
            <label for="name">NAME</label>
            <input class="form-input" id="name" value='${name}'>
            <i class="fas fa-check-circle"></i>
            <i class="fas fa-exclamation-circle"></i>
      <small>Wrong message</small>
            </div>

            <div class="form-control">
            <label for="age">AGE</label>
            <input class="form-input" id="age" value='${age}'>
            <i class="fas fa-check-circle"></i>
            <i class="fas fa-exclamation-circle"></i>
      <small>Wrong message</small>
            </div>      		

					  </form>
          <button class='close edit-close'>&times;</button>
          <button class="btn edit-btn" type="submit">Сохранить</button>
        </div>
    </div>`
  );
  document.body.insertAdjacentElement("beforeend", popup);
  popup.style.display = "block";

  logic();
}

function editWindowLogic() {
  const editor = getSelector("window");
  const closeBtn = getSelector("edit-close");
  closeBtn.addEventListener("click", () => {
    editor.parentNode.removeChild(editor);
  });
}

function popupLogic() {
  const button = getSelector("add-row-btn");
  const popup = getSelector("popup");
  const closeBtn = getSelector("popup-close");

  button.addEventListener("click", () => {
    return (popup.style.display = "block");
  });

  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });
}

function submitBtn() {
  const formBtn = getSelector("form-btn");
  const popup = getSelector("popup");
  formBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let check = checkInputs();
    if (check.validator) {
      delete check.validator;
      createRow(check);
      popup.style.display = "none";
    }
  });
}

function checkInputs() {
  const userName = document.getElementById("name");
  const userId = document.getElementById("user-id");
  const age = document.getElementById("age");

  const userNameValue = userName.value.trim();
  const userIdValue = userId.value.trim();
  const ageValue = age.value.trim();

  let inputData = {
    validator: true,
  };

  for (let i = 0; i < 3; i++) {
    clearForm(i);
  }

  if (userNameValue === "") {
    setInvalidFor(userName, "Not valid.");
    inputData.validator = false;
  } else {
    setValidFor(userName);
    inputData.name = userNameValue;
  }

  if (userIdValue === "") {
    setInvalidFor(userId, "ID is exist");
    inputData.validator = false;
  } else {
    setValidFor(userId);
    inputData.id = userIdValue;
  }

  if (ageValue === "") {
    setInvalidFor(age, "Enter person's age");
    inputData.validator = false;
  } else {
    setValidFor(age);
    inputData.age = ageValue;
  }
  console.log(inputData);

  return inputData;
}

function setInvalidFor(input, message) {
  const formControl = input.parentElement;
  const errorMsg = formControl.querySelector("small");

  errorMsg.innerText = message;
  formControl.className = "form-control invalid";
  return false;
}

function setValidFor(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control valid";
}

function clearForm(input) {
  const formControl = input.parentElement;
  if (formControl === undefined) {
    return null;
  } else {
    formControl.className = "form-control";
  }
}
