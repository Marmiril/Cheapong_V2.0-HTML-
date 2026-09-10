
export const GAME_SETTINGS = {
    canvasWidth: 800,
    canvasHeight: 600,
    paddleWidth: 90,
    paddleHeight: 18,
    paddleSpeed: 7,
    ballSize: 15,
    ballSpeed: Math.sqrt(6 ** 2 + 6 ** 2),
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

    /*
     * CPU DIFFICULTY SETTINGS
     * phases - the vertical positions where cpu recalculates the incoming trajectory. Higher is earlier
     *          More phases more oportunities
     * trackingPhases - defines the positions where cpu updates its target while the ball is moving away.
     *                  Usefull only in "TRACK" returnMode. More trackphases improve preparation for next return
     * maxErroFactor - Controls the maximun aiming error added to the predicted target.
     *                 Higher values make the cpu less accurate.
     * maxDrift - adds independent random horizontal offset to the calculated target
     *            Higher values produce greater random deviation
     * reactionTime - Time in miliseconds before the CPU starts reacting to an incoming ball
     *                Higher values produce slower reactions
     * missPhaseChance - probability of completly ignoring a decision phase.
     *                   0.00 never misses, 1.00 always misses it.
     * returnMode - behaviour of cpuPaddle after returning a ball while moving toward the player.
     *              
     * servePlanks - Defines which ranked CPU serve plans may be selected
     *               Rank 0 is the strongest calculated plan, higher ranks represents progressively weaker plans.
     * hitEffectRanks - defines which ranked return effects may be selected after the CPU hit
     *                  0 is the strongest calculated response, higher represent progressibley weaker responses.
    */


    [Difficulty.FANCY]: {
        phases: [0.90, 0.75, 0.50, 0.25, 0.10],
        trackingPhases: [],
        maxErrorFactor: 1.50,
        maxDrift: 0.95,
        reactionTime: 500,
        missPhaseChance: 0.30,
        returnMode: "STAY",
        servePlanRanks: [3, 4, 5],
        hitEffectRanks: [3, 4]
    },

    [Difficulty.VERY_EASY]: {
        phases: [0.90, 0.75, 0.50, 0.25, 0.10],
        trackingPhases: [],
        maxErrorFactor: 1.30,
        maxDrift: 0.80,
        reactionTime: 475,
        missPhaseChance: 0.25,
        returnMode: "STAY",
        servePlanRanks: [3, 4],
        hitEffectRanks: [2, 3, 4]
    },

    [Difficulty.EASY]: {
        phases: [0.90, 0.75, 0.50, 0.25, 0.10],
        trackingPhases: [],
        maxErrorFactor: 1.10,
        maxDrift: 0.65,
        reactionTime: 400,
        missPhaseChance: 0.20,
        returnMode: "CENTER",
        servePlanRanks: [2, 3, 4],
        hitEffectRanks: [2, 3]
    },

    [Difficulty.VERY_NORMAL]: {
        phases: [0.90, 0.75, 0.50, 0.25, 0.10],
        trackingPhases: [],
        maxErrorFactor: 1.00,
        maxDrift: 0.50,
        reactionTime: 325,
        missPhaseChance: 0.15,
        returnMode: "CENTER",
        servePlanRanks: [2, 3],
        hitEffectRanks: [1, 2, 3]
    },

    [Difficulty.NORMAL]: {
        phases: [0.90, 0.75, 0.50, 0.25, 0.10],
        trackingPhases: [],
        maxErrorFactor: 0.90,
        maxDrift: 0.38,
        reactionTime: 275,
        missPhaseChance: 0.10,
        returnMode: "CENTER",
        servePlanRanks: [1, 2, 3],
        hitEffectRanks: [1, 2]
    },

    [Difficulty.HARD]: {
        phases: [0.90, 0.75, 0.50, 0.25, 0.10],
        trackingPhases: [],
        maxErrorFactor: 0.80,
        maxDrift: 0.28,
        reactionTime: 250,
        missPhaseChance: 0.10,
        returnMode: "CENTER",
        servePlanRanks: [1, 2],
        hitEffectRanks: [0, 1, 2]
    },

    [Difficulty.VERY_HARD]: {
        phases: [0.90, 0.75, 0.50, 0.25, 0.10],
        trackingPhases: [0.50],
        maxErrorFactor: 0.70,
        maxDrift: 0.20,
        reactionTime: 225,
        missPhaseChance: 0.10,
        returnMode: "TRACK",
        servePlanRanks: [0, 1, 2],
        hitEffectRanks: [0, 1]
    },

    [Difficulty.BLACK_METAL]: {
        phases: [0.90, 0.75, 0.50, 0.25, 0.10],
        trackingPhases: [0.25, 0.50, 0.75],
        maxErrorFactor: 0.50,
        maxDrift: 0.14,
        reactionTime: 200,
        missPhaseChance: 0.05,
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