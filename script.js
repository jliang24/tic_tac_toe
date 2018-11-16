const gameBoard = (() =>{
    let emptyArr = Array(3).fill(''); 
    let board = [[...emptyArr],[...emptyArr],[...emptyArr]]; 
    const getBoard = () => board; 
    const setValue = (row,col,sym) => {
            board[row][col] = sym;
    }
    const checkSpace = (row, col) => {
        if (!board[row][col]){
            return false; 
        } 
        return true; 
    }
    const resetBoard = () => {
        board = [[...emptyArr],[...emptyArr],[...emptyArr]]
    }
    return {getBoard, setValue, checkSpace, resetBoard};  
})()

const displayController = (() => {
    const turnheader = document.createElement('h2'); 
    const body = document.querySelector('body'); 
    let resetButton = document.querySelector('#reset'); 
    const grids= document.querySelectorAll('.grid-item');
    body.appendChild(turnheader); 
    let board = gameBoard.getBoard(); 
    const initializeState = () => {
        let gridNum = 0; 
        for(let i=0;i<board.length;i++){
            for(let j=0; j<board[i].length;j++){
                grids[gridNum].setAttribute("row",i); 
                grids[gridNum].setAttribute("col",j);
                gridNum++; 
            }
        }
    }; 
    grids.forEach(grid => {
        grid.addEventListener('click',(e) => {
            let row = grid.getAttribute("row");
            let col = grid.getAttribute("col");
            if (gameStateController.getGameState()) return; 
            if (gameBoard.checkSpace(row,col)) return alert("This space is already taken"); 
            let currentPlayer = gameStateController.getCurrentPlayer(); 
            gameBoard.setValue(row,col,currentPlayer.symbol); 
            grid.textContent = gameBoard.getBoard()[row][col];
            let checkWin = determineWinner();
            if (checkWin == "tied") {
                gameStateController.setGameState();           
                return turnheader.textContent = "Tied!" 
            }
            if (checkWin) {
                gameStateController.setGameState(); 
                return turnheader.textContent = `${currentPlayer.name} has won`; 
            }
            gameStateController.switchTurns(); 
            updateTurnHeader(gameStateController.getCurrentPlayer()); 
            }); 
    });

    const updateTurnHeader = (player) => {
        turnheader.textContent = `It is ${player.name}(${player.symbol})'s turns`; 
    } 

    initializeState();

    const resetBoard = () => {
        grids.forEach(grid => {
            grid.textContent = ""; 
        })
    }; 

    resetButton.addEventListener('click', (e) => {
        gameBoard.resetBoard(); 
        gameStateController.resetGameState(); 
        initializeState(); 
        resetBoard(); 
        gameStateController.setPlayer(); 
        updateTurnHeader(gameStateController.getCurrentPlayer());
    })


    return {updateTurnHeader}
})(); 



const player = (name,symbol) =>{
    return {name, symbol}; 
 };

 const gameStateController = (() => {
    let gameOver = false; 
    let player1 = player("Player 1","X");
    let player2 = player("Player 2","O");
    let currentPlayer = player1; 
    displayController.updateTurnHeader(currentPlayer); 
    const switchTurns = () => {
        (currentPlayer == player1) ? currentPlayer = player2 : currentPlayer = player1; 
    };

    const getCurrentPlayer = () => currentPlayer; 

    const setGameState = () => {
        return gameOver = true; 
    }

    const resetGameState = () => {
        return gameOver = false; 
    }

    const setPlayer = () =>{
        currentPlayer = player1; 
    }

    const getGameState = () => gameOver; 
    return {switchTurns, getCurrentPlayer, setGameState, getGameState, resetGameState, setPlayer} 
 })(); 

const determineWinner = () => {
    let winCondition = 3; 
    let win = false; 
    let board = gameBoard.getBoard(); 
    let checkRowWins = () => {
        for(let i=0;i<board.length;i++){
            let counter = 0; 
            let firstSymbol = board[i][0];
            for(let j=0; j<board[i].length;j++){
                if (firstSymbol==board[i][j] && firstSymbol!="") counter++;
                if (counter==winCondition) return win = true
            }
        }
    }
    let checkColWins = () => {
        for(let i=0;i<board.length;i++){
            let counter = 0; 
            let firstSymbol = board[0][i];
            for(let j=0; j<board[i].length;j++){
                if (firstSymbol==board[j][i] && firstSymbol!="") counter++;
                if (counter==winCondition) return win = true
            }
        }
    }
    let checkDiagWins = () => {
        let counter = 0; 
        for(let i=0; i<board.length;i++){
            let firstSymbol = board[1][1]; 
            if(firstSymbol==board[i][i] && firstSymbol!="") counter++; 
            if (counter==winCondition) return win = true
        }
        counter = 0; 
        let j = 2; 
        for(let i=0; i<board.length;i++){
            let firstSymbol = board[1][1]; 
            if(firstSymbol==board[i][j] && firstSymbol!="") {
                counter++;
                j--; 
            } 
            if (counter==winCondition) return win = true
        }
    }
    const checkForTie = () => {
        let counter = 0; 
        for (let i=0;i<board.length;i++){
        if (board[i].every(item => item !="")) counter ++;
        if (counter == 3) return win = "tied"; 
        } 
    }
    checkForTie(); 
    checkRowWins();
    checkColWins(); 
    checkDiagWins(); 
    return win;  
}; 
