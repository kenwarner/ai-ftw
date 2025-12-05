// Game configuration
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
let playerWon = false;

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
    
    // Show playing screen
    showScreen('playing');
    
    // Start video
    video.currentTime = 0;
    video.play().catch(e => console.log('Video play error:', e));
}

// Player pressed space - check if in the correct time window
function handlePlayerInput() {
    if (!gameActive) return;
    
    const currentTime = video.currentTime;
    
    // Too early - player loses
    if (currentTime < MIN_TIME) {
        gameActive = false;
        video.pause();
        showScreen('lose');
        return;
    }
    
    // On time - player wins, video keeps playing
    gameActive = false;
    playerWon = true;
}

// When video ends
video.addEventListener('ended', () => {
    if (playerWon) {
        showScreen('pregame');
        playerWon = false;
    } else if (gameActive) {
        // Player never pressed - they lose
        gameActive = false;
        showScreen('lose');
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
