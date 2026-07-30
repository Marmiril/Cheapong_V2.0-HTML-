const PHASES = [0.90, 0.75, 0.50, 0.25, 0.10];
let currentPhase = -1;
let targetX = 0;

const MAX_ERROR_FACTOR = 0.40;

export function calculateCpuTargetX(cpuPaddle, ball, canvasWidth, canvasHeight) {
    if (ball.speedY >= 0) {
        currentPhase = -1;
        targetX = canvasWidth / 2 - cpuPaddle.width / 2;
        return targetX;
    }

    for (let i = 0; i < PHASES.length; i++) {
        const phaseY = canvasHeight * PHASES[i];

        if (ball.y <= phaseY && currentPhase < i) {
            currentPhase = i;
            const cleanTargetX = predictBallX(ball, cpuPaddle, canvasWidth) + ball.size / 2 - cpuPaddle.width / 2;
            const aimError = calculateAimError(cpuPaddle, currentPhase);

            targetX = cleanTargetX + aimError;
            break;
        }
    }

    return targetX;
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

    if (reflectedX < 0) { reflectedX += playableWidth * 2; }
    if (reflectedX > playableWidth) { reflectedX = playableWidth * 2 - reflectedX; }

    return reflectedX + minBallCenterX;
}

function calculateAimError(cpuPaddle, phaseIndex) {
    const phaseErrorFactor = PHASES[phaseIndex];
    const maxError = cpuPaddle.width * MAX_ERROR_FACTOR * phaseErrorFactor;

    return Math.random() * maxError * 2 - maxError;
}