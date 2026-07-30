/*
export function updateCpuPaddle(cpuPaddle, ball) {
    const predictedBallX = predictBallX(ball, cpuPaddle);
    const ballCenter = predictedBallX + ball.size / 2;
    const paddleCenter = cpuPaddle.x + cpuPaddle.width / 2;

    if (ballCenter < paddleCenter) { cpuPaddle.x -= cpuPaddle.speed; }
    if (ballCenter > paddleCenter) { cpuPaddle.x += cpuPaddle.speed; }
}
*/
export function calculateCpuTargetX(cpuPaddle, ball) {
    const predicedBallX = predictBallX(ball, cpuPaddle);

    return predicedBallX + ball.size / 2 - cpuPaddle.width / 2;
}

function predictBallX(ball, cpuPaddle) {
    const distanceY = ball.y - (cpuPaddle.y + cpuPaddle.height);
    const framesToReach = distanceY / Math.abs(ball.speedY);

    return ball.x + ball.speedX * framesToReach;
}