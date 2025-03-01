// class GameState {
//   constructor() {
//       this.startWord = [];
//       this.endWord = [];
//       this.save = 'save';
//   }

//   loadGame() {
//     const saved = localStorage.getItem(this.save);
//     if (saved) {
//         const parsed = JSON.parse(saved);
//         this.startWord = parsed.starWord;
//         this.endWord = parsed.endWord;
//     }
//     return saved;
// }

// saveGame() {
//     localStorage.setItem(this.save, JSON.stringify({
//         starWord: this.startWord,
//         endWord: this.endWord,
//     }));
// }

// function init() {
//   gameState = new GameState();

//   if (!saved) {
//       newPuzzle(gameState);
//   } else {
//       gameState.saveGame();
//   }
// }
let startWord = [];
let endWord = [];

async function pickWords(gameState) {
  const response = await fetch('words.txt');
  const text = await response.text();

  const wordList = text.split('\n').map(word => word.trim());

  startWord = wordList[Math.floor(Math.random() * wordList.length)].split("");
  endWord = wordList[Math.floor(Math.random() * wordList.length)].split("");

  document.getElementById('startWord').innerHTML = '<span>' + startWord[0] + '</span>' + '<span>' + startWord[1] + '</span>' + '<span>' + startWord[2] + '</span>' + '<span>' + startWord[3] + '</span>'
  document.getElementById('endWord').innerHTML = '<span>' + endWord[0] + '</span>' + '<span>' + endWord[1] + '</span>' + '<span>' + endWord[2] + '</span>' + '<span>' + endWord[3] + '</span>'

  // gameState.startWord = startWord;
  // gameState.endWord = endWord;

  console.log('Start:', startWord);
  console.log('End:', endWord);
}

function findSwap(a, b) {

  let diff = 0;

  for (let i = 0; i < a.length; i++) {
      if (a[i] != b[i]) {
        diff++;
        diffPosition = i;
        diffLetter = b[i];
      }
  }

  if (diff == 1) {
    console.log(diffPosition, diffLetter);
  }
  
  console.log('diff checked', a, b, diff)
  return diff;
}

function submitWord() {
  let input = document.getElementById('guess').value;
  input = input.toUpperCase()
  word = input.split("");
  console.log('Guess:', word);
  let insert = '<div class="word chain">' + '<span>' + word[0] + '</span>' + '<span>' + word[1] + '</span>' + '<span>' + word[2] + '</span>' + '<span>' + word[3] + '</span>'
  
  if (word.length != 4) {
    console.log('Your words should have 4 letters');
    return;
  }

  if (findSwap(startWord, word) == 1) {
    document.getElementById('guess').insertAdjacentHTML("beforebegin", insert);
    startWord = word;
    document.getElementById('guess').value = '';

  } else if (findSwap(endWord, word) == 1) {
    document.getElementById('guess').insertAdjacentHTML("afterend", insert);
    endWord = word;
    document.getElementById('guess').value = '';
  }

  if (findSwap(startWord, endWord) == 1) {
    document.getElementById('guess').style = "display: none";
    document.getElementById('status').innerHTML = "Well done! Reload the page for a new puzzle.";
    document.getElementById('status').style = "color: #ACD6A3;";

  }
};

document.addEventListener('keydown', (event) => {
  const input = document.getElementById('guess');
  if (event.key === 'Enter') {
      submitWord();
  } else {
      input.focus();
  }
});

pickWords();