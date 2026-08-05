const SPIN_FACTOR = 0.35;
const INPUT_SPIN_BONUS = 2.2;

function intersects(ball, paddle) {
    return (
        ball.x < paddle.x + paddle.width &&
        ball.x + ball.size > paddle.x &&
        ball.y < paddle.y + paddle.height &&
        ball.y + ball.size > paddle.y
    )
}

export function handleWallCollision(ball, canvasWidth, canvasHeight) {
    if (ball.x <= 0) { ball.x = 0; ball.speedX *= -1; }

    if (ball.x + ball.size >= canvasWidth) {
        ball.x = canvasWidth - ball.size;
        ball.speedX *= -1;
    }

    if (ball.y <= 0) { ball.y = 0; ball.speedY *= -1; }

    if (ball.y + ball.size >= canvasHeight) {
        ball.y = canvasHeight - ball.size;
        ball.speedY *= -1;
    }
}

export function handlePlayerPaddleCollision(ball, playerPaddle, inputState) {
    const isColliding = intersects(ball, playerPaddle);

    if (isColliding && ball.speedY > 0) {
        const incomingSpeedX = ball.speedX;
        const paddleDeltaX = playerPaddle.x - playerPaddle.prevX;

        ball.y = playerPaddle.y - ball.size;
        ball.speedY *= -1;

        if (inputState.up) { ball.speedX = 0; return; }
        if (inputState.down) {
            ball.speedX = -incomingSpeedX;
            if (inputState.left) { ball.speedX -= INPUT_SPIN_BONUS; }
            if (inputState.right) { ball.speedX += INPUT_SPIN_BONUS; }
        }
        ball.speedX += paddleDeltaX * SPIN_FACTOR;
    }
}

export function handleCpuPaddleCollision(ball, cpuPaddle) {
    const isColliding = intersects(ball, cpuPaddle);
    if (isColliding && ball.speedY < 0) { ball.y = cpuPaddle.y + cpuPaddle.height; ball.speedY *= -1; }
}