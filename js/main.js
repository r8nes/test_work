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

function rowGenerator(target, arrowData, element) {
 return arrowData.forEach( value => {
    let row = document.createElement(`${element}`);
    row.innerHTML = value;
    target.append(row);
  });
}

function createMainRow(arr) {
  const mainRow = document.createElement("tr");
  let uniqueRow = Array.from(new Set(arr.flatMap(Object.keys)));
  rowGenerator(mainRow, uniqueRow, 'th');
  list.insertAdjacentElement("beforeend", mainRow);
}

function createRow(obj) {
  const row = document.createElement("tr");
  const dataRow = Object.values(obj);
  rowGenerator(row, dataRow, 'td');
  list.insertAdjacentElement("beforeend", row);
}

function sortTable(n) {

  let count = 0;
  let switching = true;
  let direction= "asc";

  while (switching) {
    switching = false;
    let rows = list.getElementsByTagName("TR");
    let shouldSwitch = false;
    for (var i = 1; i < rows.length - 1; i++) {
      let x = rows[i].getElementsByTagName("TD")[n];
      let y = rows[i + 1].getElementsByTagName("TD")[n];
      if (direction == "asc") {
        if(undefined) continue;
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
      count ++;
    } else {
      if (count == 0 && direction == "asc") {
        direction = "desc";
        switching = true;
      }
    }
  }
}

function bindSortToTable () {
  let thead = document.getElementsByTagName("TH");
  console.log(thead, thead.length);
  for (let i = 0; i<thead.length; i++) {
    thead[i].addEventListener('click', () => {
      sortTable(i);
    })
  }
}

function initial() {
  getData("./db/test.json").then((data) => {
    createMainRow(data);
    data.forEach(createRow);
    bindSortToTable();

  });
}

initial();

