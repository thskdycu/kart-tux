const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const kartImage = new Image();
kartImage.src = 'images/kart_tux.png';
const tuxImage = new Image();
tuxImage.src = 'images/tux.png';
const backgroundImage = new Image();
backgroundImage.src = 'images/race_track.png';

// Game constants
const speedKart = 280;
const speedTux = 40;
let tuxMode = false;

let lastTime = 0;

// Character class
class Character {
    constructor(kartTexture, tuxTexture, initialSpeed) {
        this.sprite = new Image();
        this.sprite.src = kartTexture;
        this.x = 300;
        this.y = 300;
        this.speed = initialSpeed;
        this.isTux = false;
    }

    switchToTux() {
        this.isTux = true;
        this.speed = speedTux;
        this.sprite.src = tuxImage.src;
    }

    switchToKart() {
        this.isTux = false;
        this.speed = speedKart;
        this.sprite.src = kartImage.src;
    }

    move(deltaTime) {
        const moveSpeed = this.speed * deltaTime;
        if (keys['ArrowUp']) this.y -= moveSpeed;
        if (keys['ArrowDown']) this.y += moveSpeed;
        if (keys['ArrowLeft']) this.x -= moveSpeed;
        if (keys['ArrowRight']) this.x += moveSpeed;
    }

    draw() {
        ctx.drawImage(this.sprite, this.x, this.y, this.sprite.width * 0.3, this.sprite.height * 0.3);
    }
}

// Background class
class Background {
    constructor(image) {
        this.image = image;
    }

    draw() {
        ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
    }
}

// Game class
class Game {
    constructor() {
        this.background = new Background(backgroundImage);
        this.character = new Character(kartImage.src, tuxImage.src, speedKart);
        this.font = '21px Arial';
        this.text = 'Press SPACE to change to normal tux';
    }

    processEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                tuxMode = !tuxMode;
                if (tuxMode) this.character.switchToTux();
                else this.character.switchToKart();
            }
        });
    }

    update(deltaTime) {
        this.character.move(deltaTime);
    }

    render() {
        this.background.draw();
        this.character.draw();
        ctx.fillStyle = 'blue';
        ctx.font = this.font;
        ctx.fillText(this.text, 100, 50);
    }

    run() {
        let previousTime = 0;
        const gameLoop = (currentTime) => {
            const deltaTime = (currentTime - previousTime) / 1000;
            previousTime = currentTime;

            this.update(deltaTime);
            this.render();

            requestAnimationFrame(gameLoop);
        };
        requestAnimationFrame(gameLoop);
    }
}

// Global keyboard state (use an object to track keys)
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

const game = new Game();
game.processEvents();
game.run();