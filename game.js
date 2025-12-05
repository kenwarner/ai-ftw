// Game configuration
const TIME_LIMIT = 4.67; // max seconds to press space (too late)
const MIN_TIME = 4.40; // min seconds before pressing (too early)

// DOM elements
const screens = {
    pregame: document.getElementById('pregame-screen'),
    playing: document.getElementById('playing-screen'),
    lose: document.getElementById('lose-screen')
};

const video = document.getElementById('game-video');

// Game state
let currentScreen = 'pregame';
let gameActive = false;
let startTime = 0;
let timerInterval = null;
let playerWon = false;
let gameover = false;

// Show a specific screen
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
    currentScreen = screenName;
}

// Start the game
function startGame() {
    gameActive = true;
    playerWon = false;
    gameover = false;
    startTime = Date.now();
    
    // Show playing screen
    showScreen('playing');
    
    // Start video
    video.currentTime = 0;
    video.play().catch(e => console.log('Video play error:', e));
    
    // Start countdown timer
    timerInterval = setInterval(updateTimer, 50);
}

// Update the timer
function updateTimer() {
    if (!gameActive) return;
    
    const elapsed = (Date.now() - startTime) / 1000;
    const remaining = Math.max(0, TIME_LIMIT - elapsed);
    
    // Time's up - player loses
    if (remaining <= 0) {
        gameActive = false;
        clearInterval(timerInterval);
        gameover = true;
        video.pause();
        showScreen('lose');
    }
}

// Player pressed space - check if in the correct time window
function handlePlayerInput() {
    if (!gameActive) return;
    
    const elapsed = (Date.now() - startTime) / 1000;
    
    // Too early - player loses
    if (elapsed < MIN_TIME) {
        gameActive = false;
        clearInterval(timerInterval);
        gameover = true;
        video.pause();
        showScreen('lose');
        return;
    }
    
    // In the correct window - player wins
    gameActive = false;
    clearInterval(timerInterval);
    playerWon = true;
    // Video will continue playing, onended handler will show pregame
}

// When video ends
video.addEventListener('ended', () => {
    if (playerWon && !gameover) {
        showScreen('pregame');
        playerWon = false;
    }
});

// Reset to pregame
function resetGame() {
    showScreen('pregame');
}

// Handle spacebar press
function handleKeyPress(e) {
    if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        
        if (currentScreen === 'pregame') {
            // Start the game
            startGame();
        } else if (currentScreen === 'playing' && gameActive) {
            // Try to win
            handlePlayerInput();
        } else if (currentScreen === 'lose') {
            // Restart from game over
            startGame();
        }
    }
}

// Event listeners
document.addEventListener('keydown', handleKeyPress);

// Allow clicking/tapping on pregame screen to start
screens.pregame.addEventListener('click', () => {
    if (currentScreen === 'pregame') {
        startGame();
    }
});

// Allow clicking/tapping during play
screens.playing.addEventListener('click', () => {
    if (gameActive) {
        handlePlayerInput();
    }
});

// Allow clicking the video area too
video.addEventListener('click', () => {
    if (gameActive) {
        handlePlayerInput();
    }
});

// Allow clicking/tapping on lose screen to restart
screens.lose.addEventListener('click', () => {
    if (currentScreen === 'lose') {
        startGame();
    }
});
