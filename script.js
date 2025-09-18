
//gameboard module
function Gameboard(){
    const rows = 3;
    const columns = 3;
    const board = [];

    //create a 2d array for the board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell()); //push a cell to every point in the array
        }  
    }

    const getBoard = () => board; //Gameboard.getBoard => return board

    const printBoard = () =>{
        const boardWithCellValues = board.map((row) => //for each row, call this function
                                        row.map((cell) => //for each cell in the row, call this function
                                            cell.getValue() //call cell.getValue
                                                )
                                            ) 
        console.log(boardWithCellValues);
    };

    const placeToken = (row, column, player) => {
        board[row][column].setValue(player);
    }


    return{getBoard, printBoard, placeToken};
}



function Cell(){
    let value = ' ';

    //function setvalue(player){value = player;}
    const setValue = (player) => value = player;

    const getValue = () => value;

    return{setValue, getValue};
}


function GameController(playerOneName = "Player One", playerTwoName = "Player Two"){

    //instantiate a game board
    const board = Gameboard();


    let winnerFound = false;
    let playedRounds = 1;


    const players = [
        {
            name: playerOneName,
            token: "X"
        },
        {
            name: playerTwoName,
            token: "O"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () =>{
        //does active player = player0? if yes, set to player1. if no, set to player0.
        activePlayer = activePlayer === players[0]? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () =>{
        board.printBoard();
        
    }

    const playRound = (row, column) => {

        currentBoard = board.getBoard();
        console.log("ROUND "+ playedRounds);
        console.log('starting ' + getActivePlayer().name + '`s turn.');
        

        if(currentBoard[row][column].getValue() !== ' '){
            console.log("Space already occupied!");
        }
        else{
            board.placeToken(row, column,  getActivePlayer().token);

            //check for win condition
            checkWinner(getActivePlayer().token);
            if(winnerFound == true)
            {
                board.printBoard();
                console.log(getActivePlayer().name + " Wins!");
                return;
            }

            playedRounds++;

            switchPlayerTurn();
            printNewRound();
        }

        
        
    };


    const checkWinner = (playerToken) =>{

        let sequentialMatches = 0;
        const currentBoard = board.getBoard();
        
            //check horizontal wins
            console.log("checking for horizontal wins...");
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if(currentBoard[i][j].getValue() !== playerToken){
                        //console.log("no match: " + playerToken + " : " +currentBoard[i][j].getValue());
                        sequentialMatches = 0;
                        //return;
                    }
                    else{
                        //console.log("match found: " + playerToken + " : " +currentBoard[i][j].getValue());
                        sequentialMatches++;

                        if(sequentialMatches == 3)
                        {
                            winnerFound = true;
                        }
                    }  
                }   
            }

            if(winnerFound == false){
                console.log("checking for vertical wins...");
                sequentialMatches = 0;

                //check vertical wins
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if(currentBoard[j][i].getValue() !== playerToken){
                            //console.log("no match: " + playerToken + " : " +currentBoard[j][i].getValue());
                            sequentialMatches = 0;
                            //return;
                        }
                        else{
                            //console.log("match found: " + playerToken + " : " +currentBoard[j][i].getValue());
                            sequentialMatches++;

                            if(sequentialMatches == 3)
                            {
                                winnerFound = true;
                            }
                        }  
                    }   
                }
            }

            if(winnerFound == false){

                console.log("checking for leftward diagonal wins...");
                sequentialMatches = 0;

                //check diagonal wins
                for (let i = 0; i < 3; i++) {
                    
                        if(currentBoard[i][i].getValue() !== playerToken){
                            //console.log("no match: " + playerToken + " : " +currentBoard[i][i].getValue());
                            sequentialMatches = 0;
                            //return;
                        }
                        else{
                            //console.log("match found: " + playerToken + " : " +currentBoard[i][i].getValue());
                            sequentialMatches++;

                            if(sequentialMatches == 3)
                            {
                                winnerFound = true;
                            }
                        }  
                       
                }
            }

            if(winnerFound == false){

                let j = 2;
                console.log("checking for rightward diagonal wins...");
                for (let i = 0; i < 3; i++) {  
                    if(currentBoard[i][j].getValue() !== playerToken){
                        //console.log("no match: " + playerToken + " : " + currentBoard[i][j].getValue());
                        sequentialMatches = 0;
                    }
                    else{
                        console.log("match found: " + playerToken + " : " + currentBoard[i][j].getValue());
                        sequentialMatches++;

                        if(sequentialMatches == 3)
                        {
                            winnerFound = true;
                        }
                    }
                    j--;
                       
                }
            }
    }

    return{board, playRound, getActivePlayer};
}


/////////////////////
//  DOM VISUALS

function ScreenController(game)
{    

    const gameContainer = document.querySelector(".game-container");

    const startModal = document.querySelector(".modal-background");
    const startButton = document.querySelector(".start-restart-btn");
    startModal.showModal();
    startButton.addEventListener('click', () =>{startModal.close();});
    
    const currentTurnDisplay = document.querySelector(".current-turn");

    
    const updateScreen = () =>{

        const gameCells = gameContainer.querySelectorAll(".cell");
        //clear the dom [set contents to empty]
        gameCells.forEach(cell => {
            cell.textContent = " ";
        });

        //get most up to date board from the gamecontroller
       let currentBoard = game.board;
       currentBoard = currentBoard.getBoard();
       
        //populate each cell with its value [text]
        index = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                gameCells[index].textContent = currentBoard[i][j].getValue();
                index++;
            }  
        }

        currentTurnDisplay.textContent = game.getActivePlayer().name;
    }

    for (let i = 0; i < 3; i++) {
        //create three rows
        const displayRow = document.createElement("div");
        gameContainer.appendChild(displayRow);
        displayRow.classList.add("display-row");

        for (let j = 0; j < 3; j++) {
            //inside each row create 3 cells
            const displayCell = document.createElement("button");
            displayRow.appendChild(displayCell);
            displayCell.classList.add("cell");
            displayCell.setAttribute('row', i);
            displayCell.setAttribute('column', j);
            displayCell.textContent = " ";  

            displayCell.addEventListener("click", clickHandler);
        }
    }

    function clickHandler(event){
        const clickedButton = event.currentTarget;
        const clickedRow = clickedButton.getAttribute("row");
        const clickedColumn = clickedButton.getAttribute("column")

        console.log("button clicked in " + clickedRow +","+clickedColumn);

        game.playRound(clickedRow, clickedColumn);
        
        //and update screen
        updateScreen();
        
    }

    return{updateScreen, clickHandler}
}




//instantiate a new game


const game = GameController();
const screen = ScreenController(game);
console.log("Active Player: " + game.getActivePlayer().token);







