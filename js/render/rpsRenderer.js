import { RpsChoice, RpsResult } from "../game/rpsSystem.js";
import { clearCanvas, drawCenteredText } from "./gameRenderer.js";

function createRpsImage(fileName) {
    const image = new Image();

    image.src = new URL(
        `../../assets/img/ui/rps/${fileName}`,
        import.meta.url
    ).href;

    return image;
}

const rpsImages = Object.freeze([
    {
        choice: RpsChoice.ROCK,
        image: createRpsImage("rock.png")
    },
    {
        choice: RpsChoice.PAPER,
        image: createRpsImage("paper.png")
    },
    {
        choice: RpsChoice.SCISSORS,
        image: createRpsImage("scissors.png")
    }
]);

export function renderRpsScreen(
    ctx,
    canvasWidth,
    canvasHeight,
    selectedChoice,
    playerChoice,
    cpuChoice,
    result
) {
    clearCanvas(ctx, canvasWidth, canvasHeight);

    drawCenteredText(
        ctx,
        canvasWidth,
        "CHOOSE YOUR MOVE",
        canvasHeight * 0.18,
        32
    );

    const imageSize = 160;
    const gap = 40;

    const totalWidth = imageSize * rpsImages.length +
        gap * (rpsImages.length - 1);

    const startX = (canvasWidth - totalWidth) / 2;
    const imageY = canvasHeight * 0.35;

    ctx.imageSmoothingEnabled = false;

    rpsImages.forEach((rpsImage, index) => {
        if (!rpsImage.image.complete ||
            rpsImage.image.naturalWidth === 0
        ) {
            return;
        }

        const imageX = startX + index * (imageSize + gap);

        ctx.drawImage(
            rpsImage.image,
            imageX,
            imageY,
            imageSize,
            imageSize
        );

        if (rpsImage.choice === selectedChoice) {
            ctx.strokeStyle = "#ffd700";
            ctx.lineWidth = 6;

            ctx.strokeRect(
                imageX - 8,
                imageY - 8,
                imageSize + 16,
                imageSize + 16
            );
        }

        if (result === null) {
            drawCenteredText(
                ctx,
                canvasWidth,
                "ARROWS TO CHOOSE - SPACE TO CONFIRM",
                canvasHeight * 0.78,
                18
            );
            return;
        }
        drawCenteredText(
            ctx,
            canvasWidth,
            `PLAYER: ${playerChoice}`,
            canvasHeight * 0.72,
            22
        );
        drawCenteredText(
            ctx,
            canvasWidth,
            `CPU: ${cpuChoice}`,
            canvasHeight * 0.78,
            22
        );

        const resultMessage = result === RpsResult.DRAW
            ? "DRAW!"
            : `${result} WINS & SERVES!`

        drawCenteredText(
            ctx,
            canvasWidth,
            resultMessage,
            canvasHeight * 0.88,
            28
        );
    });
}