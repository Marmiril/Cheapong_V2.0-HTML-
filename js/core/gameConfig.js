
export const GAME_SETTINGS = {
    canvasWidth: 800,
    canvasHeight: 600,
    paddleWidth: 80,
    paddleHeight: 10,
    paddleSpeed: 7,
    ballSize: 15,
    ballSpeed: Math.sqrt(5 ** 2 + 5 ** 2),
    speedIncreaseFactor: 1.1,
    maxBallSpeed: 18,
    maxPaddleSpeed: 18,
    pointMessageDuration: 800
};

export const Difficulty = {
    EASY: "EASY",
    NORMAL: "NORMAL",
    HARD: "HARD"
}

export const DIFFICULTY_SETTINGS = {

    [Difficulty.EASY]: {
        phases: [0.50, 0.10],
        trackingPhases: [],
        maxErrorFactor: 0.40,
        maxDrift: 0.12,
        returnMode: "STAY",
        servePlanRanks: [3, 4, 5]
    },
    [Difficulty.NORMAL]: {
        phases: [0.50, 0.25, 0.10],
        trackingPhases: [],
        maxErrorFactor: 0.25,
        maxDrift: 0.08,
        returnMode: "CENTER",
        servePlanRanks: [1, 2, 3]
    },

    [Difficulty.HARD]: {
        phases: [0.90, 0.75, 0.50, 0.25, 0.10],
        trackingPhases: [0.25, 0.50, 0.75],
        maxErrorFactor: 0.15,
        maxDrift: 0.05,
        returnMode: "TRACK",
        servePlanRanks: [0, 1]
    }
};

export function getDifficultyByMatch(currentMatch) {
    if (currentMatch <= 3) { return Difficulty.EASY; }
    if (currentMatch <= 8) { return Difficulty.NORMAL; }
    return Difficulty.HARD;
}