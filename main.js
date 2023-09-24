'use strict';

// HTML ELEMENTS
const ticketContainerEl = document.querySelector('#all');
const selectedContainerEl = document.querySelector('#selected');
const notifyEl = document.querySelector('#notification');
const winnersContainerEl = document.querySelector('#winners');
const playerMsgEl = document.querySelector('#player-message');
const winningMsgEl = document.querySelector('#hits');
const drawBtn = document.querySelector('#btn-draw');
const resetBtn = document.querySelector('#btn-reset');

// global variables
let ticketNumArray = [];
let selectedNumArray = [];
let winningNumArray = [];
let hitsArray = [];
let isActive = true;
let toRetry = false;
resetBtn.classList.add('inactive');

// create a function to generate a random number
const random = function () {
  let random = Math.floor(Math.random() * 30) + 1;
  return random;
};

// create a function to show ticket numbers on ticket
const showTicketNumbers = function () {
  for (let i = 1; i <= 30; i++) {
    let toSelect = `<div class="all number-container">
                      <span id="numberToSelect" class="number number-to-select">${i}</span>
                   </div>`;

    ticketNumArray.push(i);
    ticketContainerEl.insertAdjacentHTML('beforeend', toSelect);
  }
};

// create functionality for when clicking the numbers to get selected
const selectNumbers = function () {
  const numbers = document.querySelectorAll('.number-to-select');
  notifyEl.textContent =
    selectedNumArray.length === 0 ? 'Select six from the above numbers' : '';

  numbers.forEach(num => {
    num.addEventListener('click', () => {
      let ticketNumber = Number(num.textContent);

      let selected = `<div class="number-container selected">
                        <span id="numberSelected" class="number number-selected">${ticketNumber}</span>
                     </div>`;

      if (
        selectedNumArray.length < 6 &&
        !selectedNumArray.includes(ticketNumber)
      ) {
        notifyEl.style.display = 'none';
        num.parentElement.classList.add('selected');
        selectedNumArray.push(ticketNumber);
        selectedContainerEl.insertAdjacentHTML('beforeend', selected);

        removeSelected(ticketNumber, num);
      }
    });
  });
};

// create a function to remove the selected number
const removeSelected = function (ticketNum, el) {
  const selectedNumbers = document.querySelectorAll('.number-selected');

  selectedNumbers.forEach(selNumber => {
    let selectedNumber = Number(selNumber.textContent);

    selNumber.addEventListener('click', () => {
      if (ticketNum === selectedNumber) {
        let selectedIndex = selectedNumArray.indexOf(selectedNumber);

        el.parentElement.classList.remove('selected');
        selNumber.parentElement.style.display = 'none';
        selectedNumArray.splice(selectedIndex, 1);
      }
    });
  });
};

// create a function to show winning numbers
const showWinningNumbers = function () {
  for (let i = 1; i <= 6; i++) {
    let winningNumber = `<div class="number-container">
                            <span id="winner" class="number win-number reset">?</span>
                        </div>`;

    winnersContainerEl.insertAdjacentHTML('beforeend', winningNumber);
  }
};

// create a function that compares winning numbers with selected numbers
const compareNumbers = function (selNums, winNums) {
  const selNumEL = document.querySelectorAll('.number-selected');

  selNums.forEach(selected => {
    if (winNums.includes(selected)) {
      hitsArray.push(selected);
      hitsArray = [...new Set(hitsArray)];
    }
  });

  selNumEL.forEach(el => {
    if (hitsArray.includes(Number(el.textContent))) {
      el.parentElement.classList.add('fill');
      el.style.color = '#ecf0f1';
    }
  });

  playerMsgEl.classList.add('show');
  winningMsgEl.textContent =
    hitsArray.length > 0 ? `${hitsArray.length}` : `no`;
};

// create a function to generate winning numbers
const generateNumbers = function () {
  if (selectedNumArray.length === 6 && isActive) {
    isActive = false;

    drawBtn.classList.add('inactive');

    document
      .querySelectorAll('.number-container')
      .forEach(el => el.classList.add('pointer-events'));
    const winNumEl = document.querySelectorAll('.win-number');

    winNumEl.forEach(el => {
      el.parentElement.classList.add('rotate');

      let rand = random();

      setTimeout(() => {
        if (!winningNumArray.includes(Number(rand))) {
          el.textContent = rand;
          winningNumArray.push(rand);
        } else {
          el.textContent = random();
        }

        el.style.color = '#ecf0f1';
        el.parentElement.classList.add('selected');
        el.parentElement.classList.replace('rotate', 'fill');
        el.classList.remove('win-number');
        toRetry = true;
        resetBtn.classList.remove('inactive');

        compareNumbers(selectedNumArray, winningNumArray);
      }, 3500);
    });
  }
};

// create a function to restart game
const restartGame = function () {
  if (toRetry) {
    isActive = true;
    toRetry = false;
    selectedNumArray = [];
    winningNumArray = [];
    hitsArray = [];

    document
      .querySelectorAll('.number-to-select')
      .forEach(el => el.parentElement.classList.remove('selected'));

    document
      .querySelectorAll('.number-container')
      .forEach(el => el.classList.remove('pointer-events'));

    document
      .querySelectorAll('.number-selected')
      .forEach(el => (el.parentElement.style.display = 'none'));

    notifyEl.style.display = 'block';

    drawBtn.classList.remove('inactive');
    resetBtn.classList.add('inactive');

    document.querySelectorAll('.reset').forEach(el => {
      el.textContent = '?';
      el.style.color = '#2c3e50';
      el.parentElement.classList.remove('selected');
      el.parentElement.classList.remove('fill');
      el.classList.add('win-number');
    });

    playerMsgEl.classList.remove('show');
  }
};

showTicketNumbers();
showWinningNumbers();
selectNumbers();

drawBtn.addEventListener('click', generateNumbers);
resetBtn.addEventListener('click', restartGame);
