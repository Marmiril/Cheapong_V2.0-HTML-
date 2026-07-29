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
import { updatePlayerPaddle } from "./logic/paddleMovementSystem.js";

// Ball movement
import { updateBall } from "./logic/ballMovementSystem.js";

// Collision system
import { handleWallCollision, handlePlayerPaddleCollision, handleCpuPaddleCollision } from "./logic/collisionSystem.js";

// Render ball & paddle
import { drawPaddle, drawBall } from "./render/gameRenderer.js";



const canvas = document.getElementById("gameCanvas");

if (!canvas) { throw new Error("Canvas element not found"); }

const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Player paddle
const playerPaddle = new Paddle(
    (canvasWidth - 120) / 2,
    canvasHeight - 15 - 20,
    120,
    15,
    5
);

// CPU paddle
const cpuPaddle = new Paddle(
    (canvasWidth - 120) / 2,
    20,
    120,
    15,
    5
);

// Current applicaton state
let appState = AppState.MAIN_MENU;

const score = {
    player: 0,
    cpu: 0
}

let gameState = GameState.SERVE_PLAYER;

// Ball
const ball = new Ball(
    (canvasWidth - 20) / 2,
    (canvasHeight - 20) / 2,
    20,
    3,
    3
);

function clearCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

/**
 * Draws centered text on the canvas.
 *
 * @param {string} text - Text to draw.
 * @param {number} y - Vertical position.
 * @param {number} fontSize - Font size in pixels.
 */
function drawCenteredText(text, y, fontSize = 32) {
    ctx.fillStyle = "white";
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(text, canvasWidth / 2, y);
}

/**
 * Renders the initial main menu.
 */
function renderMainMenu() {
    clearCanvas();
    drawCenteredText("CHEAPONG", canvasHeight * 0.30, 30);
    drawCenteredText("PRESS SPACE TO START", canvasHeight * 0.50, 16);
}

window.addEventListener("keydown", (event) => {
    if (event.code === "Space" && appState === AppState.MAIN_MENU) { appState = AppState.IN_GAME; render(); }
    if (event.code === "Space" && appState === AppState.IN_GAME && gameState === GameState.SERVE_PLAYER) { launchPlayerServe(); }

    if (event.code === "ArrowLeft") { inputState.left = true; }
    if (event.code === "ArrowRight") { inputState.right = true; }
});

window.addEventListener("keyup", (event) => {
    if (event.code === "ArrowLeft") { inputState.left = false; }
    if (event.code === "ArrowRight") { inputState.right = false; }
})

// Game Loop
function gameLoop() {
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();

/**
 * Renders a temporary game screen.
 */
function renderGameScreen() {
    clearCanvas();

    updatePlayerPaddle(playerPaddle, inputState, canvasWidth);

    if (gameState === GameState.SERVE_PLAYER) { updateServe(playerPaddle); }
    if (gameState === GameState.SERVE_CPU) { updateServe(cpuPaddle); }

    if (gameState === GameState.RALLY) {
        updateBall(ball);
        handleWallCollision(ball, canvasWidth, canvasHeight);
        handlePlayerPaddleCollision(ball, playerPaddle);
        handleCpuPaddleCollision(ball, cpuPaddle);
    }

    drawPaddle(ctx, playerPaddle);
    drawPaddle(ctx, cpuPaddle);
    drawBall(ctx, ball);

    drawCenteredText("GAME STARTED", canvasHeight * 0.40, 24);
    drawCenteredText("Cheapong game area", canvasHeight * 0.52, 16);
}

/**
 * Renders the current screen according to the app state.
 */
function render() {
    if (appState === AppState.MAIN_MENU) { renderMainMenu(); }
    if (appState === AppState.IN_GAME) { renderGameScreen(); }
}

function handleScore() {
    if (ball.y <= 0) { score.player++; resetBall(); }
    if (ball.y >= canvas.height) { score.cpu++; resetBall(); }
}

function updateServe(paddle) {
    ball.x = paddle.x + (paddle.width - ball.size) / 2;
    if (gameState === GameState.SERVE_PLAYER) { ball.y = playerPaddle.y - ball.size; }
    if (gameState === GameState.SERVE_CPU) { ball.y = cpuPaddle.y + cpuPaddle.height; }
}

function launchPlayerServe() {
    ball.speedX = 0;
    ball.speedY = -4.5;
    gameState = GameState.RALLY;
}
