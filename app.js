const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gridSize = 20;
const tileCount = canvas.width / gridSize;
const appleImg = new Image();
appleImg.src = 'assets/apple.png';
let score = 0;
let speed = 100;
const music = new Audio('assets/snake.wav');
music.loop = true;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        music.pause();
    }
});

window.addEventListener('blur', function () {
music.pause();
});
let dx = gridSize;
let dy = 0;
let isGameOver = false;
let snake = [
    { x: 160, y: 200 },
    { x: 140, y: 200 },
    { x: 120, y: 200 },
  ];
let food = getRandomFoodPosition();
document.addEventListener('keydown', changeDirection);
function main() {
    if (isGameOver) return;
    setTimeout(function onTime() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        checkCollision();
        main();
    }, speed); 
}
    main();
function clearCanvas() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function drawSnake() {
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? '#8BC34A' : '#4CAF50';
        ctx.strokeStyle = '#1a1a1a';
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
        ctx.strokeRect(part.x, part.y, gridSize, gridSize);
    });
}
function moveSnake() {
    let newX = snake[0].x + dx;
    let newY = snake[0].y + dy;
    if (newX >= canvas.width) {
        newX = 0;
     }
    if (newX < 0) {
        newX = canvas.width - gridSize;
     }
    if (newY >= canvas.height) {
        newY = 0;
     }
    if (newY < 0) {
        newY = canvas.height - gridSize;
     }
    const head = {
        x: newX,
        y: newY
      };
    snake.unshift(head);
    const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
    if (hasEatenFood) {
        score += 10;
        scoreElement.textContent = score;
        speed = speed - 5;
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }
}
function getRandomFoodPosition() {
    let foodX, foodY;
    while (true) {
        foodX = Math.floor(Math.random() * tileCount) * gridSize;
        foodY = Math.floor(Math.random() * tileCount) * gridSize;
        let onSnake = snake.some(part => part.x === foodX && part.y === foodY);
        if (!onSnake) break;
    }
    return { x: foodX, y: foodY };
}
function drawFood() {
    ctx.drawImage(appleImg, food.x, food.y, gridSize, gridSize);
}
function changeDirection(event) {
    const keyPressed = event.keyCode;
     music.play(); 
    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;
    const SPACE_KEY = 32;
    if (keyPressed === SPACE_KEY && isGameOver) {
        restartGame();
        return;
    }
    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;
    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -gridSize;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -gridSize;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = gridSize;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = gridSize;
    }
}
function checkCollision() {
    let hitSelf = false;
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            hitSelf = true;
            break;
        }
    }
    if (hitSelf) {
        isGameOver = true;
        music.pause();
        drawGameOver();
    }
}
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '16px Segoe UI';
    ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 30);
}
function restartGame() {
    score = 0;
    speed = 100;
    music.currentTime = 0;  
    music.play();
    scoreElement.textContent = score;
    dx = gridSize;
    dy = 0;
    isGameOver = false;
    snake = [
        { x: 160, y: 200 },
        { x: 140, y: 200 },
        { x: 120, y: 200 }
    ];
    food = getRandomFoodPosition();
    main();
}

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', function (event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;

    music.play();
    event.preventDefault();
});

canvas.addEventListener('touchend', function (event) {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const differenceX = touchEndX - touchStartX;
    const differenceY = touchEndY - touchStartY;

    if (isGameOver) {
        restartGame();
        return;
    }

    if (Math.abs(differenceX) > Math.abs(differenceY)) {
        if (differenceX > 0 && !goingLeft()) {
            dx = gridSize;
            dy = 0;
        }
        if (differenceX < 0 && !goingRight()) {
            dx = -gridSize;
            dy = 0;
        }
    }
    else {
        if (differenceY > 0 && !goingUp()) {
            dx = 0;
            dy = gridSize;
        }
        if (differenceY < 0 && !goingDown()) {
            dx = 0;
            dy = -gridSize;
        }
    }
    event.preventDefault();
});
function goingUp() {
    return dy === -gridSize;
}
function goingDown() {
    return dy === gridSize;
}
function goingRight() {
    return dx === gridSize;
}
function goingLeft() {
    return dx === -gridSize;
}