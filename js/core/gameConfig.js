export const Difficulty = {
    EASY: "EASY",
    NORMAL: "NORMAL",
    HARD: "HARD"
}

export const DIFFICULTY_SETTINGS = {

    [Difficulty.EASY]: {
        phases: [0.50, 0.10],
        maxErrorFactor: 0.40,
        maxDrift: 0.12,
        returnMode: "STAY",
        servePlanRanks: [3, 4, 5]
    },
    [Difficulty.NORMAL]: {
        phases: [0.50, 0.25, 0.10],
        maxErrorFactor: 0.25,
        maxDrift: 0.08,
        returnMode: "CENTER",
        servePlanRanks: [1, 2, 3]
    },

    [Difficulty.HARD]: {
        phases: [0.90, 0.75, 0.50, 0.25, 0.10],
        maxErrorFactor: 0.15,
        maxDrift: 0.05,
        returnMode: "TRACK",
        servePlanRanks: [0, 1]
    }
};