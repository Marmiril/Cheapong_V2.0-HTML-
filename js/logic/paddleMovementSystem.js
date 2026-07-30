export function updatePlayerPaddle(paddle, inputState, canvasWidth) {
    paddle.prevX = paddle.x;

    if (inputState.up) { return; }

    if (inputState.left) paddle.x -= paddle.speed;
    if (inputState.right) paddle.x += paddle.speed;

    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvasWidth) {
        paddle.x = canvasWidth - paddle.width;
    }
}

export function updateCpuPaddle(cpuPaddle, targetX, canvasWidth) {
    cpuPaddle.prevX = cpuPaddle.x;

    if (cpuPaddle.x < targetX) { cpuPaddle.x += cpuPaddle.speed; }

    if (cpuPaddle.x > targetX) { cpuPaddle.x -= cpuPaddle.speed; }

    cpuPaddle.x = Math.max(
        0,
        Math.min(cpuPaddle.x, canvasWidth - cpuPaddle.width)
    );
}