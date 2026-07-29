export function updatePlayerPaddle(paddle, inputState, canvasWidth) {
    if (inputState.left) paddle.x -= paddle.speed;
    if (inputState.right) paddle.x += paddle.speed;

    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvasWidth) {
        paddle.x = canvasWidth - paddle.width;
    }
}