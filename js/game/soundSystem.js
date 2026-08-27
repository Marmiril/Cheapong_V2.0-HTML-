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
        console.warn("Paddle hit sound could not be played!:", error);
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
        console.warn("Point sound could not be played!")
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
        console.warn("Match sound could not be played!");
    });
}
