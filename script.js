// JavaScript Game Logic

let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let currentBet = 0;
let gameMode = '';

function showGameModes() {
    document.getElementById('start-page').classList.add('hidden');
    document.getElementById('mode-select-page').classList.remove('hidden');
}

function startGame(mode) {
    gameMode = mode;
    document.getElementById('mode-select-page').classList.add('hidden');
    document.getElementById('game-page').classList.remove('hidden');
    
    if (gameMode === 'money') {
        document.getElementById('betting-section').classList.remove('hidden');
    } else {
        startNewRound();
    }
}

function placeBet() {
    const betAmount = parseInt(document.getElementById('bet-amount').value);
    if (betAmount > 0) {
        currentBet = betAmount;
        document.getElementById('betting-section').classList.add('hidden');
        startNewRound();
    } else {
        alert("Please enter a valid bet amount.");
    }
}

function startNewRound() {
    deck = generateDeck();
    shuffleDeck(deck);
    
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()];

    updateScores();
    renderHands();
    checkForBlackjack();
}

function generateDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let newDeck = [];

    for (let suit of suits) {
        for (let value of values) {
            newDeck.push({ value, suit });
        }
    }
    return newDeck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function drawCard() {
    return deck.pop();
}

function calculateScore(hand) {
    let score = 0;
    let aces = 0;

    for (let card of hand) {
        if (card.value === 'A') {
            aces++;
            score += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    }

    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

function updateScores() {
    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);

    document.getElementById('player-score').textContent = `Score: ${playerScore}`;
    document.getElementById('dealer-score').textContent = `Score: ${dealerScore}`;
}

function renderHands() {
    const playerCards = document.getElementById('player-cards');
    const dealerCards = document.getElementById('dealer-cards');

    playerCards.innerHTML = '';
    dealerCards.innerHTML = '';

    for (let card of playerHand) {
        const img = document.createElement('img');
        img.src = `cards/${card.value}_of_${card.suit}.png`;
        playerCards.appendChild(img);
    }

    for (let card of dealerHand) {
        const img = document.createElement('img');
        img.src = `cards/${card.value}_of_${card.suit}.png`;
        dealerCards.appendChild(img);
    }
}

function hit() {
    playerHand.push(drawCard());
    updateScores();
    renderHands();
    checkPlayerBust();
}

function stand() {
    while (dealerScore < 17) {
        dealerHand.push(drawCard());
        updateScores();
        renderHands();
    }
    checkWinner();
}

function doubleDown() {
    if (gameMode === 'money') {
        currentBet *= 2;
    }
    hit();
    stand();
}

function split() {
    // Splitting logic would go here, but for simplicity, it's omitted in this version.
    alert('Split functionality not implemented in this version.');
}

function checkForBlackjack() {
    if (playerScore === 21) {
        showMessage('Blackjack! You win!');
        endRound();
    } else if (dealerScore === 21) {
        showMessage('Dealer has Blackjack! You lose.');
        endRound();
    }
}

function checkPlayerBust() {
    if (playerScore > 21) {
        showMessage('You bust! Dealer wins.');
        endRound();
    }
}

function checkWinner() {
    if (dealerScore > 21) {
        showMessage('Dealer busts! You win.');
    } else if (playerScore > dealerScore) {
        showMessage('You win!');
    } else if (playerScore < dealerScore) {
        showMessage('Dealer wins.');
    } else {
        showMessage('It\'s a tie!');
    }
    endRound();
}

function showMessage(message) {
    document.getElementById('message').textContent = message;
}

function endRound() {
    if (gameMode === 'money') {
        document.getElementById('betting-section').classList.remove('hidden');
    }
}