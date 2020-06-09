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

function bindSortToTable() {
  let tableHead = document.getElementsByTagName("TH");
  for (let i = 0; i < tableHead.length; i++) {
    tableHead[i].addEventListener("click", () => {
      sortTable(i);
    });
  }
}

function isAnyCellsEmpty() {
  let tableHead = document.getElementsByTagName("TH");
  let tr = document.getElementsByTagName("tr");
  for (let i = 0; i < tr.length; i++) {
    let cellsLength = tr[i].cells.length;
    while (cellsLength < tableHead.length) {
      let td = document.createElement("td");
      tr[i].appendChild(td);
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
  btnList.forEach( (btn) => {
    btn.addEventListener('click', () => {
      btn.parentNode.parentNode.removeChild(btn.parentNode);
    })
  })
}

function initial() {
  getData("./db/test.json").then((data) => {
    createHeadRow(data);
    data.forEach(createRow);
    bindSortToTable();
    isAnyCellsEmpty();
    createCloseButton();
  });
}

initial();
