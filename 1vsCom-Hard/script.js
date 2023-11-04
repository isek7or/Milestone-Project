// CANVAS 2D RENDERING
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 27;


// KEYBOARD INPUT
const keyPressed = [];
const KEY_UP = 38;
const KEY_DOWN = 40;

window.addEventListener('keydown', function (e) {
    keyPressed[e.keyCode] = true;
});

window.addEventListener('keyup', function (e) {
    keyPressed[e.keyCode] = false;
});


// VECTOR PROPERTIES
function vec2(x, y) {
    return { x: x, y: y };
}


// BALL ATTRIBUTES AND METHODS
function Ball(pos, velocity, radius) {

    this.pos = pos;
    this.velocity = velocity;
    this.radius = radius;

    this.update = function () {
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
    };

    this.draw = function () {
        ctx.fillStyle = "#33ff00";
        ctx.strokeStyle = "#33ff00";
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    };
}


// PADDLE ATTRIBUTES AND METHODS
function Paddle(pos, velocity, width, height) {

    this.pos = pos;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.score = 0;

    this.update = function () {
        if (keyPressed[KEY_UP]) {
            this.pos.y -= this.velocity.y;
        }
        if (keyPressed[KEY_DOWN]) {
            this.pos.y += this.velocity.y;
        }
    };

    this.draw = function () {
        ctx.fillStyle = "#33ff00"
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
        ctx.fill();
    };

    this.getHalfWidth = function () {
        return this.width / 2;
    };

    this.getHalfHeight = function () {
        return this.height / 2;
    };

    this.getCenter = function () {
        return vec2(this.pos.x + this.getHalfWidth(), this.pos.y + this.getHalfHeight());
    };
}


// BALL COLLISION WITH TOP AND BOTTOM EDGES
function ballCollisionWithTheEdges(ball) {

    if (ball.pos.y + ball.radius >= canvas.height) {

        ball.velocity.y *= -1;
    }

    if (ball.pos.y - ball.radius <= 0) {

        ball.velocity.y *= -1;
    }

    /* if (ball.pos.x + ball.radius >= canvas.width) {

        ball.velocity.x *= -1;
    }

    if (ball.pos.x - ball.radius <= 0) {

        ball.velocity.x *= -1;
    } */
}


// PADDLE COLLISION WITH TOP AND BOTTOM EDGES
function paddleCollisionWithEdges(paddle) {

    if (paddle.pos.y <= 0) {

        paddle.pos.y = 0;
    }

    if (paddle.pos.y + paddle.height >= canvas.height) {

        paddle.pos.y = canvas.height - paddle.height;
    }
}


// BALL AND PADDLE COLLISION
function ballPaddleCollision(ball, paddle) {

    let dx = Math.abs(ball.pos.x - paddle.getCenter().x);
    let dy = Math.abs(ball.pos.y - paddle.getCenter().y);

    if (dx <= (ball.radius + paddle.getHalfWidth()) && dy <= (ball.radius + paddle.getHalfHeight())) {

        ball.velocity.x *= -1;
    }
}


// PADDLE 2 AI MOVEMENT (BALL TRACK)
function player2AI(ball, paddle) {

    if (ball.velocity.x > 0) {

        if (ball.pos.y > paddle.pos.y) {

            paddle.pos.y += paddle.velocity.y;

            if (paddle.pos.y + paddle.height >= canvas.height) {

                paddle.pos.y = canvas.height - paddle.height;
            }
        }

        if (ball.pos.y < paddle.pos.y) {

            paddle.pos.y -= paddle.velocity.y;

            if (paddle.pos.y <= 0) {

                paddle.pos.y = 0;
            }
        }
    }
}


// BALL POSITION ON RESPAWN
function respawnBall(ball) {

    if (ball.velocity.x > 0) {

        ball.pos.x = 100;
        ball.pos.y = (Math.random() * (canvas.height - 200)) + 100;
    }

    if (ball.velocity.x < 0) {

        ball.pos.x = canvas.width - 100;
        ball.pos.y = (Math.random() * (canvas.height - 200)) + 100;
    }
}


// SCORING LOGIC
function increaseScore(ball, paddle1, paddle2) {

    if (ball.pos.x <= -ball.radius) {

        paddle2.score += 1;
        document.getElementById("player2Score").innerHTML = paddle2.score;
        respawnBall(ball);
    }

    if (ball.pos.x >= canvas.width + ball.radius) {

        paddle1.score += 1;
        document.getElementById("player1Score").innerHTML = paddle1.score;
        respawnBall(ball);
    }
}


// PONG TABLE RENDERING
function drawGameScene() {

    ctx.strokeStyle = "#33ff00";

    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2)
    ctx.stroke();
}


// GAME OBJECTS (and properties)
const ball = new Ball(vec2(100, 100), vec2(25, 20), 20);
const paddle1 = new Paddle(vec2(0, canvas.height / 2 - 60), vec2(15, 15), 20, 120);
const paddle2 = new Paddle(vec2(canvas.width - 20, canvas.height / 2 - 60), vec2(15, 15), 20, 120);


// CALLING ON GAME EVENTS
function gameUpdate() {

    ball.update();
    paddle1.update();
    paddleCollisionWithEdges(paddle1);

    player2AI(ball, paddle2);

    ballCollisionWithTheEdges(ball);
    ballPaddleCollision(ball, paddle1);
    ballPaddleCollision(ball, paddle2);

    increaseScore(ball, paddle1, paddle2);
}


// CALLING ON GAME OBJECTS
function gameDraw() {

    ball.draw();
    paddle1.draw();
    paddle2.draw();

    drawGameScene();
}


// GAME RENDERING (ANIMATION)
function gameLoop() {

    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    window.requestAnimationFrame(gameLoop);

    gameUpdate();
    gameDraw();
}

gameLoop();