const Gameboard = function () {
  let spaces = ["", "", "", "", "", "", "", "", ""]; // create board
  const placeMarker = (space, marker) => (spaces[space] = marker); // place markers, adjusting for 0-indexing
  const printBoard = () => console.log(spaces); // for console version

  return { spaces, placeMarker, printBoard };
};

function Player(name, marker) {
  return { name, marker };
}

const GameFlow = (function (
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();
  let gameOver = false;

  // create the players
  const players = [
    { name: playerOneName, marker: "X" },
    { name: playerTwoName, marker: "O", }
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  
  const getActivePlayer = () => activePlayer;

  const printRound = () => {
    board.printBoard();
    console.log(gameOver ? "Game Over!" : `${getActivePlayer().name}'s turn`);
  };

  const playRound = (space) => {
    space--; // adjust for 0-index
    if (!gameOver) {
      if (board.spaces[space] == "") {
        // if selected space is empty
        console.log(
          `Placing ${getActivePlayer().name}'s marker in space ${space}`
        );
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
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
      
    ];

    // take the index of each space filled by current player's marker
    let indexes = [];
    // TO DO: convert to .map() and .filter()
    for (let i = 0; i < 9; i++) {
      if (board.spaces[i] == player.marker) indexes.push(i);
    }

    // check if any win pattern is in the indexes array
    let winner = false;
    winPatterns.forEach((pattern) => {
      if (pattern.every((index) => indexes.includes(index))) {
        console.log(`${player.name} wins!`);
        winningPattern = pattern;
        gameOver = true;
        winner = true;
      }
    });

    // tie logic
    if (!winner && !board.spaces.includes("")) {
      console.log("Tie!");
      gameOver = true;
    }
  };

  printRound();

  return {
    players,
    playRound,
    getActivePlayer,
    checkForWin,
    getGameStatus: () => gameOver,
    getWinningPattern: () => winningPattern,
    board,
  };
})();

const displayControl = (function () {
  const consoleBoard = GameFlow.board;
  const UIBoard = document.querySelector(".board");

  let gameStarted = false;

  // highlight winning pattern
  function highlightWinner() {
    const winpattern = GameFlow.getWinningPattern();
    const winner = GameFlow.getActivePlayer().name;

    winpattern.forEach((i) => {
      const space = document.querySelector(`.space${i + 1}`);

      space.style.color = "var(--win)";
    });

      const winnerAnnouncement = document.createElement("h1");
      winnerAnnouncement.classList.add("winner");
      winnerAnnouncement.innerText = `${winner} Wins!`;
      winnerAnnouncement.style.color = "var(--win)";
      document.querySelector(".control").innerHTML = "";
      document.querySelector(".control").append(winnerAnnouncement);
      const restartButton = document.createElement("button");
      restartButton.classList.add("restart-button");
      restartButton.innerText = "Restart";
      document.querySelector(".control").append(restartButton);

        // reset button to clear board and restart game
      restartButton.addEventListener("click", () => {
        location.reload();
      });
  }

  // board turns red on a tie
  const redBoard = () => {
    const spaces = document.querySelectorAll(`div[class*="space"]`); // select all markers
    spaces.forEach((space) => {
      space.style.color = "var(--tie)";
    });

    const tieAnnouncement = document.createElement("h1");
    tieAnnouncement.classList.add("tie");
    tieAnnouncement.innerText = "Tie!";
    tieAnnouncement.style.color = "var(--tie)";
    document.querySelector(".control").innerHTML = "";
    document.querySelector(".control").append(tieAnnouncement);
    const restartButton = document.createElement("button");
      restartButton.classList.add("restart-button");
    restartButton.innerText = "Restart";
    document.querySelector(".control").append(restartButton);

        // reset button to clear board and restart game
      restartButton.addEventListener("click", () => {
        location.reload();
      });
  };

  // create board, place markers, play game
  const renderBoard = () => {
    UIBoard.innerHTML = ""; // clear board

    consoleBoard.spaces.forEach((space, i) => {
      const spaceElem = document.createElement("div");
      spaceElem.classList.add(`space${i + 1}`, `${(space == "") ? "empty" : "filled"}`);

      const pElem = document.createElement("p");
      pElem.innerText = `${space}`;
      spaceElem.appendChild(pElem);

      pElem.addEventListener("click", () => {
        if (gameStarted) {
          GameFlow.playRound(i + 1);
          renderBoard();
        }
        else {
          formControl.startGame();
          GameFlow.playRound(i + 1);
          renderBoard();
        }
      });

      pElem.addEventListener("mouseover", () => {
        if (!GameFlow.getGameStatus() && consoleBoard.spaces[i] === "") {
          pElem.innerText = GameFlow.getActivePlayer().marker;

        }
});

pElem.addEventListener("mouseout", () => {
  if (!GameFlow.getGameStatus() && consoleBoard.spaces[i] === "") {
    pElem.innerText = "";
  }
});

      UIBoard.appendChild(spaceElem); // add spaces to board
    });

    // call highlightWinner() or redBoard() *after* re-rendering, if game is over
    if (GameFlow.getGameStatus()) (GameFlow.getWinningPattern().length > 0) ? highlightWinner() : redBoard();
  };

  // FORM CONTROL

  const formControl = (function () {
    const controlDiv = document.querySelector(".control");
    const form = document.querySelector("form");
    const playerOneNameInput = document.querySelector("#player-one-name");
    const playerTwoNameInput = document.querySelector("#player-two-name");
    const startButton = document.querySelector("#start-button");

    function startGame(player1 = "Player One", player2 = "Player Two") {
      gameStarted = true;
      GameFlow.players[0].name = player1;
      GameFlow.players[1].name = player2;

      form.remove();

      const newDiv = document.createElement("div");
      controlDiv.appendChild(newDiv);

      const playerOneName = document.createElement("h2");
      playerOneName.innerText = player1;
      newDiv.appendChild(playerOneName);

      const playerTwoName = document.createElement("h2");
      playerTwoName.innerText = player2;
      newDiv.appendChild(playerTwoName);

      
      const restartButton = document.createElement("button");
      restartButton.classList.add("restart-button");
      restartButton.innerText = "Restart";
      controlDiv.append(restartButton);

      // reset button to clear board and restart game
      restartButton.addEventListener("click", () => {
        location.reload();
      });
    }

    startButton.addEventListener("click", function(event) {
      event.preventDefault();
      formControl.startGame(playerOneNameInput.value || "Player One", playerTwoNameInput.value || "Player Two");
    })

    return { form, startGame }
  })()

  renderBoard(); // initial board display

  return { highlightWinner, redBoard };
})();


/* TO DO

- custom markers ?
- hover effect only works on empty spaces
- stop things moving around as the display changes
- reset button

*/