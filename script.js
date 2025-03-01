class GameState {
  constructor() {
      this.startWord = [];
      this.endWord = [];
      this.wordList = [];
  }
}

function init() {
  gameState = new GameState();
  pickWords(gameState);
}

async function pickWords(gameState) {

  const response = await fetch('words.txt');
  const text = await response.text();

  gameState.wordList = text.split('\n').map(word => word.trim());

  startWord = gameState.wordList[Math.floor(Math.random() * gameState.wordList.length)].split("");
  endWord = gameState.wordList[Math.floor(Math.random() * gameState.wordList.length)].split("");

  document.getElementById('startWord').innerHTML = '<span>' + startWord[0] + '</span>' + '<span>' + startWord[1] + '</span>' + '<span>' + startWord[2] + '</span>' + '<span>' + startWord[3] + '</span>'
  document.getElementById('endWord').innerHTML = '<span>' + endWord[0] + '</span>' + '<span>' + endWord[1] + '</span>' + '<span>' + endWord[2] + '</span>' + '<span>' + endWord[3] + '</span>'

  gameState.startWord = startWord;
  gameState.endWord = endWord;

  console.log(startWord, endWord);
}

function findSwap(a, b) {
  let diff = 0;
  let diffPosition = 0;

  for (let i = 0; i < a.length; i++) {
      if (a[i] != b[i]) {
        diff++;
        diffPosition = i;
      }
  }

  if (diff === 1) {
    return diffPosition;
  }
}

function gameEnd(a, b) {
  let diff = 0;

  for (let i = 0; i < a.length; i++) {
      if (a[i] != b[i]) {
        diff++;
      }
  }
  
  return diff === 1
}

function submitWord(gameState) {
  let input = document.getElementById('guess').value;
  let word = input.toUpperCase();
  let wordArray = word.split("");

  let position = findSwap(gameState.startWord, wordArray);
  if (position ===  undefined) {
    position = findSwap(gameState.endWord, wordArray);
  }
  let insert = '<div class="word chain">';
  for (let i = 0; i < wordArray.length; i++) {
    let highlight = '<span>';
    if (i === position) {
      highlight = '<span class="highlight">';
    }
  insert += highlight + wordArray[i] + '</span>';
  }
  insert += '</div>';
  
  if (wordArray.length != 4) {
    console.log('Your words should have 4 letters');
    return;
  }

  if (!gameState.wordList.includes(word)) {
    return;
  }

  if (findSwap(gameState.startWord, wordArray) != undefined) {
    document.getElementById('guess').insertAdjacentHTML("beforebegin", insert);
    gameState.startWord = wordArray;
    document.getElementById('guess').value = '';

  } else if (findSwap(gameState.endWord, wordArray) != undefined) {
    document.getElementById('guess').insertAdjacentHTML("afterend", insert);
    gameState.endWord = wordArray;
    document.getElementById('guess').value = '';
  }


  if (gameEnd(gameState.startWord, gameState.endWord)) {
    document.getElementById('guess').style = "display: none";
    document.getElementById('status').innerHTML = "Well done! Reload the page for a new puzzle.";
    document.getElementById('status').style = "color: #ACD6A3;";
  }

  console.log(startWord, endWord);
};

document.addEventListener('keydown', (event) => {
  const input = document.getElementById('guess');
  if (event.key === 'Enter') {
      submitWord(gameState);
  } else {
      input.focus();
  }
});

init();