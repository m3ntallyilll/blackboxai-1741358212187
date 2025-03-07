// Game State
const gameState = {
    player: {
        name: '',
        background: '',
        health: 100,
        money: 1000,
        reputation: 0,
        wantedLevel: 0,
        level: 1,
        xp: 0,
        xpNeeded: 100,
        location: 'Downtown'
    },
    locations: [
        {
            name: 'Downtown',
            description: 'The bustling heart of Sin City',
            dangerLevel: 2,
            actions: [
                { name: 'Rob Store', energy: 20, risk: 'medium', reward: 'money' },
                { name: 'Street Race', energy: 30, risk: 'medium', reward: 'money+xp' }
            ]
        },
        {
            name: 'Uptown',
            description: 'Wealthy district with high-end targets',
            dangerLevel: 3,
            actions: [
                { name: 'Burglary', energy: 25, risk: 'high', reward: 'money' },
                { name: 'Blackmail Executive', energy: 15, risk: 'medium', reward: 'money+reputation' }
            ]
        }
    ]
};

// UI Elements
const loginScreen = document.getElementById('loginScreen');
const gameScreen = document.getElementById('gameScreen');
const playerNameInput = document.getElementById('playerName');
const startGameBtn = document.getElementById('startGameBtn');
const backgroundButtons = document.querySelectorAll('.background-btn');
const playerNameDisplay = document.getElementById('playerNameDisplay');
const playerBackgroundDisplay = document.getElementById('playerBackgroundDisplay');
const healthBar = document.getElementById('healthBar');
const healthValue = document.getElementById('healthValue');
const currentLocationDisplay = document.getElementById('currentLocation');
const wantedLevelDisplay = document.getElementById('wantedLevel');
const reputationDisplay = document.getElementById('reputationValue');
const playerMoneyDisplay = document.getElementById('playerMoney');
const playerLevelDisplay = document.getElementById('playerLevel');
const playerXPDisplay = document.getElementById('playerXP');
const playerXPNeededDisplay = document.getElementById('playerXPNeeded');
const locationsList = document.getElementById('locationsList');
const actionsContainer = document.getElementById('actionsContainer');
const gameLogContainer = document.getElementById('gameLog');

// Event Listeners
backgroundButtons.forEach(button => {
    button.addEventListener('click', () => {
        backgroundButtons.forEach(btn => btn.classList.remove('bg-blue-500'));
        button.classList.add('bg-blue-500');
        gameState.player.background = button.dataset.background;
        checkStartButton();
    });
});

playerNameInput.addEventListener('input', checkStartButton);

startGameBtn.addEventListener('click', startGame);

function checkStartButton() {
    startGameBtn.disabled = !playerNameInput.value.trim() || !gameState.player.background;
}

function startGame() {
    gameState.player.name = playerNameInput.value.trim();
    playerNameDisplay.textContent = gameState.player.name;
    playerBackgroundDisplay.textContent = formatBackground(gameState.player.background);
    
    loginScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    initializeGame();
}

function formatBackground(background) {
    switch(background) {
        case 'street': return 'Street Hustler';
        case 'ex-cop': return 'Ex-Cop';
        case 'hacker': return 'Hacker';
        case 'brawler': return 'Brawler';
        default: return background;
    }
}

function initializeGame() {
    updatePlayerDisplay();
    renderLocations();
    renderActions();
    addToGameLog(`Welcome to Sin City, ${gameState.player.name}!`);
}

function updatePlayerDisplay() {
    healthValue.textContent = gameState.player.health;
    healthBar.style.width = `${gameState.player.health}%`;
    currentLocationDisplay.textContent = gameState.player.location;
    wantedLevelDisplay.textContent = gameState.player.wantedLevel;
    reputationDisplay.textContent = gameState.player.reputation;
    playerMoneyDisplay.textContent = gameState.player.money;
    playerLevelDisplay.textContent = gameState.player.level;
    playerXPDisplay.textContent = gameState.player.xp;
    playerXPNeededDisplay.textContent = gameState.player.xpNeeded;
}

function renderLocations() {
    locationsList.innerHTML = '';
    gameState.locations.forEach(location => {
        const locationElement = document.createElement('div');
        locationElement.className = 'p-2 bg-gray-700 rounded mb-2 cursor-pointer hover:bg-gray-600';
        locationElement.textContent = location.name;
        locationElement.addEventListener('click', () => changeLocation(location.name));
        locationsList.appendChild(locationElement);
    });
}

function changeLocation(newLocation) {
    gameState.player.location = newLocation;
    currentLocationDisplay.textContent = newLocation;
    renderActions();
    addToGameLog(`You moved to ${newLocation}.`);
}

function renderActions() {
    actionsContainer.innerHTML = '';
    const currentLocation = gameState.locations.find(loc => loc.name === gameState.player.location);
    currentLocation.actions.forEach(action => {
        const actionElement = document.createElement('div');
        actionElement.className = 'p-2 bg-gray-700 rounded mb-2 cursor-pointer hover:bg-gray-600';
        actionElement.textContent = action.name;
        actionElement.addEventListener('click', () => performAction(action));
        actionsContainer.appendChild(actionElement);
    });
}

function performAction(action) {
    // Basic action handling
    const success = Math.random() < 0.7; // 70% success chance
    
    if (success) {
        handleSuccessfulAction(action);
    } else {
        handleFailedAction(action);
    }
}

function handleSuccessfulAction(action) {
    let rewardMessage = '';
    
    if (action.reward.includes('money')) {
        const amount = Math.floor(Math.random() * 500) + 100;
        gameState.player.money += amount;
        rewardMessage += `You earned $${amount}. `;
    }
    
    if (action.reward.includes('xp')) {
        const xp = Math.floor(Math.random() * 50) + 10;
        gameState.player.xp += xp;
        rewardMessage += `You gained ${xp} XP. `;
        checkLevelUp();
    }
    
    if (action.reward.includes('reputation')) {
        const rep = Math.floor(Math.random() * 10) + 1;
        gameState.player.reputation += rep;
        rewardMessage += `Your reputation increased by ${rep}. `;
    }
    
    addToGameLog(`Success! ${rewardMessage}`);
    updatePlayerDisplay();
}

function handleFailedAction(action) {
    const penalty = Math.floor(Math.random() * 50) + 10;
    gameState.player.health -= penalty;
    gameState.player.wantedLevel += 1;
    
    addToGameLog(`Failed! You lost ${penalty} health and your wanted level increased.`);
    
    if (gameState.player.health <= 0) {
        gameOver();
    }
    
    updatePlayerDisplay();
}

function checkLevelUp() {
    if (gameState.player.xp >= gameState.player.xpNeeded) {
        gameState.player.level += 1;
        gameState.player.xp = 0;
        gameState.player.xpNeeded = Math.floor(gameState.player.xpNeeded * 1.5);
        addToGameLog(`Level up! You are now level ${gameState.player.level}.`);
        updatePlayerDisplay();
    }
}

function gameOver() {
    addToGameLog('Game Over! You have been defeated.');
    // Reset game state
    gameState.player.health = 100;
    gameState.player.wantedLevel = 0;
    updatePlayerDisplay();
}

function addToGameLog(message) {
    const logEntry = document.createElement('div');
    logEntry.className = 'mb-2 text-sm';
    logEntry.textContent = message;
    gameLogContainer.appendChild(logEntry);
    gameLogContainer.scrollTop = gameLogContainer.scrollHeight;
}