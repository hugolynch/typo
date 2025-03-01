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

  document.getElementById('startWord').textContent = startWord[0] + startWord[1] + startWord[2] + startWord[3];
  document.getElementById('endWord').textContent = endWord[0] + endWord[1] + endWord[2] + endWord[3];

  // gameState.startWord = startWord;
  // gameState.endWord = endWord;

  console.log('Start:', startWord);
  console.log('End:', endWord);
}

function countDiff(a, b) {

  diff = 0;

  for (let i = 0; i < a.length; i++) {
      if (a[i] != b[i]) {
        diff++;
      }
  }
  
  console.log('diff checked', a, b, diff)
  return diff;
}

function submitWord() {
  let input = document.getElementById('guess').value;
  input = input.toUpperCase()
  word = input.split("");
  console.log('Guess:', word);
  let insert = '<div class="word chain">' + word[0] + word[1] + word[2] + word[3] + '</div>'
  
  if (word.length != 4) {
    console.log('Your words should have 4 letters');
    return;
  }

  if (countDiff(startWord, word) == 1) {
    document.getElementById('guess').insertAdjacentHTML("beforebegin", insert);
    startWord = word;
    document.getElementById('guess').value = '';

  } else if (countDiff(endWord, word) == 1) {
    document.getElementById('guess').insertAdjacentHTML("afterend", insert);
    endWord = word;
    document.getElementById('guess').value = '';
  }

  if (countDiff(startWord, endWord) == 1) {
    document.getElementById('guess').style = "display: none";

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