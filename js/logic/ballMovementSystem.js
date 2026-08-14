export function updateBall(ball) {
    ball.savePreviousPosition();

    ball.x += ball.speedX;
    ball.y += ball.speedY;
}

export function normalizeBallSpeed(ball, targetSpeed) {
    const currentSpeed = Math.sqrt(ball.speedX ** 2 + ball.speedY ** 2);

    if (currentSpeed === 0) { return; }

    ball.speedX = ball.speedX / currentSpeed * targetSpeed;
    ball.speedY = ball.speedY / currentSpeed * targetSpeed;
}