//global variables
var time = 0;
var colNum;
var rowNum;
var bombAmount;
var tiles;
var mineHit = false;

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
        while(tiles[randIndex].classList.contains("mine")){
            randIndex = Math.floor(Math.random()*(rowNum*colNum));
        }
        tiles[randIndex].classList.add("mine");
    }

    //check how many bombs are beside each tile
    for(var i = 0; i < tiles.length; i++){
        var nearBomb = 0;
        const isLeftEdge = (i%colNum === 0)
        const isRightEdge = (i%colNum === colNum -1)

        if (tiles[i].classList.contains("hidden")){
            if(i > 0 && !isLeftEdge && tiles[i -1].classList.contains("mine")){
                nearBomb++;
            }
            if(i>colNum && !isRightEdge && tiles[i +1 -colNum].classList.contains("mine")){
                nearBomb++;
            }
            if(i > colNum+1 && tiles[i-colNum].classList.contains("mine")){
                nearBomb++;
            }
            if(i>colNum+2 && !isLeftEdge && tiles[i -1 -colNum].classList.contains("mine")){
                nearBomb++;
            }
            if(i<rowNum*colNum-1 && !isRightEdge && tiles[i+1].classList.contains("mine")){
                nearBomb++;
            }
            if(i<rowNum*colNum-colNum && !isLeftEdge && tiles[i -1 +colNum].classList.contains("mine")){
                nearBomb++;
            }
            if(i<rowNum*colNum-colNum-2 && !isRightEdge && tiles[i +1 +colNum].classList.contains("mine")){
                nearBomb++
            }
            if(i<rowNum*colNum-colNum-1 && tiles[i +colNum].classList.contains("mine")){
                nearBomb++;
            }
            tiles[i].setAttribute("data",nearBomb)
        }
        if(tiles[i].classList.contains("mine")){
        }
        else{
            tiles[i].classList.add("tile_"+nearBomb);
        }
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
    startTimer();
    inactivityTime();
}

function smileyDown() {
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_down");
}

function smileyUp() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_down");
}

function handleTileClick(event) {
    
    // Left Click
    if (event.which === 1) {
        //TODO reveal the tile
        if(document.getElementById(this.id).classList.contains("mine")){
            document.getElementById(this.id).classList.add("mine_hit");
            
            mineHit=true;

            //reveal everything
            tiles = document.getElementById("minefield").children;
            for(var i = 0; i<rowNum*colNum;i++){
                if(tiles[i].classList.contains("flag mine")){
                    tiles[i].classList.replace("flag mine","mine_marked")
                }
                tiles[i].classList.remove("hidden");
            }
            document.getElementById(this.id).onclick = alert("You hit a mine!\n\nGAME OVER!\n\nTime: " + time)
        }
        else if (document.getElementById(this.id).classList.contains("flag")){
            //prevents user from clicking a flagged tile
        }
        else {
            checkNeighbor(this.id)
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
    //check if we are at the edge
    const isLeftEdge = (id%colNum === 0)
    const isRightEdge = (id%colNum === colNum -1)
    var position = parseInt(id)

    if(!isLeftEdge){

    }

    document.getElementById(id).classList.remove("hidden");

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
    if(mineHit === false){
        window.setInterval(onTimerTick, 1000);
    }
    else{
        window.clearTimeout(onTimerTick)
    }
    
}

function onTimerTick() {
    timeValue++;
    updateTimer();
}

function updateTimer() {
    document.getElementById("timer").innerHTML = timeValue;
    time = timeValue
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

// function gameOver() {
//     clearInterval(startCountDown);

//     const button = document.querySelector('button')
//     button.removeEventListener('click', pointsClick)

//     const gameOver = document.createElement('h1');
//     gameOver.innerHTML = 'GAME OVER!' + '<br>' + `Total Score: ${totalScore}`;

//     gameDiv.append(gameOver);
// }