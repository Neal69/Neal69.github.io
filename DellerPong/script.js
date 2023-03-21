// write pong with image deller.bmp as ball and diplsay in html canvas with id "canvas"

// create start button
var startButton = document.createElement("button");
startButton.innerHTML = "Faster Mode";
startButton.style.position = "centre";
startButton.style.top = "50%";
startButton.style.left = "50%";
startButton.style.transform = "translate(-50%, -50%)";
startButton.style.width = "100px";
startButton.style.height = "50px";
startButton.style.fontSize = "20px";
startButton.style.fontWeight = "bold";
startButton.style.backgroundColor = "#00bcdd";
startButton.style.color = "white";
startButton.style.border = "none";
startButton.style.borderRadius = "5px";
startButton.style.cursor = "pointer";
startButton.style.outline = "none";

//create start button event listener
startButton.addEventListener("click", function() {
    startButton.style.display = "none";
    loopSound();
    draw();
});

//append start button to body
document.body.appendChild(startButton);

//create audio element
var audio = document.createElement("audio");
audio.src = "bong.mp3";
audio.loop = false;

//create play sound function
function playSound() {
    audio.play();
}

function loopSound() {
    audio.play(); 
    audio.loop = true;
}

//create stop sound function
function stopSound() {
    audio.pause();
}

// create canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// create ball
var ball = new Image();
ball.src = "deller.bmp";

// create ball position
var x = canvas.width/2;
var y = canvas.height-30;

// create ball speed
var dx = 2;
var dy = -2;

// create ball size
var ballRadius = 30;

// create paddle
var paddleHeight = 10;
var paddleWidth = 200;
var paddleX = (canvas.width-paddleWidth)/2;

// create paddle speed
var rightPressed = false;
var leftPressed = false;

// create brick
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

// create score
var score = 0;

// create lives
var lives = 8;

// create bricks
var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// create event listener for key down
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// create event listener for mouse movement
document.addEventListener("mousemove", mouseMoveHandler, false);

// create key down handler
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

// create key up handler
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

// create mouse move handler
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

// create collision detection but make the surface area of the ball larger
function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}


// create draw ball
function drawBall() {
    ctx.drawImage(ball, x, y);
}

// create draw paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#00bcdd";
    ctx.fill();
    ctx.closePath();
}

// create draw bricks
function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#00bcdd";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// create draw score
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#00bcdd";
    ctx.fillText("Score: "+score, 8, 20);
}

// create draw lives
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#00bcdd";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

// create draw
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                playSound();
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}


draw();

// end of script.js