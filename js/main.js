"use strict";

const list = document.querySelector(".wrapper");

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

function sortTable(columnn) {
  let count = 0;
  let switching = true;
  let direction = "asc";

  while (switching) {
    switching = false;

    let rows = list.getElementsByTagName("TR");
    let shouldSwitch = false;

    for (var i = 1; i < rows.length - 1; i++) {
      let x = rows[i].getElementsByTagName("TD")[columnn];
      let y = rows[i + 1].getElementsByTagName("TD")[columnn];

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

function createCloseButton() {
  let tableRow = document.getElementsByTagName("tr");

  for (let i = 1; i < tableRow.length; i++) {
    let closeBtn = document.createElement("a");
    closeBtn.classList.add("close");
    tableRow[i].insertAdjacentElement("beforeend", closeBtn);
  }

  let btnList = document.querySelectorAll(".close");
  btnList.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentNode.parentNode.removeChild(btn.parentNode);
    });
  });
}

function initial() {
  getData("./db/test.json").then((data) => {
    createHeadRow(data);
    data.forEach(createRow);
    bindSortToTable(sortTable);
    isAnyCellsEmpty();
    createCloseButton();
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
          <button class='popup-close'>&times;</button>
          <button class="form-btn" type="submit">Сохранить</button>
        </div>
    </div>`
  );

  document.body.insertAdjacentElement("beforeend", popup);
}

function popupLogic() {
  const button = document.querySelector(".add-row-btn");
  const popup = document.querySelector(".popup");
  const closeButton = document.querySelector(".popup-close");
  button.addEventListener("click", () => {
    return (popup.style.display = "block");
  });

  closeButton.addEventListener("click", () => {
    return (popup.style.display = "none");
  });


}




function submitBtn () {
  const formBtn = document.querySelector('.form-btn');
  formBtn.addEventListener('click', (e) => {
    console.log(true);
    e.preventDefault();
    checkInputs();
  })
}


function checkInputs () {

  const userName = document.getElementById('name');
  const userId = document.getElementById('user-id');
  const age = document.getElementById('age');


  const userNameValue = userName.value;
  const userIdValue = userId.value.trim();
  const ageValue = age.value.trim();

  for (let i = 0; i<3;i++) {
    clearForm(i);
  }

  if (userNameValue === '') {
    setInvalidFor(userName, 'Error, not valid.')
  }
  else {
    setValidFor(userName);
  }

  if (userIdValue === '') {
    setInvalidFor(userId, 'Error , ID is exist')
  }
  else {
    setValidFor(userId);
  }

  if (ageValue === '') {
    setInvalidFor(age, 'Enter person\'s age')
  }
  else {
    setValidFor(age);
  }
}

function setInvalidFor (input, message) {
  const formControl = input.parentElement;
  const errorMsg = formControl.querySelector('small');
  
  errorMsg.innerText = message;
  formControl.className = 'form-control invalid'
  return false;
}

function setValidFor (input) {
  const formControl = input.parentElement;  
  formControl.className = 'form-control valid'

}

function clearForm (input) {
  const formControl = input.parentElement;
  if(formControl === undefined) {
    return null;
  }
  else {
  formControl.className = 'form-control';}
}
// let inputs = document.querySelectorAll("input[data-rule]");

// for (let input of inputs) {
//   input.addEventListener("blur", function () {
//     let rule = this.dataset.rule;
//     let value = this.value;
//     let check;
//     switch (rule) {
//       case "length":
//         let from = +this.dataset.from;
//         let to = +this.dataset.to;
//         let regex = new RegExp(`<{${from},${to}}>`, "gm");
//         check = regex.test(value);
//         break;

//       case "number":
//         check = /\S[0-9]/gm.test(value);
//         break;
//     }
   
    
//   });
// }
