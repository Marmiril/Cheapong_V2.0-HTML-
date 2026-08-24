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
import { Difficulty, DIFFICULTY_SETTINGS } from "./core/gameConfig.js";

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

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Player paddle
const playerPaddle = new Paddle(
    (canvasWidth - 80) / 2,
    canvasHeight - 10 - 20,
    80,
    10,
    7
);

// CPU paddle
const cpuPaddle = new Paddle(
    (canvasWidth - 80) / 2,
    20,
    80,
    10,
    7
)

// Current applicaton state
let appState = AppState.MAIN_MENU;

const scoreSystem = new ScoreSystem(2, 1);

let gameState = GameState.SERVE_PLAYER;

let currentDifficulty = Difficulty.EASY;

// Ball
const ball = new Ball(
    (canvasWidth - 12) / 2,
    (canvasHeight - 12) / 2,
    15,
    5,
    5
);

// Normalize ballSpeed
const BALL_SPEED = Math.sqrt(ball.speedX ** 2 + ball.speedY ** 2);

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
        renderScore(scoreSystem);
        resetPaddles();

        gameState = GameState.SERVE_PLAYER;
        appState = AppState.MAIN_MENU;

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
    updatePlayerPaddle(playerPaddle, inputState, canvasWidth);

    if (gameState === GameState.SERVE_PLAYER) { updateServe(ball, playerPaddle, gameState); }

    if (gameState === GameState.SERVE_CPU) {

        if (cpuServeStartTime === null) {
            cpuServeStartTime = performance.now();
            cpuServePlanRank = Math.floor(Math.random() * 3);
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
        const cpuTargetX = calculateCpuTargetX(cpuPaddle, ball, canvasWidth, canvasHeight);

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
        renderScore(scoreSystem);
    }
}

function handleScore() {
    if (ball.y <= 0) {
        scoreSystem.pointPlayer();

        if (scoreSystem.isMatchEnded()) {
            scoreSystem.startNextMatch();
        }

        if (scoreSystem.isGameEnded()) {
            gameState = GameState.GAME_OVER;
            resetPaddles();
            return;
        }

        gameState = GameState.SERVE_CPU;
        resetPaddles();
    }

    if (ball.y + ball.size >= canvas.height) {
        scoreSystem.pointCpu();

        if (scoreSystem.isGameEnded()) {
            gameState = GameState.GAME_OVER;
            resetPaddles();
            return;
        }

        gameState = GameState.SERVE_PLAYER;
        resetPaddles();
    }
}

function resetPaddles() {
    playerPaddle.x = (canvasWidth - playerPaddle.width) / 2;
    playerPaddle.prevX = playerPaddle.x;

    cpuPaddle.x = (canvasWidth - cpuPaddle.width) / 2;
    cpuPaddle.prevX = cpuPaddle.x;
}

