
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
        console.log('starting ' + getActivePlayer().name + '`s turn.');
    }

    const playRound = (row, column) => {

        board.placeToken(row, column,  getActivePlayer().token);

        //check for win condition
        checkWinner(getActivePlayer().token);
        if(winnerFound == true)
        {
            console.log(getActivePlayer().name + " Wins!");
            return;
        }

        switchPlayerTurn();
        printNewRound();
        playRound();
        
    };


    const checkWinner = (playerToken) =>{

        const currentBoard = board.getBoard();
        console.log(currentBoard[0][0].getValue());

        const winningCombinations = [
            [0,1,2], [3,4,5], [6,7,8], //horizontal wins
            [0,3,6], [1,4,7],[2,5,8], //vertical wins
            [0,4,8], [2,4,6] //diagonal wins
        ];

        winningCombinations.forEach((combo) =>{
            const [a,b,c] = combo;

            if(
                
                currentBoard[a][a].getValue() === playerToken

            ){
                console.log("Winner found");
            }

                /* const printBoard = () =>{
        const boardWithCellValues = board.map((row) => //for each row, call this function
                                        row.map((cell) => //for each cell in the row, call this function
                                            cell.getValue() //call cell.getValue
                                                )
                                            ) 
        console.log(boardWithCellValues);
        };*/



        });
    }

    printNewRound();

    return{playRound, getActivePlayer};
}

//instantiate a new game
const game = GameController();
game.playRound();


