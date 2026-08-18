export class ScoreSystem {
    constructor(maxPoints = 5) {
        this.maxPoints = maxPoints;
        
        this.playerPoints = playerPoints;
        this.cpuPoints = cpuPoints;

        this.matchEnded = false;
        this.winner = null;
    }  

    pointPlayer() {
        if (this.matchEnded) {
            return;
        }
        
        this.playerPoints++;

        if (this.playerPoints >= this.maxPoints) {
            this.matchEnded = true;
            this.winner = "PLAYER";
        }
    }

    pointCpu() {
        if (this.matchEnded) {
            return;
        }

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

    getPlayerPoints() { return this.playerPoints; }
    getCpuPoints() { return this.cpuPoints; }
    isMatchEnded() { return this.matchEnded; }

    
     
 
}