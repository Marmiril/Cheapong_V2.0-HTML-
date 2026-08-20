export function updatePlayerPaddle(paddle, inputState, canvasWidth) {
    paddle.prevX = paddle.x;

    const isApplingSpin = inputState.down && (inputState.left || inputState.right);

    if (isApplingSpin) { return; }

    if (inputState.left) paddle.x -= paddle.speed;
    if (inputState.right) paddle.x += paddle.speed;

    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvasWidth) {
        paddle.x = canvasWidth - paddle.width;
    }
}

export function updateCpuPaddle(cpuPaddle, targetX, canvasWidth) {

    cpuPaddle.prevX = cpuPaddle.x;

    const distanceToTarget = targetX - cpuPaddle.x;

    // Snaps to the target when it is closer than one movement step
    if (Math.abs(distanceToTarget) <= cpuPaddle.speed) {
        cpuPaddle.x = targetX;
    } else {
        cpuPaddle.x += Math.sign(distanceToTarget) * cpuPaddle.speed;
    }

    /*
    if (cpuPaddle.x < targetX) { cpuPaddle.x += cpuPaddle.speed; }

    if (cpuPaddle.x > targetX) { cpuPaddle.x -= cpuPaddle.speed; }
*/
    cpuPaddle.x = Math.max(
        0,
        Math.min(cpuPaddle.x, canvasWidth - cpuPaddle.width)
    );
}