const canvas = document.getElementById("canvas").getContext("2d");

// 地圖長寬、間距
const width = 300;
const height = 300;
const unit = 30;

const verticalLine = width / unit;
const horizontalLine = height / unit;

const isTest = false;

// 定義蛇
let snakeLength = 4;
let snake = [];
let snakeHead = [];
let snakeBody = [];

// 定義食物: 座標點為左上角
let food = {x: 0, y: 0};

// 方向，預設往右
let direct = 3;

// 是否死亡
let dead = false;

// 死亡就不再定時前進
let drawId;

// 測試用，讓蛇暫停
let stop = true;

/**
 * 定義蛇座標
 */
function start() {
    for (let i = 0; i < snakeLength; i++) {
        snake[i] = {x: i * unit, y: 0};
    }
    addFood();
    draw();
}


function draw() {
    if (dead) {
        clearInterval(drawId);
        alert('GAME OVER!!');
        window.location.reload();
    }

    drawMap();
    drawSnake();
    drawFood();
}

/**
 * 畫地圖
 */
function drawMap() {
    // 畫直線
    canvas.strokeStyle = "#453017";
    for (let i = 0; i < verticalLine; i++) {
        canvas.beginPath();
        canvas.moveTo(unit * i, 0);
        canvas.lineTo(unit * i, height);
        canvas.closePath();
        canvas.stroke();
    }

    // 畫橫線
    for (let j = 0; j < horizontalLine; j++) {
        canvas.beginPath();
        canvas.moveTo(0, unit * j);
        canvas.lineTo(width, unit * j);
        canvas.closePath();
        canvas.stroke();
    }
}

/**
 * 畫蛇
 */
function drawSnake() {
    for (let i = 0; i < snakeLength; i++) {
        canvas.fillStyle = (i != snakeLength - 1) ? "#164119" : "#809532";
        canvas.fillRect(snake[i].x, snake[i].y, unit, unit);
    }
}

/**
 * 畫食物
 */
function drawFood() {
    canvas.fillStyle = "#8A2E34";
    canvas.fillRect(food.x, food.y, unit, unit);
}

/**
 * 計算新的食物座標
 */
function addFood() {
    food.x = Math.floor(Math.random() * verticalLine) * unit;
    food.y = Math.floor(Math.random() * horizontalLine) * unit;

    // 防止食物掉在蛇身上
    for (let i = 0; i < snake.length; i++) {
        if (food.x == snake[i].x && food.y == snake[i].y) {
            addFood();
        }
    }
}

/**
 * 吃到食物後長度增加
 */
function isEat() {
    if (snakeHead.x == food.x && snakeHead.y == food.y) {
        snakeLength++;
        snake.unshift({x: 0 - unit, y: 0 - unit}); // 放入地圖以外的座標，後續會被清掉重畫
        addFood();
    }
}

/**
 * 死掉
 */
function isDead() {
    // 碰到邊界
    if (snakeHead.x > width - unit || snakeHead.y > height - unit || snakeHead.x < 0 || snakeHead.y < 0) {
        dead = true;
    } else {
        // 碰到蛇身
        for (let i = 0; i < snakeBody.length; i++) {
            if (snakeHead.x == snakeBody[i].x && snakeHead.y == snakeBody[i].y) {
                dead = true;
                return;
            }
        }
    }
}

/**
 * 移動
 */
function move() {
    // 測試用，讓蛇暫停
    if (isTest && !stop) {
        return;
    }

    snakeHead = snake[snakeLength - 1];
    switch (direct) {
        case 1: snake.push({x: snakeHead.x - unit, y: snakeHead.y}); break; // 左
        case 2: snake.push({x: snakeHead.x, y: snakeHead.y - unit}); break; // 上
        case 3: snake.push({x: snakeHead.x + unit, y: snakeHead.y}); break; // 右
        case 4: snake.push({x: snakeHead.x, y: snakeHead.y + unit}); break; // 下
        case 5: snake.push({x: snakeHead.x - unit, y: snakeHead.y - unit}); break; // Q
        case 6: snake.push({x: snakeHead.x + unit, y: snakeHead.y - unit}); break; // W
        case 7: snake.push({x: snakeHead.x - unit, y: snakeHead.y + unit}); break; // A
        case 8: snake.push({x: snakeHead.x + unit, y: snakeHead.y + unit}); break; // S
        default: break;
    }

    // 刪除陣列第一個元素
    snake.shift();

    // 清除畫布重新繪製
    canvas.clearRect(0, 0, width, height);

    // 取得蛇頭
    snakeHead = snake[snakeLength - 1];

    // 取得蛇身
    snakeBody = snake.slice();
    snakeBody.pop();

    isEat();
    isDead();
    draw();
}

function keyDown(e) {
    switch (e.keyCode) {
        case 37: direct = 1; break; // 左
        case 38: direct = 2; break; // 上
        case 39: direct = 3; break; // 右
        case 40: direct = 4; break; // 下
        // case 81: direct = 5; break; // Q
        // case 87: direct = 6; break; // W
        // case 65: direct = 7; break; // A
        // case 83: direct = 8; break; // S
        case 80: stop = !stop; break; // P
        default: break;
    }
}

document.onkeydown = function (e) {
    keyDown(e);
}

// 執行
window.onload = function () {
    start();
    drawId = setInterval(move, 300);
}
