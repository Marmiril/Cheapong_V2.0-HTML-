export class ScoreSystem {
    constructor(maxPoints = 5, maxMatches = 10) {
        this.maxPoints = maxPoints;
        this.maxMatches = maxMatches;
        this.currentMatch = 1;

        this.playerPoints = 0;
        this.cpuPoints = 0;

        this.matchEnded = false;
        this.winner = null;
    }

    pointPlayer() {
        if (this.matchEnded) { return; }
        this.playerPoints++;
        if (this.playerPoints >= this.maxPoints) {
            this.matchEnded = true;
            this.winner = "PLAYER";
        }
    }

    pointCpu() {
        if (this.matchEnded) { return; }
        this.cpuPoints++;
        if (this.cpuPoints >= this.maxPoints) {
            this.matchEnded = true;
            this.winner = "CPU";
        }
    }

    resetMatch() {
        this.playerPoints = 0;
        this.cpuPoints = 0;

        this.matchEnded = false;
        this.winner = null;
    }

    resetGame() {
        this.resetMatch();
        this.currentMatch = 1;
    }

    startNextMatch() {
        if (!this.matchEnded || this.currentMatch >= this.maxMatches || this.winner !== "PLAYER") { return false; }

        this.currentMatch++;
        this.resetMatch();

        return true;
    }

    getPlayerPoints() { return this.playerPoints; }
    getCpuPoints() { return this.cpuPoints; }
    getCurrentMatch() { return this.currentMatch; }
    getMaxMatches() { return this.maxMatches; }

    isMatchEnded() { return this.matchEnded; }
    isGameEnded() {
        const cpuWon = this.matchEnded && this.winner === "CPU";

        const playerWon =
            this.matchEnded &&
            this.winner === "PLAYER" &&
            this.currentMatch === this.maxMatches;

        return cpuWon || playerWon;
    }




}