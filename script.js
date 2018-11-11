const gameBoard = (() =>{
    let emptyArr = Array(3).fill(''); 
    const board = [[...emptyArr],[...emptyArr],[...emptyArr]]; 
    const grids= document.querySelectorAll('.grid-item');
    const getBoard = () => board; 
    const setIds = (() => {
        let gridNum = 0; 
        for(let i=0;i<board.length;i++){
            for(let j=0; j<board[i].length;j++){
                grids[gridNum].setAttribute("row",i); 
                grids[gridNum].setAttribute("col",j);
                gridNum++; 
            }
        }
    });
    setIds();  
    const renderBoard = () => {
        grids.forEach(grid => {
            let row = grid.getAttribute("row");
            let col = grid.getAttribute("col");
            grid.textContent = board[row][col];
        }); 
    }
    const setValue = (row,col,sym) => {
        if(!board[row][col]){
            board[row][col] = sym;
            return false; 
        } 
        return true; 
    }
    return {getBoard, renderBoard, setValue};  
})()

const player = (name,symbol) =>{
   return {name, symbol}; 
};

const jeff = player("Jeff","X"); 
const johnny = player("Johnny","O"); 

const play = (player1, player2) => {
    let currentPlayer = player1; 
    const turnheader = document.createElement('h2'); 
    turnheader.textContent = `It is ${currentPlayer.name}(${currentPlayer.symbol})'s turns`; 
    const body = document.querySelector('body'); 
    body.appendChild(turnheader); 
    const switchTurns = () => {
        (currentPlayer == player1) ? currentPlayer = player2 : currentPlayer = player1; 
        turnheader.textContent = `It is ${currentPlayer.name}(${currentPlayer.symbol})'s turns`
    };
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
        checkRowWins();
        checkColWins(); 
        checkDiagWins(); 
        return win;  
    }; 
    const grids= document.querySelectorAll('.grid-item'); 
    grids.forEach(grid => {
        grid.addEventListener('click',(e) => {
            let row = grid.getAttribute("row");
            let col = grid.getAttribute("col");
            let gridTaken = gameBoard.setValue(row,col,currentPlayer.symbol); 
            let checkWin = determineWinner();
            gameBoard.renderBoard(); 
            if (checkWin) return turnheader.textContent = `${currentPlayer.name} has won`; 
            if (gridTaken) return alert("This space is already taken"); 
            switchTurns(); 
        }); 
    }); 
}

play(jeff,johnny); 
