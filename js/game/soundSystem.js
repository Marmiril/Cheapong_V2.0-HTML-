const PADDLE_HIT_SOUNDS = [
    new Audio("assets/sounds/hit00.mp3"),
    new Audio("assets/sounds/hit01.mp3"),
    new Audio("assets/sounds/hit02.mp3")
];

PADDLE_HIT_SOUNDS.forEach((sound) => {
    sound.preload = "auto";
});
export function playPaddleHit() {
    const randomIndex = Math.floor(
        Math.random() * PADDLE_HIT_SOUNDS.length
    );
    const sound = PADDLE_HIT_SOUNDS[randomIndex];
    sound.currentTime = 0;
    sound.play().catch((error) => {
        console.warn("Paddle hit sound could not be played:", error);
    });
}

const POINT_SOUNDS = {
    PLAYER: new Audio("assets/sounds/playerPoint.mp3"),
    CPU: new Audio("assets/sounds/cpuPoint.mp3")
};
export function playPointSound(pointWinner) {
    const sound = POINT_SOUNDS[pointWinner];
    if (!sound) { throw new Error(`Unknown point winner: ${pointWinner}`); }
    sound.currentTime = 0;
    sound.play().catch((error) => {
        console.warn("Point sound could not be played:", error)
    });
}

const MATCH_SOUNDS = {
    PLAYER: new Audio("assets/sounds/winBack.mp3"),
    CPU: new Audio("assets/sounds/loseBack.mp3")
};
export function playMatchSound(matchWinner) {
    const sound = MATCH_SOUNDS[matchWinner];
    if (!sound) { throw new Error(`Unknown match winner: ${matchWinner}`); }
    sound.currentTime = 0;
    sound.play().catch((error) => {
        console.warn("Match sound could not be played:", error);
    });
}

const WALL_COLLISION = new Audio("assets/sounds/wallImpact.wav");
export function playWallCollision() {
    WALL_COLLISION.volume = 0.3;
    WALL_COLLISION.currentTime = 0;
    WALL_COLLISION.play().catch((error) => {
        console.warn("Wallcollision sound could not be played: ", error);
    });
}

const SPEED_UP_SOUND = new Audio("assets/sounds/speedUp.mp3");
export function playSpeedUpSound() {
    SPEED_UP_SOUND.currentTime = 0;

    SPEED_UP_SOUND.play().catch((error) => {
        console.warn("Speed-up sound could not be played:", error);
    });
}

const SELECT_SOUND = new Audio("assets/sounds/selection.wav");
export function playSelection() {
    SELECT_SOUND.currentTime = 0;
    SELECT_SOUND.play().catch((error) => {
        console.warn("SelectionSound could not played: ", error);
    });
}

export function playCpuSelection(mode) {
    SELECT_SOUND.loop = true;
    SELECT_SOUND.currentTime = 0;

    if (mode === "PLAY") {
        SELECT_SOUND.play().catch((error) => {
            console.warn("SELECT_SOUND could not be played:", error);
        });
    }
    if (mode === "STOP") {
        SELECT_SOUND.pause();
    }
}


const RPS_SELECTED = new Audio("assets/sounds/rpsSelected.wav");
export function playRpsSelected() {
    RPS_SELECTED.currentTime = 0;
    RPS_SELECTED.play().catch((error) => {
        console.warn("RpsSelected audio could not played:", error);
    });
}

const DRAW = new Audio("assets/sounds/draw.wav");
export function playDraw() {
    DRAW.currentTime = 0;
    DRAW.play().catch((error) => {
        console.warn("Draw sound could not be played:", error);
    });
}

const RPS_SOUNDS = {
    WIN: new Audio("assets/sounds/rpsWin.wav"),
    LOSE: new Audio("assets/sounds/rpsLose.wav"),
    DRAW: new Audio("assets/sounds/draw.wav")
}
export function playRpsSounds(index) {
    const sound = RPS_SOUNDS[index];
    sound.currentTime = 0;

    sound.play().catch((error) => {
        console.warn("Rps sound could not be played: ", error);
    });

}