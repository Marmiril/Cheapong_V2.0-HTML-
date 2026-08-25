5/**
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
const BALL_SPEED = GAME_SETTINGS.ballSpeed;

// Current applicaton state
let appState = AppState.MAIN_MENU;

const scoreSystem = new ScoreSystem(2, 10);

let gameState = GameState.SERVE_PLAYER;

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
        gameState = GameState.SERVE_PLAYER;
        return;
    }
    if (event.code === "Space" &&
        appState === AppState.IN_GAME &&
        gameState === GameState.SERVE_PLAYER
    ) {
        gameState = launchPlayerServe(ball, inputState, BALL_SPEED);
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
            gameState = GameState.SERVE_CPU;
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

    if (gameState === GameState.MATCH_OVER ||
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
                BALL_SPEED,
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
                BALL_SPEED
            );
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
        handlePlayerPaddleCollision(ball, playerPaddle, inputState, BALL_SPEED);
        handleCpuPaddleCollision(ball, cpuPaddle, playerPaddle, canvasWidth, BALL_SPEED);

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
        )
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
        renderGameScreen();
        renderScore(scoreSystem, currentDifficulty);
    }
}

function handleScore() {
    if (ball.y <= 0) {
        scoreSystem.pointPlayer();

        if (scoreSystem.isMatchEnded()) {
            //  const nextMatchStarted = scoreSystem.startNextMatch();
            gameState = GameState.GAME_OVER;
            resetPaddles();
            return;
        }

        if (scoreSystem.isMatchEnded()) {
            // currentDifficulty = getDifficultyByMatch(scoreSystem.getCurrentMatch());
            gameState = GameState.MATCH_OVER;
            resetPaddles();
            return;
        }

        startPointPause("PLAYER", GameState.SERVE_CPU);
        return;
    }

    if (ball.y + ball.size >= canvasHeight) {
        scoreSystem.pointCpu();

        if (scoreSystem.isGameEnded()) {
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

