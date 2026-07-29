export function drawPaddle(ctx, paddle) {
    ctx.fillStyle = "white";

    ctx.fillRect(
        paddle.x,
        paddle.y,
        paddle.width,
        paddle.height
    );
}

export function drawBall(ctx, ball) {
    const radius = ball.size / 2;
    const centerX = ball.x + radius;
    const centerY = ball.y + radius;

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
}