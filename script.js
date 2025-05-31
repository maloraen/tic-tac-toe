const Gameboard = function () {
  let spaces = ["", "", "", "", "", "", "", "", ""]; // create board
  const placeMarker = (space, marker) => (spaces[space - 1] = marker); // - 1 to line the spaces up properly with the 0-indexed array
  const printBoard = () => console.log(spaces);

  return { spaces, placeMarker, printBoard };
};

function Player(name, marker) {
  return { name, marker };
}

const GameFlow = (function (
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard(); // get access to the Gameboard()
  let gameOver = false;

  // create the players
  const players = [
    {
      name: playerOneName,
      marker: "X",
    },
    {
      name: playerTwoName,
      marker: "O",
    },
  ];

  let activePlayer = players[0];
  const switchPlayerTurn = () =>
    (activePlayer = activePlayer === players[0] ? players[1] : players[0]);
  const getActivePlayer = () => activePlayer;

  const printRound = () => {
    board.printBoard();
    if (!gameOver) {
      console.log(`${getActivePlayer().name}'s turn`);
    } else {
      console.log("Game Over!");
    }
  };

  const playRound = (space) => {
    if (!gameOver) {
      if (board.spaces[space - 1] == "") { // if selected space is empty
        console.log(`Placing ${getActivePlayer().name}'s marker in space ${space}`);
        board.placeMarker(space, getActivePlayer().marker);

        checkForWin(getActivePlayer());
        if (!gameOver) switchPlayerTurn();
      } else {
        console.log("This space is taken!");
      }
      printRound();
    }
  };
  
  let winningPattern = [];
  const checkForWin = (player) => {
    const winPatterns = [
      [0, 1, 2], // rows
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6], // columns
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8], // diagonals
      [2, 4, 6],
    ];

    // if all spaces are taken, and there is no win
    if (!board.spaces.includes("") && !gameOver) {
      console.log("Tie!");
      gameOver = true;
    }

    // take the index of each space filled by current player's marker
    let indexes = [];
    for (let i = 0; i < 9; i++) {
      if (board.spaces[i] == player.marker) indexes.push(i);
    }

    // check if each number of any pattern is in the indexes array
    winPatterns.forEach((pattern) => {
      if (pattern.every((index) => indexes.includes(index))) {
        console.log(`${player.name} wins!`);
        console.log("game over true");
        winningPattern = pattern;
        displayControl.highlightWinningPattern();
        gameOver = true;
      }
    });
  };

  const getGameStatus = () => gameOver;
  const getWinningPattern = () => winningPattern;
  printRound();

  return { playRound, getActivePlayer, checkForWin, getGameStatus, getWinningPattern };
})();

const displayControl = (function () {
  let spaceNumber;
  // populate board
  const spaces = document.querySelectorAll(".space");
  spaces.forEach((space) => {
    const spaceText = document.createElement("p");
    spaceText.innerText = "";
    space.appendChild(spaceText);

    space.addEventListener("click", () => {
      const gameStatus = GameFlow.getGameStatus();
      spaceNumber = space.classList[1];

      if (!gameStatus) {
          if (spaceText.innerText == "") {
            spaceText.innerText = GameFlow.getActivePlayer().marker;
            GameFlow.playRound(spaceNumber);
            console.log(`status: ${gameStatus}`);
        }
      }
    });
  });

  // reset game
  const resetButton = document.querySelector(".reset");
  resetButton.addEventListener("click", () => {
    location.reload();
  });

  // highlight winning pattern
  function highlightWinningPattern() {
    const winpattern = GameFlow.getWinningPattern();
    // get the spaces with the numbers that match the numbers in the winning pattern (+1 because of the 0-index)
    
    console.log(`
        ${winpattern[0]} + 1 = ${winpattern[0] + 1}
        ${winpattern[1]} + 1 = ${winpattern[1] + 1}
        ${winpattern[2]} + 1 = ${winpattern[2] + 1}
    `);

    winpattern.forEach(i => {
      const space = document.querySelector(`.space${i + 1}`);
      console.log(space);
      space.style.color = "aqua";
    });
  }

  return { highlightWinningPattern };
})();

/* TO DO:

  - highlight winning pattern
  - TIC TAC TOE banner
  - winner announcement
  - reset button

*/

