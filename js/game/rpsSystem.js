export const RpsChoice = Object.freeze({
    ROCK: "ROCK",
    PAPER: "PAPER",
    SCISSORS: "SCISSORS"
});

export const RpsResult = Object.freeze({
    PLAYER: "PLAYER",
    CPU: "CPU",
    DRAW: "DRAW"
});

export const RPS_CHOICES = Object.freeze([
    RpsChoice.ROCK,
    RpsChoice.PAPER,
    RpsChoice.SCISSORS

]);

export function determineRpsWinner(playerChoice, cpuChoice) {

    const playerIndex = RPS_CHOICES.indexOf(playerChoice);
    const cpuIndex = RPS_CHOICES.indexOf(cpuChoice);

    const result =
        (playerIndex - cpuIndex + RPS_CHOICES.length) %
        RPS_CHOICES.length;

    if (result === 0) { return RpsResult.DRAW; }

    return result === 1
        ? RpsResult.PLAYER
        : RpsResult.CPU
}

export function getRandomCpuChoice() {
    const randomIndex = Math.floor(Math.random() * RPS_CHOICES.length);

    return RPS_CHOICES[randomIndex];
}


