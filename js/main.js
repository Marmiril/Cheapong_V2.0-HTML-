/**
 * Cheapong - Main entry point
 * 
 * - get canvas
 * - get 2D context
 * - draw initial screen
 */

// Basic application states
import { AppState } from "./states/appState.js";

// Basic game states
import { GameState } from "./states/gameState.js";

// Input state
import { inputState } from "./input/inputState.js";

// Difficulty settings
import { Difficulty, DIFFICULTY_SETTINGS, getDifficultyByMatch, GAME_SETTINGS } from "./core/gameConfig.js";

// Paddle model
import { Paddle } from "./models/Paddle.js";

// Ball model
import { Ball } from "./models/Ball.js";

// Player paddle movement
import { updatePlayerPaddle, updateCpuPaddle } from "./logic/paddleMovementSystem.js";

// Ball movement
import { updateBall } from "./logic/ballMovementSystem.js";

// Server system
import { updateServe, launchPlayerServe, launchCpuServe } from "./logic/serveSystem.js";

// Collision system
import { handleWallCollision, handlePlayerPaddleCollision, handleCpuPaddleCollision } from "./logic/collisionSystem.js";

// Render paddle, ball, clear canvas, draw text & render main menu
import { drawPaddle, drawBall, clearCanvas, drawCenteredText, renderMainMenu } from "./render/gameRenderer.js";

// AI movement
import { calculateCpuTargetX, calculateCpuServePlan } from "./logic/aiSystem.js";

// ScoreSystem
import { ScoreSystem } from "./game/scoreSystem.js";

// Score renderer
import { renderScore } from "./render/scoreRenderer.js";

// RPS renderer
import { renderRpsScreen } from "./render/rpsRenderer.js";

// Rock-paper-scissors system
import { RPS_CHOICES, determineRpsWinner, getRandomCpuChoice, RpsResult } from "./game/rpsSystem.js";

// Sounds
import {
    playPointSound, playMatchSound, playSpeedUpSound, playSelection,
    playRpsSelected, playCpuSelection, playRpsSounds, playStart,
    playServe,
    playGameWin
} from "./game/soundSystem.js";

// Speed progression system
import { SpeedProgressionSystem } from "./game/SpeedProgressionSystem.js";

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

const canvas = document.getElementById("gameCanvas");

if (!canvas) { throw new Error("Canvas element not found"); }

const ctx = canvas.getContext("2d");

const canvasWidth = GAME_SETTINGS.canvasWidth;
const canvasHeight = GAME_SETTINGS.canvasHeight;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Currently selected RPS option
let selectedRpsIndex = 0;

// Stores the confirmed RPS choices and result
let playerRpsChoice = null;
let cpuRpsChoice = null;
let rpsResult = null;

// CPU animations settings
const CPU_RPS_SWEEP_DURATION = 2000;
const CPU_RPS_SWEEP_INTERVAL = 100;

// CPU selection animations state
let cpuRpsSweepStartTime = null;
let cpuRpsDisplayIndex = 0;

// Player paddle
const playerPaddle = new Paddle(
    (canvasWidth - GAME_SETTINGS.paddleWidth) / 2,
    canvasHeight - GAME_SETTINGS.paddleHeight - 20,
    GAME_SETTINGS.paddleWidth,
    GAME_SETTINGS.paddleHeight,
    GAME_SETTINGS.paddleSpeed
);

// CPU paddle
const cpuPaddle = new Paddle(
    (canvasWidth - GAME_SETTINGS.paddleWidth) / 2,
    20,
    GAME_SETTINGS.paddleWidth,
    GAME_SETTINGS.paddleHeight,
    GAME_SETTINGS.paddleSpeed
);

// Ball
const ball = new Ball(
    (canvasWidth - GAME_SETTINGS.ballSize) / 2,
    (canvasHeight - GAME_SETTINGS.ballSize) / 2,
    GAME_SETTINGS.ballSize,
    0,
    0
);

// Normalize ballSpeed  
//const currentBallSpeed = GAME_SETTINGS.ballSpeed;
let currentBallSpeed = GAME_SETTINGS.ballSpeed;

// Current applicaton state
let appState = AppState.MAIN_MENU;

const scoreSystem = new ScoreSystem(2, 10);

const speedProgressionSystem = new SpeedProgressionSystem();

let gameState = GameState.RPS;

let currentDifficulty = Difficulty.EASY;

// Stores who scored the last point
let pointWinner = null;

// Stores when the point message must disappear
let pointMessageEndTime = null;

// Stores which player serves after the pause
let nextServeState = null;

// Time avaliable for the CPU to prepare its serve
const CPU_SERVE_DELAY = 600;

// Stores the position and effect selected for the current CPU serve
let cpuServePlan = null;

// Randomize several plans
let cpuServePlanRank = null;

// Stores when the CPU serve preparation started
let cpuServeStartTime = null;

/**
 * Renders the initial main menu.
 */

window.addEventListener("keydown", (event) => {
    if (event.code === "Space" &&
        appState === AppState.MAIN_MENU
    ) {
        appState = AppState.IN_GAME;
        playStart();
        gameState = GameState.RPS;
        return;
    }
    if (event.code === "Space" &&
        appState === AppState.IN_GAME &&
        gameState === GameState.SERVE_PLAYER
    ) {
        gameState = launchPlayerServe(ball, inputState, currentBallSpeed);
        playServe();
    }

    if (event.code === "Space" &&
        appState === AppState.IN_GAME &&
        gameState === GameState.GAME_OVER
    ) {
        scoreSystem.resetGame();

        currentDifficulty = getDifficultyByMatch(scoreSystem.getCurrentMatch());

        renderScore(scoreSystem, currentDifficulty);
        resetPaddles();

        gameState = GameState.SERVE_PLAYER;
        appState = AppState.MAIN_MENU;

        return;
    }

    if (event.code === "Space" &&
        appState === AppState.IN_GAME &&
        gameState === GameState.MATCH_OVER
    ) {
        const nextMatchStarted = scoreSystem.startNextMatch();

        if (nextMatchStarted) {
            currentDifficulty = getDifficultyByMatch(scoreSystem.getCurrentMatch());
            resetPaddles();
            gameState = GameState.RPS;
        }
        return;
    }


    if (appState === AppState.IN_GAME &&
        gameState === GameState.RPS
    ) {
        if (event.repeat || cpuRpsSweepStartTime !== null) { return; }


        if (rpsResult === RpsResult.DRAW) {
            if (event.code === "Space") {
                resetRpsRound();
            }
            return;
        }

        if (rpsResult !== null) {

            if (
                event.code === "Space" &&
                nextServeState !== null
            ) {
                gameState = nextServeState;

                resetPaddles();
                resetRpsRound();

                nextServeState = null;
            }

            return;
        }

        if (event.code === "ArrowLeft") {
            playSelection();
            selectedRpsIndex = (
                selectedRpsIndex -
                1 +
                RPS_CHOICES.length
            ) % RPS_CHOICES.length;
        }

        if (event.code === "ArrowRight") {
            playSelection();
            selectedRpsIndex =
                (selectedRpsIndex + 1) % RPS_CHOICES.length;
        }

        if (event.code === "Space") {
            playerRpsChoice = RPS_CHOICES[selectedRpsIndex];
            playRpsSelected()
            cpuRpsChoice = getRandomCpuChoice();
            cpuRpsDisplayIndex = 0;
            cpuRpsSweepStartTime = performance.now();
            playCpuSelection("PLAY");
        }
        return;
    }

    if (event.code === "ArrowLeft") { inputState.left = true; }
    if (event.code === "ArrowRight") { inputState.right = true; }
    if (event.code === "ArrowUp") { inputState.up = true; }
    if (event.code === "ArrowDown") { inputState.down = true; }
});

window.addEventListener("keyup", (event) => {
    if (event.code === "ArrowLeft") { inputState.left = false; }
    if (event.code === "ArrowRight") { inputState.right = false; }
    if (event.code === "ArrowUp") { inputState.up = false; }
    if (event.code === "ArrowDown") { inputState.down = false; }
});


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

// Game Loop
function gameLoop() {
    updateGame();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();

function updateGame() {

    if (gameState === GameState.POINT_OVER) {
        if (performance.now() >= pointMessageEndTime) {
            gameState = nextServeState;

            pointWinner = null;
            pointMessageEndTime = null;
            nextServeState = null;
        }
        return;
    }
    if (gameState === GameState.RPS) {
        if (cpuRpsSweepStartTime === null) { return; }

        const elapsedTime = performance.now() - cpuRpsSweepStartTime;

        if (elapsedTime < CPU_RPS_SWEEP_DURATION) {
            cpuRpsDisplayIndex = Math.floor(
                elapsedTime / CPU_RPS_SWEEP_INTERVAL
            ) % RPS_CHOICES.length;
            return;
        }

        cpuRpsDisplayIndex = RPS_CHOICES.indexOf(cpuRpsChoice);

        rpsResult = determineRpsWinner(
            playerRpsChoice,
            cpuRpsChoice
        );

        nextServeState = null;

        if (rpsResult === RpsResult.PLAYER) { nextServeState = GameState.SERVE_PLAYER; }
        if (rpsResult === RpsResult.CPU) { nextServeState = GameState.SERVE_CPU; }

        cpuRpsSweepStartTime = null;
        playCpuSelection("STOP");
        playRpsSounds(rpsResult);
        return;
    }

    if (gameState === GameState.RPS ||
        gameState === GameState.MATCH_OVER ||
        gameState === GameState.GAME_OVER
    ) { return; }

    updatePlayerPaddle(playerPaddle, inputState, canvasWidth);


    //  updatePlayerPaddle(playerPaddle, inputState, canvasWidth);

    if (gameState === GameState.SERVE_PLAYER) { updateServe(ball, playerPaddle, gameState); }

    if (gameState === GameState.SERVE_CPU) {

        if (cpuServeStartTime === null) {
            cpuServeStartTime = performance.now();
            const servePlanRanks = DIFFICULTY_SETTINGS[currentDifficulty].servePlanRanks;

            cpuServePlanRank = servePlanRanks[Math.floor(Math.random() * servePlanRanks.length)];
        }

        const elapsedTime = performance.now() - cpuServeStartTime;
        const isTimerFinished = elapsedTime >= CPU_SERVE_DELAY;

        if (!isTimerFinished) {
            cpuServePlan = calculateCpuServePlan(
                ball,
                cpuPaddle,
                playerPaddle,
                canvasWidth,
                currentBallSpeed,
                cpuServePlanRank
            );
        }

        // Moves the CPU paddle towards the selected serve position
        updateCpuPaddle(
            cpuPaddle,
            cpuServePlan.targetX,
            canvasWidth
        );

        // Keeps the ball attached while the CPU paddle is moving
        updateServe(ball, cpuPaddle, gameState);

        const isAtTarget = cpuPaddle.x === cpuServePlan.targetX;

        if (isTimerFinished && isAtTarget) {
            gameState = launchCpuServe(
                ball,
                cpuServePlan.effect,
                currentBallSpeed
            );
            playServe();
            // Resets the preparation data fot the next CPU serve
            cpuServePlan = null;
            cpuServeStartTime = null;
            cpuServePlanRank = null;
        }
    }

    if (gameState === GameState.RALLY) {
        const cpuTargetX = calculateCpuTargetX(cpuPaddle, ball, canvasWidth, canvasHeight, DIFFICULTY_SETTINGS[currentDifficulty]);

        updateCpuPaddle(cpuPaddle, cpuTargetX, canvasWidth);
        updateBall(ball);
        handleWallCollision(ball, canvasWidth, canvasHeight);
        const playerHit = handlePlayerPaddleCollision(ball, playerPaddle, inputState, currentBallSpeed);

        if (playerHit) {
            speedProgressionSystem.registerPlayerHits();
            if (speedProgressionSystem.isSpeedIncreasingPending()) {
                increaseGameSpeed();
                playSpeedUpSound();
            }
        }

        handleCpuPaddleCollision(ball, cpuPaddle, playerPaddle, canvasWidth, currentBallSpeed);

        handleScore();
    }
}

/**
 * Renders a temporary game screen.
 */
function renderGameScreen() {
    clearCanvas(ctx, canvasWidth, canvasHeight);


    drawPaddle(ctx, playerPaddle);
    drawPaddle(ctx, cpuPaddle);
    drawBall(ctx, ball);

    if (gameState === GameState.POINT_OVER) {
        const message = pointWinner === "PLAYER"
            ? "PLAYER SCORES"
            : "CPU SCORES"

        drawCenteredText(
            ctx,
            canvasWidth,
            message,
            canvasHeight * 0.50,
            32
        );
    }

    if (gameState === GameState.MATCH_OVER) {
        drawCenteredText(
            ctx,
            canvasWidth,
            "PLAYER WINS THE MATCH!",
            canvasHeight * 0.45,
            32
        );

        drawCenteredText(
            ctx,
            canvasWidth,
            "PRESS SPACE FOR NEXT MATCH",
            canvasHeight * 0.55,
            32
        );
    }

    if (gameState === GameState.GAME_OVER) {

        const message = scoreSystem.winner === "CPU"
            ? "CPU-WINS - PLAYER CRIES - GAME OVER"
            : "MIGHTY PLAYER WINS GAME COMPLETED EPICFULLY!!!"

        drawCenteredText(
            ctx,
            canvasWidth,
            message,
            canvas.height * 0.50,
            32
        );
    }

    // drawCenteredText(ctx, canvasWidth, "GAME STARTED", canvasHeight * 0.40, 24);
    // drawCenteredText(ctx, canvasWidth, "Cheapong game area", canvasHeight * 0.52, 16);
}


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

/**
 * Renders the current screen according to the app state.
 */
function render() {
    if (appState === AppState.MAIN_MENU) { renderMainMenu(ctx, canvasWidth, canvasHeight); }
    if (appState === AppState.IN_GAME) {

        if (gameState === GameState.RPS) {

            const displayedCpuChoice =
                cpuRpsSweepStartTime !== null
                    ? RPS_CHOICES[cpuRpsDisplayIndex]
                    : cpuRpsChoice;

            renderRpsScreen(
                ctx,
                canvasWidth,
                canvasHeight,
                RPS_CHOICES[selectedRpsIndex],
                playerRpsChoice,
                displayedCpuChoice,
                rpsResult,
                scoreSystem.getCurrentMatch()
            );
        } else {
            renderGameScreen();
        }
        renderScore(scoreSystem, currentDifficulty);
    }
}

function increaseGameSpeed() {

    speedProgressionSystem.clearSpeedIncrease();

    const previousBallSpeed = currentBallSpeed;

    currentBallSpeed = Math.min(
        currentBallSpeed * GAME_SETTINGS.speedIncreaseFactor,
        GAME_SETTINGS.maxBallSpeed
    );

    const ballSpeedFactor = currentBallSpeed / previousBallSpeed;

    ball.speedX *= ballSpeedFactor;
    ball.speedY *= ballSpeedFactor;

    playerPaddle.speed = Math.min(
        playerPaddle.speed * GAME_SETTINGS.speedIncreaseFactor,
        GAME_SETTINGS.maxPaddleSpeed
    );

    cpuPaddle.speed = Math.min(
        cpuPaddle.speed * GAME_SETTINGS.speedIncreaseFactor,
        GAME_SETTINGS.maxPaddleSpeed
    );

}

function handleScore() {
    if (ball.y <= 0) {
        scoreSystem.pointPlayer();
        resetGameSpeed();
        playPointSound("PLAYER");

        if (scoreSystem.isGameEnded()) {
            //  const nextMatchStarted = scoreSystem.startNextMatch();
            gameState = GameState.GAME_OVER;
            playGameWin();
            resetPaddles();
            return;
        }

        if (scoreSystem.isMatchEnded()) {
            // currentDifficulty = getDifficultyByMatch(scoreSystem.getCurrentMatch());
            if (scoreSystem.getCurrentMatch() !== 10) {
                playMatchSound("PLAYER");
            }
            gameState = GameState.MATCH_OVER;
            resetPaddles();
            return;
        }

        startPointPause("PLAYER", GameState.SERVE_CPU);
        return;
    }

    if (ball.y + ball.size >= canvasHeight) {
        scoreSystem.pointCpu();
        resetGameSpeed();
        playPointSound("CPU");

        if (scoreSystem.isGameEnded()) {
            playMatchSound("CPU");
            gameState = GameState.GAME_OVER;
            resetPaddles();
            return;
        }

        startPointPause("CPU", GameState.SERVE_PLAYER);
    }
}

function startPointPause(winner, serveState) {
    pointWinner = winner;

    pointMessageEndTime = performance.now() + GAME_SETTINGS.pointMessageDuration;

    nextServeState = serveState;
    gameState = GameState.POINT_OVER;
    resetPaddles();
}

function resetPaddles() {
    playerPaddle.x = (canvasWidth - playerPaddle.width) / 2;
    playerPaddle.prevX = playerPaddle.x;

    cpuPaddle.x = (canvasWidth - cpuPaddle.width) / 2;
    cpuPaddle.prevX = cpuPaddle.x;
}

function resetRpsRound() {
    playerRpsChoice = null;
    cpuRpsChoice = null;
    rpsResult = null;
}

function resetGameSpeed() {
    currentBallSpeed = GAME_SETTINGS.ballSpeed;

    ball.speedX = 0;
    ball.speedY = 0;
    playerPaddle.speed = GAME_SETTINGS.paddleSpeed;
    cpuPaddle.speed = GAME_SETTINGS.paddleSpeed;

    speedProgressionSystem.reset();
}