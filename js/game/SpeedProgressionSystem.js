const HITS_PER_LEVEL = 5;

export class SpeedProgressionSystem {
    constructor() {
        this.playerHits = 0;
        this.speedIncreasePending = false;
    }

    registerPlayerHits() {
        this.playerHits++;

        if (this.playerHits % HITS_PER_LEVEL === 0) {
            this.speedIncreasePending = true;
        }
    }

    playerGetHits() { return this.playerHits; }

    isSpeedIncreasingPending() { return this.speedIncreasePending; }

    clearSpeedIncrease() { this.speedIncreasePending = false; }

    reset() {
        this.playerHits = 0;
        this.speedIncreasePending = false;
    }
}