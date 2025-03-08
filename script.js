class GameState {
  constructor() {
      this.startWord = [];
      this.endWord = [];
      this.startChain = [];
      this.endChain = [];
      this.wordList = [];
  }

  calcScore() {
    return (this.startChain.length + this.endChain.length) - 2;
  }
}

function init() {
  console.clear();
  resetPuzzle();
  gameState = new GameState();
  pickWords(gameState).then(displayWords);
}

function resetPuzzle() {
  document.getElementById('game').innerHTML = '<div class="word" id="startWord"></div><div class="direction">↓</div><input type="text" autocorrect="off" autocomplete="off" id="guess"><div class="direction">↑</div><div class="word" id="endWord"></div>'
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

  // For debugging:
  // gameState.startWord = ["P", "E", "T"]
  // gameState.endWord = ["S", "N", "A", "P", "S"]

  return gameState;
}

function displayWords(gameState) {
  gameState.startChain.push(gameState.startWord);
  gameState.endChain.push(gameState.endWord);

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

function customPuzzle() {
  console.clear();
  resetPuzzle();
  gameState = new GameState();
  pickWords(gameState).then((gameState) => {
    let customStart = prompt("Enter start word.");
    let customEnd = prompt("Enter end word.");
    gameState.startWord = customStart.toUpperCase().split('');
    gameState.endWord = customEnd.toUpperCase().split('');
    displayWords(gameState);
  });
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
  let shufflePosition = [];
  for (let i = 0; i < a.length; i++) {
    shufflePosition.push(i);
    }

  return shufflePosition;
}

function getAdditionPosition(a, b) {
  let additionPosition = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      additionPosition = i;
      return [additionPosition];
    }
  }
  additionPosition = a.length;
  return [additionPosition];
}

function getSubtractionPosition(a, b) {
  let subtractionPosition = 0;
  for (let i = 0; i < b.length; i++) {
    if (a[i] !== b[i]) {
      return [i - 1, i];
    }
  }
  subtractionPosition = [b.length - 1];
  return subtractionPosition;
}

function submitWord(gameState) {

  let input = document.getElementById('guess').value.trim();
  let upper = input.toUpperCase();
  let word = upper.split("");


  console.log(gameState.startWord, word, compareWords(gameState.startWord, word));
  console.log(gameState.endWord, word, compareWords(gameState.endWord, word));

  if (!gameState.wordList.includes(upper)) {
    document.getElementById('guess').value = "Invalid";
    document.getElementById('guess').style = "color: #DC6B6E;" ;
    setTimeout(() => {
      document.getElementById('guess').value = "";
      document.getElementById('guess').style = "color: #2E2F38;";
    }, 500);
    return;
  }

  if (compareWords(gameState.startWord, word) === "same" || compareWords(gameState.endWord, word) === "same") {
    document.getElementById('guess').value = "Same word";
    document.getElementById('guess').style = "color: #DC6B6E;" ;
    setTimeout(() => {
      document.getElementById('guess').value = "";
      document.getElementById('guess').style = "color: #2E2F38;";
    }, 500);
    return;
  }

  let changeTypeStart = compareWords(gameState.startWord, word);
  let changeTypeEnd = compareWords(gameState.endWord, word);

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
      insert = writeHTML(word, positions, changeTypeStart);
    }

    if (changeTypeStart === "addition") {
      let positions = getAdditionPosition(gameState.startWord, word);
      insert = writeHTML(word, positions, changeTypeStart);
    }

    if (changeTypeStart === "subtraction") {
      let positions = getSubtractionPosition(gameState.startWord, word);
      insert = writeHTML(word, positions, changeTypeStart);
    }

    document.getElementById('guess').insertAdjacentHTML("beforebegin", insert);
    gameState.startWord = word;
    getDefinitionStart(gameState);
    gameState.startChain.push(word);
    document.getElementById('guess').value = "";
    gameEnd(gameState.startWord, gameState.endWord, gameState);
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

    if (changeTypeEnd === "shuffle") {
      let positions = getShufflePosition(gameState.endWord, word);
      insert = writeHTML(word, positions, changeTypeEnd);
    }

    if (changeTypeEnd === "addition") {
      let positions = getAdditionPosition(gameState.endWord, word);
      insert = writeHTML(word, positions, changeTypeEnd);
    }

    if (changeTypeEnd === "subtraction") {
      let positions = getSubtractionPosition(gameState.endWord, word);
      insert = writeHTML(word, positions, changeTypeEnd);
    }

    document.getElementById('guess').insertAdjacentHTML("afterend", insert);
    gameState.endWord = word;
    getDefinitionEnd(gameState);
    gameState.endChain.push(word);
    document.getElementById('guess').value = "";
    gameEnd(gameState.startWord, gameState.endWord, gameState);
  }

  if (changeTypeStart === "N/A" && changeTypeEnd === "N/A") {
    document.getElementById('guess').style = "color:#DC6B6E;";
    setTimeout(() => {
      document.getElementById('guess').value = "";
      document.getElementById('guess').style = "color: #2E2F38";
    }, 500);
  }
}

function writeHTML(word, positions, changeType) {
  let insert = '<div class="word chain">';
  for (let i = 0; i < word.length; i++) {
    let highlight = '<span>';

    if (positions.includes(i)) {
      highlight = '<span class="highlightYellow">';
      if (changeType === "shuffle") {
        highlight = '<span class="highlightBlue">';
      }
      if (changeType === "addition") {
        highlight = '<span class="highlightGreen">';
      }
      if (changeType === "subtraction") {
        if (positions.length === 1) {
          highlight = '<span class="highlightRedLeft">';
        }
        if (positions.length === 2 && i === positions[0]) {
          highlight = '<span class="highlightRedLeft">';
        }
        if (positions.length === 2 && i === positions[1]) {
          highlight = '<span class="highlightRedRight">';
        }
      }
    }
    insert += highlight + word[i] + '</span>';
    }
    insert += '</div>';
    return insert;
}

function gameEnd(a, b, gameState) {
  if (
    compareWords(a, b) === "swap" ||
    compareWords(a, b) === "shuffle" ||
    compareWords(a, b) === "addition" ||
    compareWords(a, b) === "subtraction" ||
    compareWords(a, b) === "same"
  ) {
    document.getElementById('guess').insertAdjacentHTML('afterend', '<div id="line"></div>');

    document.getElementById('guess').style = "display: none";
    document.getElementById('status').innerHTML = "Well done! Your score is " + gameState.calcScore() + ".";

    document.getElementById('status').style = "color: #579E47;";
    document.getElementById('buttons').style = "display: flex";

  }
}

function getDefinitionStart(gameState) {

  let word = '';
  for (let i = 0; i < gameState.startWord.length; i++) {
    word += gameState.startWord[i].toLowerCase();
  }
  
  fetch(`https://en.wiktionary.org/api/rest_v1/page/definition/${word}`)
  .then(response => response.json())
  .then(data => console.log(data))
}

function getDefinitionEnd(gameState) {

  let word = '';
  for (let i = 0; i < gameState.endWord.length; i++) {
    word += gameState.endWord[i];
  }
  
  fetch(`https://en.wiktionary.org/api/rest_v1/page/definition/${word}`)
  .then(response => response.json())
  .then(data => console.log(data))
}

function findCountsStart(gameState) {

  arrayList = [];

  for (let i = 0; i < gameState.wordList.length; i++) {
    arrayList.push(gameState.wordList[i].split(''))
  }
  
  let swapCount = 0;
  let swaps = [];
  let shuffleCount = 0;
  let shuffles = [];
  let addCount = 0;
  let adds = [];
  let subCount = 0;
  let subs = [];

  for (let i = 0; i < arrayList.length; i++) {
    
    if (compareWords(gameState.startWord, arrayList[i]) === "swap") {
      swapCount++;
      swaps.push(arrayList[i]);
    }

    if (compareWords(gameState.startWord, arrayList[i]) === "shuffle") {
      shuffleCount++;
      shuffles.push(arrayList[i]);
    }

    if (compareWords(gameState.startWord, arrayList[i]) === "addition") {
      addCount++;
      adds.push(arrayList[i]);
    }
    
    if (compareWords(gameState.startWord, arrayList[i]) === "subtraction") {
      subCount++;
      subs.push(arrayList[i]);
    }
  }
  console.log("START Swaps:", swapCount, swaps);
  console.log("START Shuffles:", shuffleCount, shuffles);
  console.log("START Additions:", addCount, adds);
  console.log("START Substractions:", subCount, subs);
}

function findCountsEnd(gameState) {

  arrayList = [];

  for (let i = 0; i < gameState.wordList.length; i++) {
    arrayList.push(gameState.wordList[i].split(''))
  }
  
  let swapCount = 0;
  let swaps = [];
  let shuffleCount = 0;
  let shuffles = [];
  let addCount = 0;
  let adds = [];
  let subCount = 0;
  let subs = [];

  for (let i = 0; i < arrayList.length; i++) {
    
    if (compareWords(gameState.endWord, arrayList[i]) === "swap") {
      swapCount++;
      swaps.push(arrayList[i]);
    }

    if (compareWords(gameState.endWord, arrayList[i]) === "shuffle") {
      shuffleCount++;
      shuffles.push(arrayList[i]);
    }

    if (compareWords(gameState.endWord, arrayList[i]) === "addition") {
      addCount++;
      adds.push(arrayList[i]);
    }
    
    if (compareWords(gameState.endWord, arrayList[i]) === "subtraction") {
      subCount++;
      subs.push(arrayList[i]);
    }
  }
  console.log("END Swaps:", swapCount, swaps);
  console.log("END Shuffles:", shuffleCount, shuffles);
  console.log("END Additions:", addCount, adds);
  console.log("END Substractions:", subCount, subs);
}

init();