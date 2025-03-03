class GameState {
  constructor() {
      this.startWord = [];
      this.endWord = [];
      this.wordList = [];
      this.wordChain = [];
  }
}

function init() {
  gameState = new GameState();
  pickWords(gameState);
}

async function pickWords(gameState) {
  const response = await fetch('words.json');
  const data = await response.json();
  
  for (let i = 0; i < data.length; i++) {
      gameState.wordList.push(data[i].word);
  }

  let seedWords = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].seed === true) {
      seedWords.push(data[i].word);
    }
  }

  gameState.startWord = seedWords[Math.floor(Math.random() * seedWords.length)].split("");
  gameState.endWord = seedWords[Math.floor(Math.random() * seedWords.length)].split("");

  gameState.wordChain.push(gameState.startWord, gameState.endWord);

  let startWordHTML = '';
  for (let i = 0; i < gameState.startWord.length; i++) {
    startWordHTML += '<span>' + gameState.startWord[i] + '</span>';
  }
  document.getElementById('startWord').innerHTML = startWordHTML;

  let endWordHTML = '';
  for (let i = 0; i < gameState.endWord.length; i++) {
    endWordHTML += '<span>' + gameState.endWord[i] + '</span>';
  }
  document.getElementById('endWord').innerHTML = endWordHTML;

  console.log("START:", gameState.startWord, gameState.endWord);
}

document.addEventListener('keydown', (event) => {
  const input = document.getElementById('guess');
  if (event.key === 'Enter') {
      submitWord(gameState);
  } else {
      input.focus();
  }
});

function compareWords(a, b) {
  if (a.length === b.length) {
    let diff = 0;

    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) {
          diff++;
        }
    }

    if (diff === 1) {
      return "swap";
    }

    if (a.toString() === b.toString()) {
      return "same";
    }

    if (a.toString() !== b.toString() && a.slice().sort().toString() === b.slice().sort().toString()) {
      return "shuffle";
    }
  } else if (a.length === b.length - 1) {

      let i = 0, j = 0;
      let diff = 0;

      while (i < a.length && j < b.length) {
          if (a[i] !== b[j]) {
              diff++;
              j++;
          } else {
              i++;
              j++;
          }
      }

      if (diff <= 1) {
        return "addition";
      }
    } else if (a.length === b.length + 1) {
      let i = 0, j = 0;
      let diff = 0;

        while (i < a.length && j < b.length) {
            if (a[i] !== b[j]) {
                diff++;
                i++;
            } else {
                i++;
                j++;
            }
        }
        if (diff <= 1) {
          return "subtraction";
        }
      }
      
  return "N/A";
}

function submitWord(gameState) {

  let input = document.getElementById('guess').value;
  let upper = input.toUpperCase();
  let word = upper.split("");

  let insert = '<div class="word chain">';
  for (let i = 0; i < word.length; i++) {
    let highlight = '<span>';
    insert += highlight + word[i] + '</span>';
  }
  insert += '</div>';

  console.log(gameState.startWord, word, compareWords(gameState.startWord, word));
  console.log(gameState.endWord, word, compareWords(gameState.endWord, word));

  if (!gameState.wordList.includes(upper)) {
    document.getElementById('guess').value = "Invalid";
    document.getElementById('guess').style = "border: 1px solid red; color: red;" ;
    setTimeout(() => {
      document.getElementById('guess').value = "";
      document.getElementById('guess').style = "border: 1px solid black; color: black;";
    }, 500);
    return;
  }

  if (compareWords(gameState.startWord, word) === "same" || compareWords(gameState.endWord, word) === "same") {
    document.getElementById('guess').value = "Same word";
    document.getElementById('guess').style = "border: 1px solid red; color: red;" ;
    setTimeout(() => {
      document.getElementById('guess').value = "";
      document.getElementById('guess').style = "border: 1px solid black; color: black;";
    }, 500);
    return;
  }

  if (
    compareWords(gameState.startWord, word) === "swap" ||
    compareWords(gameState.startWord, word) === "shuffle" ||
    compareWords(gameState.startWord, word) === "addition" ||
    compareWords(gameState.startWord, word) === "subtraction"
  ) {
    document.getElementById('guess').insertAdjacentHTML("beforebegin", insert);
    gameState.startWord = word;
    document.getElementById('guess').value = "";
    gameEnd(gameState.startWord, gameState.endWord);
  }

  if (
    compareWords(gameState.endWord, word) === "swap" ||
    compareWords(gameState.endWord, word) === "shuffle" ||
    compareWords(gameState.endWord, word) === "addition" ||
    compareWords(gameState.endWord, word) === "subtraction"
  ) {
    document.getElementById('guess').insertAdjacentHTML("afterend", insert);
    gameState.endWord = word;
    document.getElementById('guess').value = "";
    gameEnd(gameState.startWord, gameState.endWord);

  }


  console.log(compareWords(gameState.startWord, gameState.endWord));
}

function gameEnd(a, b) {
  if (
    compareWords(a, b) === "swap" ||
    compareWords(a, b) === "shuffle" ||
    compareWords(a, b) === "addition" ||
    compareWords(a, b) === "subtraction" ||
    compareWords(a, b) === "same"
  ) {
    document.getElementById('guess').style = "display: none";
    document.getElementById('status').innerHTML = "Well done! Reload the page for a new puzzle.";
    document.getElementById('status').style = "color: #ACD6A3;";
    console.log("done")
  }
}

init();