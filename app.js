// The source: 
// https://codepen.io/andershoff/pen/ZwQRKv
// Confetti effect
const Confettiful = function(el) {
    this.el = el;
    this.containerEl = null;
    this.confettiFrequency = 3;
    this.confettiColors = ['#EF2964', '#00C09D', '#2D87B0', '#48485E','#EFFF1D'];
    this.confettiAnimations = ['slow', 'medium', 'fast'];
    this._setupElements();
    this._renderConfetti();
  };
  
Confettiful.prototype._setupElements = function() {
    const containerEl = document.createElement('div');
    const elPosition = this.el.style.position;
    
    if (elPosition !== 'relative' || elPosition !== 'absolute') {
      this.el.style.position = 'relative';
    }
    
    containerEl.classList.add('confetti-container');
    
    this.el.appendChild(containerEl);
    
    this.containerEl = containerEl;
  };
  
  Confettiful.prototype._renderConfetti = function() {
    this.confettiInterval = setInterval(() => {
      const confettiEl = document.createElement('div');
      const confettiSize = (Math.floor(Math.random() * 3) + 7) + 'px';
      const confettiBackground = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];
      const confettiLeft = (Math.floor(Math.random() * this.el.offsetWidth)) + 'px';
      const confettiAnimation = this.confettiAnimations[Math.floor(Math.random() * this.confettiAnimations.length)];
      
      confettiEl.classList.add('confetti', 'confetti--animation-' + confettiAnimation);
      confettiEl.style.left = confettiLeft;
      confettiEl.style.width = confettiSize;
      confettiEl.style.height = confettiSize;
      confettiEl.style.backgroundColor = confettiBackground;
      
      confettiEl.removeTimeout = setTimeout(function() {
        confettiEl.parentNode.removeChild(confettiEl);
      }, 3000);
      
      this.containerEl.appendChild(confettiEl);
    }, 25);
  };
  
// Winner announcing function
function endGame(winner) {
    // Set the winner's name dynamically
    winnerNameElement.textContent = winner;

    // Show the winner announcement with animation
    winnerElement.classList.remove('hidden');
    
    // Add visible class after a slight delay for transition effect
    setTimeout(() => {
        winnerElement.classList.add('visible');
    }, 100); // delay to ensure CSS transition kicks in
}


let p1Name = prompt("Please, insert the first player's name!");
let p2Name = prompt("Please, insert the next player's name!");
document.querySelector('#p1Button').textContent = `${p1Name} wins a point`;
document.querySelector('#p2Button').textContent = `${p2Name} wins a point`;
let names  = [p1Name, p2Name];
const setsSelect = document.querySelector('#setsSelect');
const nextSetButton = document.querySelector('#nextSet');
const resetButton = document.querySelector('#resetButton');
const winnerElement = document.getElementById('winner-announcement');
const winnerNameElement = document.getElementById('winner-name');
const showDate = document.getElementById('date');
const currentDate = new Date().toDateString();
showDate.innerText = currentDate;
let [currentSet, numOfSets, isSetOver, isGameOver] = [1, 1, false, false];


//A function for generating a set table 
function generateTable(numOfSets){
    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');
    for (let i=1; i<=3; i++){
        const tableRow = document.createElement('tr');
        tableRow.setAttribute('id', `row${i}`);
        for (let j = 1; j<= numOfSets+1; j++){
            const cell = document.createElement('td');
            cell.setAttribute('id',`row${i}-column${j}`)
            if (i === 1){
                if (j === 1){
                    var cellText = document.createTextNode('Players');
                } else {
                    var cellText = document.createTextNode(`Set ${j-1}`);
                }
            } else {
                if (j === 1){
                    var cellText = document.createTextNode(names[i-2]);
                } else {
                    var cellText = document.createTextNode(' ');
                }
            }
            cell.appendChild(cellText);
            tableRow.appendChild(cell);
        }
        tableBody.appendChild(tableRow);
    }
    table.appendChild(tableBody);
    table.classList.add('table', 'is-size-4');
    column = document.querySelector('.column');
    column.appendChild(table);
}

//A table writer function indicating who won or lose
function tableWriter(set, winner, loser){
    const winnerCell = document.getElementById(`${winner}-column${set}`);
    const loserCell = document.getElementById(`${loser}-column${set}`);
    winnerCell.innerText = 'W';
    loserCell.innerText = 'L';
}

//A reset function 
function reset(){
    isSetOver = false;
    p1.score = 0;
    p2.score = 0;
    p1.display.textContent = 0;
    p2.display.textContent = 0;
    p1.display.classList.remove('has-text-success','has-text-danger');
    p2.display.classList.remove('has-text-success','has-text-danger');
    p1.button.disabled = false;
    p2.button.disabled = false;
}

function totalReset(numOfSets){
    reset();
    var trackerTable = document.querySelector('table');
    if (trackerTable) trackerTable.remove();
    generateTable(numOfSets);
    nextSetButton.style.display = 'none';
    currentSet = 1;
    p1.setWon = 0;
    p2.setWon = 0;
    isGameOver = false;
    if (window.confettiful) clearInterval(window.confettiful.confettiInterval); 
    winnerElement.classList.remove('visible');
    winnerElement.classList.add('hidden');
}

//A select element processor function
setsSelect.addEventListener('change', function(){
    numOfSets = parseInt(this.value);
    totalReset(numOfSets);
});
//When a page loads for the first time, user will see a table.
generateTable(parseInt(setsSelect.value));

//An event listener for reset button
resetButton.addEventListener('click', () => {
    totalReset(numOfSets);
});

nextSetButton.addEventListener('click', () => {
    nextSetButton.style.display = 'none';
    currentSet++;
    reset();
})
nextSetButton.style.display = 'none';

const p1 = {
    name : p1Name,
    setWon: 0,
    score: 0,
    button: document.querySelector('#p1Button'),
    display: document.querySelector('#p1ScoreDisplay'),
    tableRow: document.getElementById('row2'),
}
const p2 = {
    name: p2Name,
    setWon: 0,
    score: 0,
    button: document.querySelector('#p2Button'),
    display: document.querySelector('#p2ScoreDisplay'),
    tableRow: document.getElementById('row3'),
}

function updateScores(player, opponent){
    function playerWonSet(){
        player.setWon++;
        isSetOver = true;
        player.score = 'Game';
        player.display.classList.add('has-text-success');
        opponent.display.classList.add('has-text-danger');
        tableWriter(currentSet+1, player.tableRow['id'], opponent.tableRow['id']);
        if (player.setWon == Math.ceil(numOfSets/2)){
            window.confettiful = new Confettiful(document.querySelector('.js-container'));
            endGame(player.name);
            isGameOver = true;
        }
        if (!isGameOver){
            nextSetButton.style.display = '';
        }
        player.button.disabled = true;
        opponent.button.disabled = true;
    }
    if (!isSetOver){
        if (player.score <= 15){
            player.score +=15;
        } else if (player.score === 30){
            player.score += 10;
        } else if (player.score === 40){
            if (opponent.score === 40){
                player.score = 'Adv';
            } else if (opponent.score === 'Adv'){
                opponent.score = 40;
            } else {
                playerWonSet();
            }
        } else if (player.score === 'Adv'){
            playerWonSet();
        }
        player.display.textContent = player.score;
        opponent.display.textContent = opponent.score;
    }
}

//An event listener for player1 scoring button
p1.button.addEventListener('click', function(){
    updateScores(p1, p2);
})

//An event listener for player2 scoring button
p2.button.addEventListener('click', function(){
    updateScores(p2, p1);
})