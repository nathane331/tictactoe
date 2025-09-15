
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
        //console.log(boardWithCellValues);
    };

    const placeToken = (row, column, player) => {
        // const availableCells = board.filter((row) => row[column].getValue() === "$").map(row => row[column]);
        
        //check every column of every row and see if its value is $ (empty). 
        // if yes, for each row, return row[column] cell that is empty.

        let playerRowInput = "";
        let playerColumnInput = "";

        
        do{

           playerRowInput = prompt("Choose Row: ");
           playerColumnInput = prompt("Choose Column: ");

            if(board[playerRowInput][playerColumnInput].getValue() !== '-'){
                console.log("Space already occupied!");
            }

        }while(board[playerRowInput][playerColumnInput].getValue() !== '-')
        

        board[playerRowInput][playerColumnInput].setValue(player);

    }


    return{getBoard, printBoard, placeToken};
}



function Cell(){
    let value = '-';

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

    const screen = ScreenController();

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
        console.log("ROUND "+ playedRounds);
        console.log('starting ' + getActivePlayer().name + '`s turn.');
    }

    const playRound = (row, column) => {

        printNewRound();

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

        screen.updateScreen();
        switchPlayerTurn();
        //printNewRound();

        if(playedRounds < 10)
            playRound();
        else{
            console.log("DRAW");
            return;
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
                        console.log("match found: " + playerToken + " : " +currentBoard[i][j].getValue());
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
                            console.log("match found: " + playerToken + " : " +currentBoard[j][i].getValue());
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
                            console.log("match found: " + playerToken + " : " +currentBoard[i][i].getValue());
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

    return{playRound, getActivePlayer};
}


/////////////////////
//  DOM VISUALS

function ScreenController()
{
    const gameContainer = document.querySelector(".game-container");
    const gameCells = gameContainer.querySelectorAll(".cell");

    const updateScreen = () =>{
        //clear the dom [set contents to empty]
        
        gameCells.forEach(cell => {
            cell.textContent = "-";
        });

        //get most up to date board from the gamecontroller
        const currentBoard = board.getBoard(); 

        
        
        //get the active player from the gamecontroller
        //render the player's turn
        //populate each cell with its value [text]
        let index = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                gameCells[index].textContent = currentBoard[i][j].getValue();
            } 
            index++; 
        }


    }
    return{updateScreen}
}


//instantiate a new game
const game = GameController();
game.playRound();


