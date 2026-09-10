const playerPaddleImg = new Image();
playerPaddleImg.src = "assets/img/ui/playerPaddle.png";

const cpuPaddleImg = new Image();
cpuPaddleImg.src = "assets/img/ui/cpuPaddle.png";

export function drawPaddle(ctx, paddle, type) {

    const paddleImg = type === "PLAYER"
        ? playerPaddleImg
        : cpuPaddleImg;

    ctx.drawImage(
        paddleImg,
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

export function clearCanvas(ctx, canvasWidth, canvasHeight) {
    //ctx.fillStyle = "black";
    //ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

/**
 * Draws centered text on the canvas.
 *
 * @param {string} text - Text to draw.
 * @param {number} y - Vertical position.
 * @param {number} fontSize - Font size in pixels.
 */
export function drawCenteredText(ctx, canvasWidth, text, canvasHeight, fontSize = 32) {
    ctx.fillStyle = "white";
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(text, canvasWidth / 2, canvasHeight);
}

export function renderMainMenu(ctx, canvasWidth, canvasHeight) {
    clearCanvas(ctx, canvasWidth, canvasHeight);
    drawCenteredText(ctx, canvasWidth, "CHEAPONG", canvasHeight * 0.30, 30);
    drawCenteredText(ctx, canvasWidth, "PRESS SPACE TO START", canvasHeight * 0.50, 25);
    drawCenteredText(ctx, canvasWidth, "3 POINT FOR A MATCH", canvasHeight * 0.60, 16);
    drawCenteredText(ctx, canvasWidth, "10 MATCHES FOR ETERNAL GLORY", canvasHeight * 0.70, 16);
}


