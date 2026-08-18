import { HitEffect } from "./hitEffect.js";

// Defines the moments when the CPU recalculates its target.
// Higher values happen earlier while the ball is still far from the CPU.
const PHASES = [0.90, 0.75, 0.50, 0.25, 0.10];

// Effects for Ai response
const NORMAL_EFFECTS = [
    HitEffect.NONE,
    HitEffect.UP,
    HitEffect.DOWN
];

// Horizontal speed applied by the CPU to break a vertical ball trajectory.
const CPU_BREAK_BONUS = 2.2;

// Stores the last phase already processed.
// Prevents the CPU from recalculating the target every frame.
let currentPhase = -1;

// Stores the curretn X postiion the CPU wants to reach
let targetX = 0;


// Controle how much the CPU can miss its prediction.
// Higher value means a less accurate CPU.
const MAX_ERROR_FACTOR = 0.40;

// Controls a small random side variation added to the CPU target.
// This makes the CPU movement feel less robotic.
const MAX_DRIFT = 0.12;

export function calculateCpuTargetX(cpuPaddle, ball, canvasWidth, canvasHeight) {
    // If the ball is moving down, it is going away from the CPU.
    // The CPU resets its phase and returns to the center.
    if (ball.speedY >= 0) {
        currentPhase = -1;
        targetX = canvasWidth / 2 - cpuPaddle.width / 2;
        return targetX;
    }

    // Checks each phase to know if the CPU should update its target now.
    for (let i = 0; i < PHASES.length; i++) {
        const phaseY = canvasHeight * PHASES[i];

        // The CPU recalculates only when the ball reaches a new phase.
        if (ball.y <= phaseY && currentPhase < i) {
            currentPhase = i;

            // Calculates the ideal target without any human eror.
            const cleanTargetX = predictBallX(ball, cpuPaddle, canvasWidth)
                + ball.size / 2
                - cpuPaddle.width / 2;

            // Adds a controlled aiming mistake depending on the current phase.
            const aimError = calculateAimError(cpuPaddle, currentPhase);

            // Adds a small random variation to avoid perfect movement.
            const drift = calculateDrift(cpuPaddle);

            targetX = cleanTargetX + aimError + drift;
            break;
        }
    }

    return targetX;
}

function predictBallX(ball, cpuPaddle, canvasWidth) {

    const distanceY = ball.y - (cpuPaddle.y + cpuPaddle.height);

    // Estimates how many frames the ball needs to reach the CPU paddle.
    const framesToReach = distanceY / Math.abs(ball.speedY);

    // Predicts the future X center of the ball without considering walls yet.
    const rawBallCenterX = ball.x + ball.size / 2 + ball.speedX * framesToReach;

    // Adjusts the prediction if the ball would bounce against side walls.
    const reflectedBallCenterX = reflectX(rawBallCenterX, ball.size, canvasWidth);

    // Returns the top-left X position of the ball.
    return reflectedBallCenterX - ball.size / 2;
}

function reflectX(rawBallCenterX, ballSize, canvasWidth) {

    // Minimum and maximun valid center positions for the ball.
    const minBallCenterX = ballSize / 2;
    const maxBallCenterX = canvasWidth - ballSize / 2;

    // Horizontal space where the ball center can move.
    const playableWidth = maxBallCenterX - minBallCenterX;

    // Simulates repeated side-wall bounces using a mirrored range.
    let reflectedX = (rawBallCenterX - minBallCenterX) % (playableWidth * 2);

    // Fixes negative modulo results.
    if (reflectedX < 0) { reflectedX += playableWidth * 2; }

    // Mirrors the position when it goes betond the playable width.
    if (reflectedX > playableWidth) { reflectedX = playableWidth * 2 - reflectedX; }

    // Converts the reflected local position back to canvas coordinates.
    return reflectedX + minBallCenterX;
}

function calculateAimError(cpuPaddle, phaseIndex) {
    // Early phases have more error, later phases have less error.
    const phaseErrorFactor = PHASES[phaseIndex];

    // Maximum possible error based on paddle width and phase.
    const maxError = cpuPaddle.width * MAX_ERROR_FACTOR * phaseErrorFactor;

    // Returns a random valuie between -maxError and +maxError.
    return Math.random() * maxError * 2 - maxError;
}

function calculateDrift(cpuPaddle) {
    // Returns a small random side offset based on paddle width.
    return (Math.random() * 2 - 1) * cpuPaddle.width * MAX_DRIFT;
}

function getCandidateSpeedX(ball, effect) {
    switch (effect) {
        case HitEffect.UP:
            return 0;
        case HitEffect.DOWN:
            return -ball.speedX;
        case HitEffect.BREAK_LEFT:
            return -CPU_BREAK_BONUS;
        case HitEffect.BREAK_RIGHT:
            return CPU_BREAK_BONUS;
        default:
            return ball.speedX;
    }
}

export function calculateCpuHitEffect(ball, playerPaddle, canvasWidth) {

    const playerCenterX = playerPaddle.x + playerPaddle.width / 2;
    const ballCenterX = ball.x + ball.size / 2;
    const ballCenterY = ball.y + ball.size / 2;

    const playerRight = playerPaddle.x + playerPaddle.width;
    const ballRight = ball.x + ball.size;

    // With speed = 0, the ball would follow this same horizontal track.
    const isInsidePlayerTrack =
        ballRight > playerPaddle.x &&
        ball.x < playerRight;

    if (ball.speedX === 0 && isInsidePlayerTrack) {
        if (ballCenterX < canvasWidth / 2) { return HitEffect.BREAK_RIGHT; }
        if (ballCenterX > canvasWidth / 2) { return HitEffect.BREAK_LEFT; }

        return Math.random() < 0.5
            ? HitEffect.BREAK_LEFT
            : HitEffect.BREAK_RIGHT;
    }

    let bestEffet = HitEffect.NONE;
    let longestReactionTime = -1;

    for (const effect of NORMAL_EFFECTS) {
        // Simulates the horizontal speed produced by this effect.
        const candidateSpeedX = getCandidateSpeedX(ball, effect);

        // After the CPU hit, the ball moves down towards the player.
        const candidateSpeedY = Math.abs(ball.speedY);

        if (candidateSpeedY === 0) { continue; }

        // Calculates how long the ball needs to reach the player paddle.
        const timeToPlayer = (playerPaddle.y - ballCenterY) / candidateSpeedY;

        if (timeToPlayer <= 0) { continue; }

        // Predicts the horizontal landing position
        const rawPredictedCenterX = ballCenterX + candidateSpeedX * timeToPlayer;

        const predicetdCenterX = reflectX(
            rawPredictedCenterX,
            ball.size,
            canvasWidth
        );

        // Measures how far the player would need to move.
        const distanceToTravel = Math.abs(predicetdCenterX - playerCenterX);
        const reactionTime = distanceToTravel / playerPaddle.speed;

        // Keeps the response that is hardest for the player to reach
        if (reactionTime > longestReactionTime) {
            longestReactionTime = reactionTime;
            bestEffet = effect;
        }
    }
    return bestEffet;
}