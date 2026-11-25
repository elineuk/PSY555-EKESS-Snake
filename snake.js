"use strict";

//TODO: make snake (without plagarising literally everything ever)
//TODO: collision so the snake doesnt go into the other side of the board --DONE FOR BOARDS I THINK
//TODO: once the logic for room creation works, hardcode the various rooms and target locations
//TODO: hardcode the second player movements
//TODO: get the click time and data out from the website and into a file or into a csv?

//add event listeners
document.addEventListener('DOMContentLoaded', onStart);
document.addEventListener('keydown', handleMovement);
window.addEventListener('resize', fixLayout);

let experiment = document.getElementsByClassName("experiment")[0];

function onStart(){
    console.log("testing");

    //COMMENT OUT WHEN YOU STOP TESTING
    // loadGame();
}

function loadGame(){
    let currentDisplay = getComputedStyle(experiment).display;

    if (currentDisplay === "none"){
        experiment.style.display = "flex";
        document.getElementById("startButton").style.display = "none"
    }
    else {
        experiment.style.display = "none";
    }


    //start movement, rest of the logic code is down below
    gameStarted = true;
    console.log("GAME STARTED")
    gameInterval = setInterval(() => {
        move();
        // checkCollision();
        draw();
    }, playerMovementSpeed);

}

//incase i want to redraw the grid(s) based off screen size (?)
function fixLayout(){

}

const root = document.documentElement;

const column = Number(getComputedStyle(root).getPropertyValue("--columns"));
const row = Number(getComputedStyle(root).getPropertyValue("--rows"));
const size = parseFloat(getComputedStyle(root).getPropertyValue("--sizeOfCells"));


function changeRoomType(mode) {
    if (mode === '1') {
        document.querySelector(".experiment-board-left").style.borderRight = "none"
        document.querySelector(".experiment-board-left").style.gridTemplateColumns = `repeat(${column * 2}, ${size}px)`;

        document.querySelector(".experiment-board-left").style.gridTemplateRows = `repeat(${row}, ${size}px)`;
        document.querySelector(".experiment-board-right").style.borderLeft = "none"
        document.querySelector(".experiment-board-right").style.display = "none";

        document.getElementById("border1Button").style.display = "none";
        document.getElementById("border2Button").style.display = "block";

    }

    else {

        document.querySelector(".experiment-display").style = "flex";

        document.querySelector(".experiment-board-left").style.border = "1px solid blue";
        document.querySelector(".experiment-board-left").style.gridTemplateColumns = `repeat(${column}, ${size}px)`;
        document.querySelector(".experiment-board-left").style.gridTemplateRows = `repeat(${row}, ${size}px)`;

        document.querySelector(".experiment-board-right").style.display = "grid";
        document.querySelector(".experiment-board-right").style.border = "1px solid red"
        document.querySelector(".experiment-board-right").style.gridTemplateColumns = `repeat(${column}, ${size}px)`;
        document.querySelector(".experiment-board-right").style.gridTemplateRows = `repeat(${row}, ${size}px)`;


        document.getElementById("border1Button").style.display = "block";
        document.getElementById("border2Button").style.display = "none";
    }

}

// =================================================================================================================
//GAME LOGIC
// =================================================================================================================

const board = document.getElementById("gameBoard");
const startText = document.getElementById("startText")

//create player at initial position (bottom middle)
//MESS AROUND WITH THIS AS WE DON'T NEED AN ARRAY
let player = [{ x: column / 2 , y: row}];

//THIS IS GOING TO CHANGE FOR OURS.
//MAKE AN ARRAY OF TARGETS?
let target = positionTarget();

let direction = 'up'

let gameInterval;
let playerMovementSpeed = 200;
let opponentMovementSpeed = playerMovementSpeed * 1.02

let gameStarted = false;

function draw(){
    board.innerHTML = '';
    createPlayer();
    createTarget();
    //I HAD A WAY OF MAKING MULTIPLE TARGETS BUT IT HAS ISSUES

}

// makeTargets(3);
//
// function makeTargets(targetAmount) {
//     for (let i = 0; i < targetAmount; i++) {
//         createTarget();
//     }
// }

function createPlayer(){
    player.forEach((segment) => {
        const snakeElement = createElement('div', 'player');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement)
    })
}

function createElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}


//AN EXAMPLE OF WHAT OURS WOULD BE LIKE INSTEAD

//TODO: START A TIMER WHEN THE MOVEMENT STARTS

//example target data
// let target = {
//     targetX: 10,
//     targetY: 10,
//     color: 'Red',
//     disappear: false,
//     timeToClick: 0.0
// };


// function setTarget (targetX, targetY, color, disappear, timeToClick) {
//     const targetElement = createElement('div', 'target')
//     setPosition(targetElement, targetX, targetY)
// }

function createTarget() {
    const targetElement = createElement('div', 'target')
    //THIS LETS YOU ADD MULTIPLE TARGETS BUT IT UPDATES THEIR POSITIONS EVERY FRAME
    // const target = positionTarget()
    setPosition(targetElement, target)
    board.appendChild(targetElement)
}

//SINCE WE'RE HARDCODING TARGETS PER LEVEL, THIS IS REDUNDANT LIKELY AND I HAVE COMMENTED WHAT IT MAY LOOK LIKE ABOVE
function positionTarget() {
    const x = Math.floor(Math.random() * column) + 1;
    const y = Math.floor(Math.random() * row) + 1;
    return {x, y};
}

function move() {
    const playerPosition = player[0]
    switch (direction) {
        case 'up':
            playerPosition.y--;
            break;
        case 'down':
            playerPosition.y++;
            break;
        case 'left':
            playerPosition.x--;
            break;
        case 'right':
            playerPosition.x++;
            break;
    }
    player.unshift(playerPosition);


    //TODO: IT STILL INCREASES THE SIZE, MAKE SURE IT DOESN'T DO THAT
    //TODO: BORDER COLLISION
    //IF YOU TOUCH THE TARGET, GET THE INFO FOR THE TARGET OUT AND SEND IT ALL AS A CSV LATER
    if (playerPosition.x === target.x && playerPosition.y === target.y) {
        //MAKE NEW TARGET, WHICH WE DON'T DO AS WE GENERATE A WHOLE NEW BOARD AND STUFF I THINK
        target = positionTarget()
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            // checkCollision();
            draw();
        }, playerMovementSpeed)
    }
    else {
        player.pop();
    }
}


function handleMovement(event) {
    if (!gameStarted) {
    }

    else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up'
                break;
            case 'w':
                direction = 'up'
                break;

            case 'ArrowLeft':
                direction = 'left'
                break;
            case 'a':
                direction = 'left'
                break;

            case 's':
                direction = 'down'
                break;
            case 'ArrowDown':
                direction = 'down'
                break;

            case 'd':
                direction = 'right'
                break;
            case 'ArrowRight':
                direction = 'right'
                break;
        }
    }
}


// TODO: Collision Checking for when i can fix the board switching with the player
// function checkCollision() {
//
// }
