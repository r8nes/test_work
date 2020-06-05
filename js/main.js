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

function pGenerator(target, current) {
 return current.forEach( value => {
    let element = document.createElement("p");
    element.innerHTML = value;
    target.append(element);
  });
}

function createMainRow(arr) {
  const mainRow = document.createElement("li");
  let uniqueRow = Array.from(new Set(arr.flatMap(Object.keys)));
  pGenerator(mainRow, uniqueRow);
  list.insertAdjacentElement("beforeend", mainRow);
}

function createRow(obj) {
  const row = document.createElement("li");
  const dataRow = Object.values(obj);
  pGenerator(row, dataRow);
  list.insertAdjacentElement("beforeend", row);
}

function initial() {
  getData("./db/test.json").then((data) => {
    createMainRow(data);
    data.forEach(createRow);
  });
}

initial();
