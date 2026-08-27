import { normalizeBallSpeed } from "./ballMovementSystem.js";
import { HitEffect } from "./hitEffect.js";
import {
    calculateCpuHitEffect,
    NORMAL_EFFECTS
} from "./aiSystem.js";

import { playPaddleHit } from "../game/soundSystem.js";

const SPIN_FACTOR = 0.35;
const INPUT_SPIN_BONUS = 2.2;
const CPU_BREAK_BONUS = 2.2;

function intersects(ball, paddle) {
    return (
        ball.x < paddle.x + paddle.width &&
        ball.x + ball.size > paddle.x &&
        ball.y < paddle.y + paddle.height &&
        ball.y + ball.size > paddle.y
    )
}

export function handleWallCollision(ball, canvasWidth, canvasHeight) {
    if (ball.x <= 0) { ball.x = 0; ball.speedX *= -1; }

    if (ball.x + ball.size >= canvasWidth) {
        ball.x = canvasWidth - ball.size;
        ball.speedX *= -1;
    }

    /*
    if (ball.y <= 0) { ball.y = 0; ball.speedY *= -1; }

    if (ball.y + ball.size >= canvasHeight) {
        ball.y = canvasHeight - ball.size;
        ball.speedY *= -1;
    }
    */
}

export function handlePlayerPaddleCollision(ball, playerPaddle, inputState, ballSpeed) {
    const isColliding = intersects(ball, playerPaddle);

    if (!isColliding || ball.speedY <= 0) { return; }

    const overlapsX =
        ball.x < playerPaddle.x + playerPaddle.width &&
        ball.x + ball.size > playerPaddle.x;

    const wasAbove = ball.prevY + ball.size <= playerPaddle.y;

    const crossEdgeTop = ball.y + ball.size >= playerPaddle.y;

    if (overlapsX &&
        wasAbove &&
        crossEdgeTop &&
        ball.speedY > 0
    ) {
        ball.y = playerPaddle.y - ball.size;
        ball.speedY *= -1;

        playPaddleHit();

        applyPlayerSpin(ball, playerPaddle, inputState, ballSpeed);
    }



    /*
    if (isColliding && ball.speedY > 0) {
        const incomingSpeedX = ball.speedX;
        const paddleDeltaX = playerPaddle.x - playerPaddle.prevX;

        ball.y = playerPaddle.y - ball.size;
        ball.speedY *= -1;

        if (inputState.up) { ball.speedX = 0; return; }
        if (inputState.down) {
            ball.speedX = -incomingSpeedX;
            if (inputState.left) { ball.speedX -= INPUT_SPIN_BONUS; }
            if (inputState.right) { ball.speedX += INPUT_SPIN_BONUS; }
        }
        ball.speedX += paddleDeltaX * SPIN_FACTOR;
        normalizeBallSpeed(ball, ballSpeed);
    }
    */
}

function applyPlayerSpin(ball, playerPaddle, inputState, ballSpeed) {
    const paddleDeltaX = playerPaddle.x - playerPaddle.prevX;
    const movementSpin = paddleDeltaX * SPIN_FACTOR;

    if (inputState.right) { ball.speedX += INPUT_SPIN_BONUS; }
    else if (inputState.left) { ball.speedX -= INPUT_SPIN_BONUS; }
    else if (inputState.down) { ball.speedX *= -1; }
    else if (inputState.up) { ball.speedX = 0; }
    else { ball.speedX += movementSpin; }

    normalizeBallSpeed(ball, ballSpeed);
}

export function handleCpuPaddleCollision(
    ball,
    cpuPaddle,
    playerPaddle,
    canvasWidth,
    ballSpeed) {

    const isColliding = intersects(ball, cpuPaddle);

    if (!isColliding || ball.speedY >= 0) { return; }

    /*
    if (isColliding && ball.speedY < 0) { ball.y = cpuPaddle.y + cpuPaddle.height; ball.speedY *= -1; }
    normalizeBallSpeed(ball, ballSpeed);
    */

    ball.y = cpuPaddle.y + cpuPaddle.height;
    ball.speedY *= -1;

    playPaddleHit();

    const effect = calculateCpuHitEffect(ball, playerPaddle, canvasWidth, NORMAL_EFFECTS);

    applyCpuEffect(ball, cpuPaddle, effect, ballSpeed);
}

function applyCpuEffect(ball, cpuPaddle, effect, ballSpeed) {
    const paddleDeltaX = cpuPaddle.x - cpuPaddle.prevX;
    const movementSpin = paddleDeltaX * SPIN_FACTOR;

    // Applies the natural spin produced by the CPU paddle movement.
    ball.speedX += movementSpin;

    switch (effect) {
        case HitEffect.NONE:
            break;
        case HitEffect.UP:
            ball.speedX = 0;
            break;
        case HitEffect.DOWN:
            ball.speedX *= -1;
            break;
        case HitEffect.BREAK_LEFT:
            ball.speedX -= CPU_BREAK_BONUS;
            break;
        case HitEffect.BREAK_RIGHT:
            ball.speedX += CPU_BREAK_BONUS;
            break;
    }

    normalizeBallSpeed(ball, ballSpeed);
}
