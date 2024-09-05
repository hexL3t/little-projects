// Get references to DOM elements
const game = document.getElementById('game1-container');
const character = document.getElementById("game1-character");

// Game state variables
let isJumping = false;
let score = 0;
let blocks = [];
let gameLoop;
let gameStarted = false;
let isGameOver = false;

// Game constants
const BLOCK_SPEED = 3; // Speed in pixels per frame
const JUMP_DURATION = 500; // Jump duration in milliseconds

// Function to create the initial "Click to Start" message
function createStartMessage() {
    const message = document.createElement("div");
    message.id = "start-message";
    message.textContent = "Click to Start";
    game.appendChild(message);
}
// Function to remove the start message
function removeStartMessage() {
    const message = document.getElementById("start-message");
    if (message) {
        game.removeChild(message);
    }
}
// Function to create a new block
function createBlock() {
    const block = document.createElement("div");
    block.classList.add("game1-block");
    block.style.right = "-50px"; // Start off-screen
    game.appendChild(block);
    blocks.push(block);
    return block;
}
// Function to update the character's position
function jump() {
    if (!isJumping && !isGameOver) {
        isJumping = true;
        character.classList.add("jump");
        setTimeout(() => {
            character.classList.remove("jump");
            isJumping = false;
        }, JUMP_DURATION);
    }
}
// Function to check if the character has collided with a block
function checkCollision(block) {
    const characterRect = character.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();

    return (
        blockRect.left < characterRect.right &&
        blockRect.right > characterRect.left &&
        blockRect.top < characterRect.bottom
    );
}

// Function to update the position of a block
function updateBlockPosition(block) {
    if (!isGameOver) {
        const currentRight = parseFloat(block.style.right) || 0;
        block.style.right = `${currentRight + BLOCK_SPEED}px`;
    }
}

// Function to end the game
function endGame() {
    isGameOver = true;
    gameStarted = false;
    cancelAnimationFrame(gameLoop);
    setTimeout(() => {
        alert(`Game Over! Score: ${score}`);
        resetGame();
    }, 50); // Small delay to ensure the final frame is rendered
}

// Function to reset the game
function resetGame() {
    score = 0;
    isGameOver = false;
    blocks.forEach(block => game.removeChild(block));
    blocks = [];
    createStartMessage();
}

// Function to update the score
function updateScore() {
    score++;
    console.log(`Score: ${score}`);
}

// Function to add a new block at a random time
function addRandomBlock() {
    if (gameStarted && !isGameOver) {
        createBlock();
        setTimeout(addRandomBlock, Math.random() * 2000 + 1000); // Random time between 1-3 seconds
    }
}

// Function to start the game
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        isGameOver = false;
        removeStartMessage();
        addRandomBlock(); // Start generating blocks
        gameLoop = requestAnimationFrame(update);
    }
}

// Main game loop
function update() {
    if (!gameStarted || isGameOver) return;

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (checkCollision(block)) {
            endGame();
            return;
        }
        updateBlockPosition(block);

        // Remove block if it's off the screen
        if (parseFloat(block.style.right) > game.clientWidth) {
            game.removeChild(block);
            blocks.splice(i, 1);
            i--;
            updateScore();
        }
    }

    gameLoop = requestAnimationFrame(update);
}

// Event listeners for clicks and key presses
game.addEventListener("click", () => {
    if (!gameStarted) {
        startGame();
    } else {
        jump();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        if (!gameStarted) {
            startGame();
        } else {
            jump();
        }
    }
});

// Initialize the game
createStartMessage();