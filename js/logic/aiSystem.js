/*
export function updateCpuPaddle(cpuPaddle, ball) {
    const predictedBallX = predictBallX(ball, cpuPaddle);
    const ballCenter = predictedBallX + ball.size / 2;
    const paddleCenter = cpuPaddle.x + cpuPaddle.width / 2;

    if (ballCenter < paddleCenter) { cpuPaddle.x -= cpuPaddle.speed; }
    if (ballCenter > paddleCenter) { cpuPaddle.x += cpuPaddle.speed; }
}
*/
export function calculateCpuTargetX(cpuPaddle, ball, canvasWidth) {
    const predicedBallX = predictBallX(ball, cpuPaddle, canvasWidth);

    return predicedBallX + ball.size / 2 - cpuPaddle.width / 2;
}

function predictBallX(ball, cpuPaddle, canvasWidth) {
    const distanceY = ball.y - (cpuPaddle.y + cpuPaddle.height);
    const framesToReach = distanceY / Math.abs(ball.speedY);

    const rawBallCenterX = ball.x + ball.size / 2 + ball.speedX * framesToReach;
    const reflectedBallCenterX = reflectX(rawBallCenterX, ball.size, canvasWidth);

    return reflectedBallCenterX - ball.size / 2;
}

function reflectX(rawBallCenterX, ballSize, canvasWidth) {
    const minBallCenterX = ballSize / 2;
    const maxBallCenterX = canvasWidth - ballSize / 2;
    const playableWidth = maxBallCenterX - minBallCenterX;

    let reflectedX = (rawBallCenterX - minBallCenterX) % (playableWidth * 2);

    if (reflectedX < 0) { reflectX += playableWidth * 2; }
    if (reflectedX > playableWidth) { reflectedX = playableWidth * 2 - reflectX; }

    return reflectedX + minBallCenterX;
}