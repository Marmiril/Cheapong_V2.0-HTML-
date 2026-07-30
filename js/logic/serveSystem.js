import { GameState } from "../states/gameState.js";

export function updateServe(ball, paddle, gameState) {
    ball.x = paddle.x + (paddle.width + ball.size) / 2;

    if (gameState === GameState.SERVE_PLAYER) { ball.y = paddle.y - ball.size; }
    if (gameState === GameState.SERVE_CPU) { ball.y = paddle.y + paddle.height; }
}

export function launchPlayerServe(ball) {
    ball.speedX = 0;
    ball.speedY = -4.5;

    return GameState.RALLY;
}