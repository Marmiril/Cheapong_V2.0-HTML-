import { GameState } from "../states/gameState.js";
import { getCandidateSpeedX } from "./aiSystem.js"
import { normalizeBallSpeed } from "./ballMovementSystem.js";
//import { playServe } from "../game/soundSystem.js";

const SPIN = 4.5
const BALL_SPEED = 6;

export function updateServe(ball, paddle, gameState) {
    ball.x = paddle.x + (paddle.width - ball.size) / 2;

    if (gameState === GameState.SERVE_PLAYER) { ball.y = paddle.y - ball.size; }
    if (gameState === GameState.SERVE_CPU) { ball.y = paddle.y + paddle.height; }
}

export function launchPlayerServe(ball, inputState, ballSpeed) {
    ball.speedX = 0;
    ball.speedY = -ballSpeed;

    if (inputState.left) { ball.speedX = -SPIN; }
    if (inputState.right) { ball.speedX = +SPIN; }

    return GameState.RALLY;
}

export function launchCpuServe(ball, effect, ballSpeed) {
    // Starts from a straight downward serve
    ball.speedX = 0;
    ball.speedY = ballSpeed;

    // Applies the effect selected during the CPU simulation
    ball.speedX = getCandidateSpeedX(ball, effect);
    normalizeBallSpeed(ball, ballSpeed);

    return GameState.RALLY;
}