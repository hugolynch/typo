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

  const fourLetterWords = gameState.wordList.filter(word => word.length === 4);

  if (fourLetterWords.length === 0) {
    console.error("No 4-letter words found in the word list.");
    return;
  }

  startWord = fourLetterWords[Math.floor(Math.random() * fourLetterWords.length)].split("");
  endWord = fourLetterWords[Math.floor(Math.random() * fourLetterWords.length)].split("");

  let startWordHTML = '';
  for (let i = 0; i < startWord.length; i++) {
    startWordHTML += '<span>' + startWord[i] + '</span>';
  }
  document.getElementById('startWord').innerHTML = startWordHTML;

  let endWordHTML = '';
  for (let i = 0; i < endWord.length; i++) {
    endWordHTML += '<span>' + endWord[i] + '</span>';
  }
  document.getElementById('endWord').innerHTML = endWordHTML;

  gameState.startWord = startWord;
  gameState.endWord = endWord;

  console.log(startWord, endWord);
}

function findSubstitutionPosition(a, b) {
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

function compareWords(word1, word2) {
  if (word1.length === word2.length) {
    let diff = 0;
    let diffPositions = [];
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] !== word2[i]) {
        diff++;
        diffPositions.push(i);
      }
    }

    if (diff === 1) {
      return "substitution";
    }

    const word1Sorted = word1.slice().sort().join('');
    const word2Sorted = word2.slice().sort().join('');
    if (word1Sorted === word2Sorted) {
      return "shuffle";
    }
  } else if (word1.length === word2.length - 1) {
      let i = 0, j = 0;
      let diff = 0;
      while (i < word1.length && j < word2.length) {
          if (word1[i] !== word2[j]) {
              diff++;
              j++;
          } else {
              i++;
              j++;
          }
      }
      if (diff <= 1) { // Allow for one extra char at the end of word2
          return "addition";
      }
  } else if (word1.length === word2.length + 1) {
      let i = 0, j = 0;
      let diff = 0;
      while (i < word1.length && j < word2.length) {
          if (word1[i] !== word2[j]) {
              diff++;
              i++;
          } else {
              i++;
              j++;
          }
      }
      if (diff <= 1) { // Allow for one extra char at the end of word1
          return "subtraction";
      }
  }
  return "unrelated";
}

function submitWord(gameState) {
  let input = document.getElementById('guess').value;
  let word = input.toUpperCase();
  let wordArray = word.split("");

  // Use findSubstitutionPosition to check for single letter swap (for highlighting)
  let substitutionPositionStart = findSubstitutionPosition(gameState.startWord, wordArray);
  let substitutionPositionEnd = findSubstitutionPosition(gameState.endWord, wordArray);

  let insert = '<div class="word chain">';
  for (let i = 0; i < wordArray.length; i++) {
    let highlight = '<span>';
    // Highlight only if it's a substitution from start or end word
    if (substitutionPositionStart !== undefined && i === substitutionPositionStart) {
      highlight = '<span class="highlight">';
    } else if (substitutionPositionEnd !== undefined && i === substitutionPositionEnd) {
      highlight = '<span class="highlight">';
    }
    insert += highlight + wordArray[i] + '</span>';
  }
  insert += '</div>';


  if (!gameState.wordList.includes(word)) {
    console.log('Not in word list');
    return;
  }

  let changeTypeStart = compareWords(gameState.startWord.slice(), wordArray);
  let changeTypeEnd = compareWords(gameState.endWord.slice(), wordArray);
  console.log('Change type start word:', changeTypeStart);
  console.log('Change type end word:', changeTypeEnd);

  let accepted = false; // Flag to track if the word was accepted

  if (changeTypeStart === "substitution") {
    document.getElementById('guess').insertAdjacentHTML("beforebegin", insert);
    gameState.startWord = wordArray;
    document.getElementById('guess').value = '';
    accepted = true;
  } else if (changeTypeStart === "addition") {
    insert = insert.replace('<div class="word chain">', '<div class="word chain addition-word">');
    document.getElementById('guess').insertAdjacentHTML("beforebegin", insert);
    gameState.startWord = wordArray;
    document.getElementById('guess').value = '';
    accepted = true;
  } else if (changeTypeStart === "subtraction") {
    insert = insert.replace('<div class="word chain">', '<div class="word chain subtraction-word">');
    document.getElementById('guess').insertAdjacentHTML("beforebegin", insert);
    gameState.startWord = wordArray;
    document.getElementById('guess').value = '';
    accepted = true;
  } else if (changeTypeStart === "shuffle") {
    insert = insert.replace('<div class="word chain">', '<div class="word chain shuffle-word">');
    document.getElementById('guess').insertAdjacentHTML("beforebegin", insert);
    gameState.startWord = wordArray;
    document.getElementById('guess').value = '';
    accepted = true;
  } else if (changeTypeEnd === "substitution") {
    document.getElementById('guess').insertAdjacentHTML("afterend", insert);
    gameState.endWord = wordArray;
    document.getElementById('guess').value = '';
    accepted = true;
  } else if (changeTypeEnd === "addition") {
    insert = insert.replace('<div class="word chain">', '<div class="word chain addition-word">');
    document.getElementById('guess').insertAdjacentHTML("afterend", insert);
    gameState.endWord = wordArray;
    document.getElementById('guess').value = '';
    accepted = true;
  } else if (changeTypeEnd === "subtraction") {
    insert = insert.replace('<div class="word chain">', '<div class="word chain subtraction-word">');
    document.getElementById('guess').insertAdjacentHTML("afterend", insert);
    gameState.endWord = wordArray;
    document.getElementById('guess').value = '';
    accepted = true;
  } else if (changeTypeEnd === "shuffle") {
    insert = insert.replace('<div class="word chain">', '<div class="word chain shuffle-word">');
    document.getElementById('guess').insertAdjacentHTML("afterend", insert);
    gameState.endWord = wordArray;
    document.getElementById('guess').value = '';
    accepted = true;
  } else {
    console.log('Invalid word change');
    return; // Do not accept the word if it's not a valid change
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