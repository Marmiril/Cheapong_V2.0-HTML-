const playerPoints = document.getElementById('playerPoints');
const cpuPoints = document.getElementById('cpuPoints');
const matchNumber = document.getElementById('matchNumber');
const difficultyLevel = document.getElementById("difficultyLevel");


if (!playerPoints || !cpuPoints || !matchNumber || !difficultyLevel) { throw new Error("Score elements not found!"); }

export function renderScore(scoreSystem, currentDifficulty) {
    playerPoints.textContent = scoreSystem.getPlayerPoints();
    cpuPoints.textContent = scoreSystem.getCpuPoints();
    matchNumber.textContent = `${scoreSystem.getCurrentMatch()}`;
    difficultyLevel.textContent = currentDifficulty;

}