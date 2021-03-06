//global variables
var time = 0;
var colNum;
var rowNum;
var bombAmount;
var tiles;
var mineHit = false;
var click = 0;
var isGameOver=false;
var revealed = 0;
var timer;

function buildGrid() {

    // Fetch grid and clear out old elements.
    var grid = document.getElementById("minefield");
    grid.innerHTML = "";

    // Build DOM Grid
    var tile;
    for (var y = 0; y < rowNum; y++) {
        for (var x = 0; x < colNum; x++) {
            tile = createTile(x,y);
            grid.appendChild(tile);
        }
    }

    tiles = document.getElementById("minefield").children;
    
    //set id for every tile
    for (var i = 0; i < rowNum*colNum; i++){
        tiles[i].setAttribute('id',i);
    }

    //place bombs
    var randIndex
    for(var i = 0; i<bombAmount;i++){
        randIndex = Math.floor(Math.random()*(rowNum*colNum));
        while(tiles[randIndex].classList.contains("bomb")){
            randIndex = Math.floor(Math.random()*(rowNum*colNum));
        }
        tiles[randIndex].classList.add("bomb");
    }

    var style = window.getComputedStyle(tile);

    var width = parseInt(style.width.slice(0, -2));
    var height = parseInt(style.height.slice(0, -2));
    
    grid.style.width = (colNum * width) + "px";
    grid.style.height = (rowNum * height) + "px";
}

function createTile(x,y) {
    var tile = document.createElement("div");

    tile.classList.add("tile");
    tile.classList.add("hidden");
    
    tile.addEventListener("auxclick", function(e) { e.preventDefault(); }); // Middle Click
    tile.addEventListener("contextmenu", function(e) { e.preventDefault(); }); // Right Click
    tile.addEventListener("mousedown", handleTileClick ); // All Clicks

    return tile;
}

function startGame() {
    setDifficulty(); //included setDifficulty to change difficulty when smiley is clicked
    buildGrid();
    inactivityTime(); //call function that check mouse movement
    //reset variables
    revealed=0;
    isGameOver=false
    click=0;
    timeValue=0
    document.getElementById("timer").innerHTML = "0"
}

function smileyDown() {
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_down");
    
}

function smileyUp() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_down");
    smiley.classList.remove("face_lose");
    smiley.classList.remove("face_win");
}

function handleTileClick(event) {

    //prevent user from inputting
    if(isGameOver){
        event.preventDefault();
        return
    }
    
    // Left Click
    if (event.which === 1) {

        click++;
        if(click === 1){
            clearInterval(timer)
            startTimer()
        }

        if(!document.getElementById(this.id).classList.contains("hidden") || document.getElementById(this.id).classList.contains("flag")){
            return
        }
        else if(document.getElementById(this.id).classList.contains("bomb")){
            //trying to avoid the first tile clicked to be a mine
            if(click === 1){
                buildGrid();
                checkNeighbor(this.id)
            }
            else{
                document.getElementById(this.id).classList.add("mine_hit");
                
                mineHit=true;

                //reveal everything
                tiles = document.getElementById("minefield").children;
                for(var i = 0; i<rowNum*colNum;i++){
                    if(tiles[i].classList.contains("flag", "bomb")){
                        tiles[i].classList.replace("bomb","mine_marked")
                    }
                    if(tiles[i].classList.contains("bomb")){
                        tiles[i].classList.add("mine");
                    }                
                }
                document.getElementById("smiley").classList.add("face_lose");
                document.getElementById(this.id).onclick = alert("GAME OVER!\n\nYou hit a mine!\n\nTime: " + timeValue + "\n\nPress Face to Play again!")
                isGameOver=true
                clearInterval(timer)
            }            
        }        
        else {
            checkNeighbor(this.id)//check neighboring tiles
        }
        //check win
        if(revealed==rowNum*colNum-bombAmount){
            document.getElementById("smiley").classList.add("face_win");
            alert("CONGRATULATIONS!\n\nYou Win!\n\nTime: " + timeValue + "\n\nPress Face to Play again!")
            isGameOver=true
            clearInterval(timer)
        }
        
    }
    // Right Click
    else if (event.which === 3) {
        //TODO toggle a tile flag
        if (document.getElementById(this.id).classList.contains("flag")){
            document.getElementById(this.id).classList.replace("flag", "hidden")
        }
        else if(document.getElementById(this.id).classList.contains("hidden") ){
            document.getElementById(this.id).classList.replace("hidden", "flag")
        }
        
    }
}

function checkNeighbor(id){
    //need to check neighboring cells
    tiles = document.getElementById("minefield").children;

    for(var i = 0; i < tiles.length; i++){
        var nearBomb = 0;
        //check if we are at the edge
        const isLeftEdge = (i%colNum === 0)
        const isRightEdge = (i%colNum === colNum -1)

        if (tiles[i].classList.contains("hidden")){
            if(i >= 0 && !isLeftEdge && tiles[i -1].classList.contains("bomb")){
                nearBomb++;
            }
            if(i >= colNum-1 && !isRightEdge && tiles[i +1 -colNum].classList.contains("bomb")){
                nearBomb++;
            }
            if(i >= colNum && tiles[i-colNum].classList.contains("bomb")){
                nearBomb++;
            }
            if(i>=colNum+1 && !isLeftEdge && tiles[i -1 -colNum].classList.contains("bomb")){
                nearBomb++;
            }
            if(i<=rowNum*colNum-1 && !isRightEdge && tiles[i+1].classList.contains("bomb")){
                nearBomb++;
            }
            if(i<=rowNum*colNum-colNum && !isLeftEdge && tiles[i -1 +colNum].classList.contains("bomb")){
                nearBomb++;
            }
            if(i<=rowNum*colNum-colNum-2 && !isRightEdge && tiles[i +1 +colNum].classList.contains("bomb")){
                nearBomb++
            }
            if(i<=rowNum*colNum-colNum-1 && tiles[i +colNum].classList.contains("bomb")){
                nearBomb++;
            }
            tiles[i].setAttribute("data",nearBomb)
        }
    }

    //place numbered tiles if beside a bomb
    let total = document.getElementById(id).getAttribute('data')
    if (total != 0){
        document.getElementById(id).classList.add("tile_"+total)
    }

    //reveal neighboring tiles
    if(!tiles[id].classList.contains("mine")){
        revealed++;
        tiles[id].classList.remove("hidden")

        var x=id%colNum
        var y=Math.floor(id/colNum)

        if(document.getElementById(id).getAttribute('data')==0){
            if(x>0&&tiles[id-1].classList.contains("hidden"))        checkNeighbor(id-1);                                        // left

            if(x<(colNum-1)&&tiles[+id+1].classList.contains("hidden")) checkNeighbor(+id+1);                                // right

            if(y<(rowNum-1)&&tiles[+id+colNum].classList.contains("hidden")) checkNeighbor(+id+colNum);                        // down

            if(y>0&&tiles[id-colNum].classList.contains("hidden")) checkNeighbor(id-colNum);                                // up
        
            if(x>0&&y>0&&tiles[id-colNum-1].classList.contains("hidden")) checkNeighbor(id-colNum-1);                        // up & left

            if(x<(colNum-1)&&y<(rowNum-1)&&tiles[+id+colNum+1].classList.contains("hidden")) checkNeighbor(+id+colNum+1);        // down & right

            if(x>0&&y<(rowNum-1)&&y<(rowNum-1)&&tiles[+id+colNum-1].classList.contains("hidden")) checkNeighbor(+id+colNum-1);                // down & left

            if(x<(colNum-1)&&y>0&&y<(rowNum-1)&&tiles[+id-colNum+1].classList.contains("hidden")) checkNeighbor(+id-colNum+1);
        }        
    }    
}

function setDifficulty() {
    var difficultySelector = document.getElementById("difficulty");
    var difficulty = difficultySelector.selectedIndex;

    //TODO implement me
    switch(difficulty){
        case 0:
            colNum = 9;
            rowNum = 9;
            bombAmount = 10;
            break;
        case 1:
            colNum = 16;
            rowNum = 16;
            bombAmount = 40;
            break;    
        case 2:
            colNum = 30;
            rowNum = 16;
            bombAmount = 99;
            break;    
    }
    
}


function startTimer() {
    timeValue = 0;
    timer = setInterval(onTimerTick, 1000); 
}

function onTimerTick() {
    timeValue++;
    updateTimer();
}

function updateTimer() {
    document.getElementById("timer").innerHTML = timeValue;
}

function inactivityTime() {
    var timeOut;
    
    // events
    window.onload = resetTime;
    window.onclick = resetTime;
    window.onkeypress = resetTime;
    window.ontouchstart = resetTime;
    window.onmousemove = resetTime;
    window.onmousedown = resetTime;
    window.addEventListener('scroll', resetTime, true);

    function alertUser() {
        document.getElementById("smiley").classList.add("face_limbo");
    }

    function resetTime() {
        clearTimeout(timeOut);
        timeOut = setTimeout(alertUser, 1000 * 10); // 10 seconds
        document.getElementById("smiley").classList.remove("face_limbo");
    }

}
