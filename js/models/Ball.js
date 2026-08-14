export class Ball {
    constructor(x, y, size, speedX, speedY) {
        this.x = x;
        this.y = y;

        this.prevX = x;
        this.prevY = y;

        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    savePreviousPosition() {
        this.prevX = this.x;
        this.prevY = this.y;
    }
}