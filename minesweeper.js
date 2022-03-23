//global variables
var time = 0;
var colNum;
var rowNum;
var bombAmount;
var tiles;

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

    var randIndex
    for(var i = 0; i<bombAmount;i++){
        randIndex = Math.floor(Math.random()*(rowNum*colNum));
        while(tiles[randIndex].classList.contains("mine")){
            randIndex = Math.floor(Math.random()*(rowNum*colNum));
        }
        tiles[randIndex].classList.add("mine");
    }
    
    var style = window.getComputedStyle(tile);

    var width = parseInt(style.width.slice(0, -2));
    var height = parseInt(style.height.slice(0, -2));
    
    grid.style.width = (colNum * width) + "px";
    grid.style.height = (rowNum * height) + "px";
}

function createTile(x,y) {
    var tile = document.createElement("div");
    tile.id = +y + ',' + x; //sets the id of each tile

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
            
            //reveal everything
            tiles = document.getElementById("minefield").children;
            for(var i = 0; i<rowNum*colNum;i++){
                tiles[i].classList.remove("hidden");
                if(tiles[i].classList.contains("flag")){
                    tiles[i].classList.replace("flag","mine_marked")
                }
            }
            document.getElementById(this.id).onclick = alert("You hit a mine!\n\nGAME OVER!")
        }
        else if (document.getElementById(this.id).classList.contains("flag")){
            //prevents user from clicking a flagged tile
        }
        else {
            document.getElementById(this.id).className = "tile";

            //need to check neighboring cells
            
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
    window.setInterval(onTimerTick, 1000);
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