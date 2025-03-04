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


  gameState.startWord = ["P", "O", "T", "S"]
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

function getSwapPosition(a, b) {
  let swapPosition = [];
  let diff = 0;

  for (let i = 0; i < a.length; i++) {
    if (a[i] != b[i]) {
      diff++;
      swapPosition = i;
    }
  }

  if (diff === 1) {
    return [swapPosition];
  }
}

function getShufflePosition(a, b) {
  let swapPosition = [];
  for (let i = 0; i < a.length; i++) {
      swapPosition.push(i);
    }

  return swapPosition;
}

function submitWord(gameState) {

  let input = document.getElementById('guess').value;
  let upper = input.toUpperCase();
  let word = upper.split("");


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

  let changeTypeStart = compareWords(gameState.startWord, word);
  let changeTypeEnd = compareWords(gameState.endWord, word);

  console.log(changeTypeStart);
  console.log(changeTypeEnd);

  let insert = "";
  if (
    changeTypeStart === "swap" ||
    changeTypeStart === "shuffle" ||
    changeTypeStart === "addition" ||
    changeTypeStart === "subtraction"
  ) {
    if (changeTypeStart === "swap") {
      let positions = getSwapPosition(gameState.startWord, word);
      insert = writeHTML(word, positions);
    }

    if (changeTypeStart === "shuffle") {
      let positions = getShufflePosition(gameState.startWord, word);
      insert = writeHTML(word, positions);
      // console.log(insert, word, positions)
    }

    document.getElementById('guess').insertAdjacentHTML("beforebegin", insert);
    gameState.startWord = word;
    document.getElementById('guess').value = "";
    gameEnd(gameState.startWord, gameState.endWord);
  } else if (
    changeTypeEnd === "swap" ||
    changeTypeEnd === "shuffle" ||
    changeTypeEnd === "addition" ||
    changeTypeEnd === "subtraction"
  ) {
    if (changeTypeEnd === "swap") {
      let positions = getSwapPosition(gameState.endWord, word);
      insert = writeHTML(word, positions);
    }

    document.getElementById('guess').insertAdjacentHTML("afterend", insert);
    gameState.endWord = word;
    document.getElementById('guess').value = "";
    gameEnd(gameState.startWord, gameState.endWord);
  }
  
  console.log(compareWords(gameState.startWord, gameState.endWord));
}

function writeHTML(word, positions) {
  let insert = '<div class="word chain">';
  for (let i = 0; i < word.length; i++) {
    let highlight = '<span>';

    console.log(positions, i, positions.includes(i))
    if (positions.includes(i)) {
      highlight = '<span class="highlight">';
    }
    insert += highlight + word[i] + '</span>';
    }
    insert += '</div>';
    return insert;
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