const playerPoints = document.getElementById('playerPoints');
const cpuPoints = document.getElementById('cpuPoints');
const matchNumber = document.getElementById('matchNumber');

if (!playerPoints || !cpuPoints || !matchNumber) { throw new Error("Score elements not found!"); }

export function renderScore(scoreSystem) {
    playerPoints.textContent = scoreSystem.getPlayerPoints();
    cpuPoints.textContent = scoreSystem.getCpuPoints();
    matchNumber.textContent =
        `${scoreSystem.getCurrentMatch()}`;
}