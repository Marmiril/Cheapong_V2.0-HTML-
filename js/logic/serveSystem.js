import { GameState } from "../states/gameState.js";
import { inputState } from "../input/inputState.js";

const SPIN = 4.5
const BALL_SPEED = 6;

export function updateServe(ball, paddle, gameState) {
    ball.x = paddle.x + (paddle.width - ball.size) / 2;

    if (gameState === GameState.SERVE_PLAYER) { ball.y = paddle.y - ball.size; }
    if (gameState === GameState.SERVE_CPU) { ball.y = paddle.y + paddle.height; }
}

export function launchPlayerServe(ball, inputState) {
    ball.speedX = 0;
    ball.speedY = -BALL_SPEED;

    if (inputState.up && inputState.left) { ball.speedX = -SPIN; }
    if (inputState.up && inputState.right) { ball.speedX = +SPIN; }

    return GameState.RALLY;
}

export function launchCpuServe(ball) {
    ball.speedX = 0;
    ball.speedY = BALL_SPEED;

    return GameState.RALLY;
}