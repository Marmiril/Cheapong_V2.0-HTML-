export function setBackSystem(matchNumber) {
    const formattedMatch = String(matchNumber).padStart(2, "0");

    return {
        backgroundImage:
            `assets/img/backgrounds/back${formattedMatch}.png`,

        pointGif:
            `assets/img/backgrounds/gif${formattedMatch}.gif`

    };
}