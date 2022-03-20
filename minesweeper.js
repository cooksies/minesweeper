
var time = 0;
let bombAmount = 10;
let tiles =[]
let columns = 9
let rows = 9

function buildGrid() {

    // Fetch grid and clear out old elements.
    var grid = document.getElementById("minefield");
    grid.innerHTML = " ";

    // var columns = 9;
    // var rows = 9;

    // Build DOM Grid
    var tile;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            tile = createTile(x,y);
            grid.appendChild(tile);
            tiles.push(tile)
            console.log(tile)
        }
    }
    
    var style = window.getComputedStyle(tile);

    var width = parseInt(style.width.slice(0, -2));
    var height = parseInt(style.height.slice(0, -2));
    
    grid.style.width = (columns * width) + "px";
    grid.style.height = (rows * height) + "px";
}

function createTile(x,y) { //x and y are not being used here
    const tile = document.createElement("div");
    tile.setAttribute ('id', y*10+x)

    var bombsArray = Array(bombAmount).fill("mine");
    var emptyArray = Array(rows*columns - bombAmount).fill("hidden")
    var gameArray = emptyArray.concat(bombsArray)
    var shuffledArray = gameArray.sort(() => Math.random() -0.5)

    tile.classList.add("tile");
    // tile.classList.add("hidden");
    tile.classList.add(shuffledArray[x,y])
    
    tile.addEventListener("auxclick", function(e) { e.preventDefault(); }); // Middle Click
    tile.addEventListener("contextmenu", function(e) { e.preventDefault(); }); // Right Click
    tile.addEventListener("mouseup", handleTileClick ); // All Clicks

    return tile;
}

function startGame() {
    buildGrid();
    startTimer();
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
    }
    // Right Click
    else if (event.which === 3) {
        //TODO toggle a tile flag
    }
}

function setDifficulty() {
    var difficultySelector = document.getElementById("difficulty");
    var difficulty = difficultySelector.selectedIndex;

    //TODO implement me
    switch(difficultySelector.options[difficulty].value){
        case 0:
            columns = 9;
            rows = 9;
            bombAmount = 10;
            buildGrid()
            break;
        case 1:
            columns = 16;
            rows = 16;
            bombAmount = 40;
            buildGrid()
            break;
        case 2: 
            columns = 30;
            rows = 16
            bombAmount = 99;
            buildGrid()
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