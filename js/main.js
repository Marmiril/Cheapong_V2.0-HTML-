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

// Paddle model
import { Paddle } from "./models/Paddle.js";

// Ball model
import { Ball } from "./models/Ball.js";

// Player paddle movement
import { updatePlayerPaddle, updateCpuPaddle } from "./logic/paddleMovementSystem.js";

// Ball movement
import { updateBall, launchPlayerServe, launchCpuServe } from "./logic/ballMovementSystem.js";

// Collision system
import { handleWallCollision, handlePlayerPaddleCollision, handleCpuPaddleCollision } from "./logic/collisionSystem.js";

// Render paddle, ball, clear canvas, draw text & render main menu
import { drawPaddle, drawBall, clearCanvas, drawCenteredText, renderMainMenu } from "./render/gameRenderer.js";

// Server systemimport { updateServe, launchPlayerServe } from "./logic/serveSystem.js";

// AI movement
import { calculateCpuTargetX, calculateCpuServePlan } from "./logic/aiSystem.js";

// ScoreSystem
import { ScoreSystem } from "./game/scoreSystem.js";

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

const scoreSystem = new ScoreSystem(5);

let gameState = GameState.SERVE_PLAYER;

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

// Stores when the CPU serve preparation started
let cpuServeStartTime = null;

/**
 * Renders the initial main menu.
 */

window.addEventListener("keydown", (event) => {
    if (event.code === "Space" && appState === AppState.MAIN_MENU) {
        appState = AppState.IN_GAME;
        gameState = GameState.SERVE_PLAYER;
        return;
    }
    if (event.code === "Space" && appState === AppState.IN_GAME && gameState === GameState.SERVE_PLAYER) { gameState = launchPlayerServe(ball, inputState); }

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
        // Creates the serve plan only once
        if (cpuServePlan === null) {
            cpuServePlan = calculateCpuServePlan(
                ball,
                cpuPaddle,
                playerPaddle,
                canvasWidth,
                BALL_SPEED
            );

            cpuServeStartTime = performance.now();
        }

        // Moves the CPU paddle towards the selected serve position
        updateCpuPaddle(
            cpuPaddle,
            cpuServePlan.cpuTargetX,
            canvasWidth
        );

        // Keeps the ball attached while the CPU paddle is moving
        updateServe(ball, cpuPaddle, gameState);
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
    if (appState === AppState.IN_GAME) { renderGameScreen(); }
}

function handleScore() {
    if (ball.y <= 0) {
        scoreSystem.pointPlayer();
        gameState = GameState.SERVE_CPU;
    }

    if (ball.y + ball.size >= canvas.height) {
        scoreSystem.pointCpu();
        gameState = GameState.SERVE_PLAYER;
    }
}

