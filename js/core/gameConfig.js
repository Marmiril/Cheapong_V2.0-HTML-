
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
    pointMessageDuration: 2000
};

export const Difficulty = {
    FANCY: "FANCY",
    VERY_EASY: "VERY_EASY",
    EASY: "EASY",
    VERY_NORMAL: "VERY_NORMAL",
    NORMAL: "NORMAL",
    HARD: "HARD",
    VERY_HARD: "VERY_HARD",
    BLACK_METAL: "BLACK_METAL"
}

export const DIFFICULTY_SETTINGS = {

    [Difficulty.FANCY]: {
        phases: [0.50, 0.10],
        trackingPhases: [],
        maxErrorFactor: 0.40,
        maxDrift: 0.12,
        returnMode: "STAY",
        servePlanRanks: [3, 4, 5],
        hitEffectRanks: [3, 4]
    },

    [Difficulty.VERY_EASY]: {
        phases: [0.60, 0.25, 0.10],
        trackingPhases: [],
        maxErrorFactor: 0.36,
        maxDrift: 0.11,
        returnMode: "STAY",
        servePlanRanks: [3, 4],
        hitEffectRanks: [2, 3, 4]
    },

    [Difficulty.EASY]: {
        phases: [0.65, 0.35, 0.15],
        trackingPhases: [],
        maxErrorFactor: 0.32,
        maxDrift: 0.10,
        returnMode: "CENTER",
        servePlanRanks: [2, 3, 4],
        hitEffectRanks: [2, 3]
    },

    [Difficulty.VERY_NORMAL]: {
        phases: [0.70, 0.45, 0.20, 0.10],
        trackingPhases: [],
        maxErrorFactor: 0.28,
        maxDrift: 0.09,
        returnMode: "CENTER",
        servePlanRanks: [2, 3],
        hitEffectRanks: [1, 2, 3]
    },

    [Difficulty.NORMAL]: {
        phases: [0.75, 0.50, 0.25, 0.10],
        trackingPhases: [],
        maxErrorFactor: 0.24,
        maxDrift: 0.08,
        returnMode: "CENTER",
        servePlanRanks: [1, 2, 3],
        hitEffectRanks: [1, 2]
    },

    [Difficulty.HARD]: {
        phases: [0.80, 0.60, 0.40, 0.20, 0.10],
        trackingPhases: [],
        maxErrorFactor: 0.21,
        maxDrift: 0.07,
        returnMode: "CENTER",
        servePlanRanks: [1, 2],
        hitEffectRanks: [0, 1, 2]
    },

    [Difficulty.VERY_HARD]: {
        phases: [0.85, 0.65, 0.45, 0.25, 0.10],
        trackingPhases: [0.50],
        maxErrorFactor: 0.18,
        maxDrift: 0.06,
        returnMode: "TRACK",
        servePlanRanks: [0, 1, 2],
        hitEffectRanks: [0, 1]
    },

    [Difficulty.BLACK_METAL]: {
        phases: [0.90, 0.75, 0.50, 0.25, 0.10],
        trackingPhases: [0.25, 0.50, 0.75],
        maxErrorFactor: 0.15,
        maxDrift: 0.05,
        returnMode: "TRACK",
        servePlanRanks: [0, 1],
        hitEffectRanks: [0]
    }
};

export function getDifficultyByMatch(currentMatch) {
    if (currentMatch === 1) { return Difficulty.FANCY; }
    if (currentMatch === 2) { return Difficulty.VERY_EASY; }
    if (currentMatch === 3) { return Difficulty.EASY; }
    if (currentMatch === 4) { return Difficulty.VERY_NORMAL; }
    if (currentMatch === 5) { return Difficulty.NORMAL; }
    if (currentMatch <= 7) { return Difficulty.HARD; }
    if (currentMatch <= 9) { return Difficulty.VERY_HARD; }
    return Difficulty.BLACK_METAL;
}