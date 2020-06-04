"use strict";

const container = document.querySelector(".container");

async function getData(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`ОШИБКА ПО АДРЕСУ. НЕКОРРЕКТНЫЙ АДРЕС: ${url}, 
      СТАТУС ОШИБКИ ${response.status}`);
  }

  return await response.json();
}
function createMainRow() {
  const mainRow = `
<div class="main-row">
         <div class="column column-1"></div>
         <div class="column column-2"></div>
         <div class="column column-3"></div>
      </div>`;

  container.insertAdjacentHTML("beforeend", mainRow);
}
function createRow({ ID, Name, Age }) {
  const row = `
<div class="row">
    <div class="column column-1">${ID}</div>
    <div class="column column-2">${Name}</div>
    <div class="column column-3">${Age}</div>
</div>
`;
container.insertAdjacentHTML('beforeend', row);
}

function initial() {
   getData("./db/test.json").then((data) => {
      data.forEach(createRow);
   });
}

initial();

let tast = [{'ID':1, 'Some':'Reach'},{'2':2}]

function someTesting ( arr ) {
   let may = new Map(Object.keys(arr[0]));
   console.log(may)
}

someTesting(tast);