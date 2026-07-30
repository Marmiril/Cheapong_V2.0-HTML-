export function updateCpuPadddle(cpuPaddle, ball) {
    const ballCenter = ball.x + ball.size / 2;
    const paddleCenter = cpuPaddle.x + cpuPaddle.width / 2;

    if (ballCenter < paddleCenter) { cpuPaddle.x -= cpuPaddle.speed; }
    if (ballCenter > paddleCenter) { cpuPaddle.x += cpuPaddle.speed; }
}
