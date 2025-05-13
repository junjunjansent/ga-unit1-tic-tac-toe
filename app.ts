// ---- Rules
// Display an empty tic-tac-toe board when the page is initially displayed.
// A player can click on the nine cells to make a move.
// Every click will alternate between marking an X and O.
// Display whose turn it is (X or O).
// The cell cannot be played again once occupied with an X or O.
// Provide win logic and display a winning message.
// Provide logic for a cat’s game (tie), also displaying a message.
// Provide a Reset Game button that will clear the contents of the board.

// ---- Level Up
// Make it your own - use something other than X and O to represent the players. A theme can go a long way here!
// Add styling or other details to reinforce your theme and customize the game.

/*-------------------------------- Considerations --------------------------------*/
// Trying to use OOP to code this Tic Tac Toe Game

/*-------------------------------- Constants --------------------------------*/

/*---------------------------- Variables (state) ----------------------------*/
// a. Use a variable named board to represent the state of the squares on the board.
// b. Use a variable named turn to track whose turn it is.
// c. Use a variable named winner to represent if anyone has won yet.
// d. Use a variable named tie to represent if the game has ended in a tie.

/*------------------------ Cached Element References ------------------------*/
// a. In a constant called squareEls, store the nine elements representing the squares on the page.
// b. In a constant called messageEl, store the element that displays the game’s status on the page.

/*-------------------------------- Functions --------------------------------*/
// a. Create a function called init.
// b. Call the init function when the app loads.
// c. Set the board variable to an array containing nine empty strings ('') representing empty squares.
// d. Set the turn to the uppercase string "X" - this will represent player X.
// e. Set the winner to false.
// f. Set tie to false.
// g. Call a function named render() at the end of the init() function.

const winCondition = (board: number[]): boolean => {
  // Win conditions:
  // horizontal - 0,1,2 || 3,4,5 || 6,7,8
  // vertical - 0,3,6 || 1,4,7 || 2,5,8
  // diagonal - 0,4,8 || 2,4,6

  // horizontal:
  // board has 0, 3, 6. any of these +2 exists && +4 exists.
  // board has 0, 1, 2. any of these +1 exists && +1 exists
  // board has [0, 4, 8].every(i => board.includes(i)) || [2, 4, 6].every(i => board.includes(i))

  return true;
};
console.log(winCondition([]));

/*-------------------------------- Classes --------------------------------*/
class GameModel {
  // no need to define constructor for model or view since there is no properties to intialise for instantation
  // declare private variables to ensure only model can amend itself

  private playerInfo: string[];
  private playerSymbols: string[];
  private currentPlayer: 1 | 2; //player ID
  private message: string = "";
  private board: number[]; //either 0, 1, 2 inside array

  // message = ""
  //    <<Further On>> Choose a Player: and show buttons
  //    (1) StartGame "Click a box to start. Let's have ${Player 1} using Xs"
  //    (2) DuringGame "It is Player 1's turn - X."
  //    (3) DuringGame "It is Player 2's turn - O."
  //    (4) EndGame ${Player 1} Won!! Sorry ${Player 2}"
  //    (5) EndGame ${Player 2} Won!! Sorry ${Player 1}."
  //    (6) EndGame It's a Draw."
  //    <<Further On>> Wanna play again?
  // -----
  setup(info: string[], symbols: string[]): void {
    this.playerInfo = info;
    this.playerSymbols = symbols;
    this.currentPlayer = 1;
    this.board = new Array(9).fill(0);
  }

  setMessage(msg: string): void {
    this.message = msg;
  }

  setBoard(currentPlayer: 1 | 2, boxID: number): void {
    this.board[boxID] = currentPlayer;
    // console.log(this.board);
  }

  // -----
  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getPlayerDetails(currentPlayer: 1 | 2): string[] {
    return [
      this.playerInfo[currentPlayer - 1],
      this.playerSymbols[currentPlayer - 1],
    ];
  }

  getPlayerSymbols(): string[] {
    return this.playerSymbols;
  }

  getMessage(): string {
    return this.message;
  }

  getBoard(): number[] {
    return this.board;
  }

  // -----
  // changePlayer() {}
  // setBoard() {}
  // reset() {}
}

class GameView {
  private boardElmt: HTMLElement;
  private boardBoxList: NodeListOf<HTMLElement>;
  private messageElmt: HTMLElement;
  private resetElmt: HTMLElement;

  constructor() {
    this.boardElmt = document.querySelector(".board")!;
    this.boardBoxList = document.querySelectorAll(".sqr");
    this.messageElmt = document.getElementById("message")!;
    this.resetElmt = document.getElementById("reset")!;
  }

  // TYPESCRIPT: "() => void" is a function type
  bindPlayerInput(controllerHandler: (event: MouseEvent) => void): void {
    this.boardElmt.addEventListener("click", controllerHandler);
    console.dir(this.boardBoxList);
  }

  bindReset(controllerHandler: () => void): void {
    this.resetElmt.addEventListener("click", controllerHandler);
  }

  updateBoard(board: number[], playerSymbols: string[]): void {
    // console.log(board, playerSymbols);
    for (let i = 0; i < this.boardBoxList.length; i++) {
      const boxElement = this.boardBoxList[i];
      if (board[i] !== 0) {
        break;
      } else {
        // as board would contain elements of 1 or 2
        boxElement.textContent = playerSymbols[board[i] - 1];
      }
    }
  }

  updateMessage(message: string): void {
    this.messageElmt.textContent = message;
  }
}

/*----------------------------- Event Listeners -----------------------------*/
// had to research why private/public was required for class declaration
class GameController {
  private model: GameModel;
  private view: GameView;

  constructor(model: GameModel, view: GameView) {
    this.model = model;
    this.view = view;
    this.initGame();

    // bindEventListeners
    this.view.bindPlayerInput(this.handlePlayerInput);
    this.view.bindReset(this.handleReset);
  }

  private initGame() {
    const info = ["1", "2"];
    const symbols = ["X", "O"];
    this.model.setup(info, symbols);

    const currentPlayer = this.model.getCurrentPlayer();
    const currentPlayerDetails = this.model.getPlayerDetails(currentPlayer);
    const msg = `Click a box to start. Let's have Player ${currentPlayerDetails[0]} begin using symbol ${currentPlayerDetails[1]}`;

    this.model.setMessage(msg);
    this.view.updateMessage(msg);
  }

  // TYPESCRIPT/Class Declarations and using "this"
  // If I want to use regular method declaration, "this" would refer to the instance
  // of the class and will not be called properly (likely it wld refer to the
  // HTML element called)... unless i use ".bind(this)"
  // By using arrow fxn, it helps bind "this" to this class automatically

  private handlePlayerInput = (event: MouseEvent): void => {
    const currentPlayer = this.model.getCurrentPlayer();
    const currentPlayerDetails = this.model.getPlayerDetails(currentPlayer);

    const target = event.target;
    const targetID = parseInt(event.target.dataset.id);

    if (target instanceof HTMLElement) {
    } else {
      return;
    }

    console.log(targetID);
    this.model.setBoard(currentPlayer, targetID);
    this.view.updateBoard(this.model.getBoard(), this.model.getPlayerSymbols());
    // checkWin() {}

    // model.changePlayer()
    //
    // model.setMessage()

    // view.updateMessage()
  };

  private handleReset = (): void => {
    // model.reset()
    // view.updateBoard()
    // view.updateMessage()
    console.log("resetted");
  };
}

/*----------------------------- Initialise App -----------------------------*/
const model = new GameModel();
const view = new GameView();
const controller = new GameController(model, view);
