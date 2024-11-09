const cards = document.querySelectorAll('.memory-card');
const timerDisplay = document.querySelector('#timer');
const moveCounterDisplay = document.querySelector('#moveCounter');
const playerNameDisplay = document.querySelector('#playerName');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moveCounter = 0;
let timer = 0;
let timerInterval;
let gameActive = false; // Variável para controlar se o jogo está ativo

// Recuperar o nome do jogador do localStorage
const playerName = localStorage.getItem('player');
if (playerName) {
    playerNameDisplay.textContent = `Jogador: ${playerName}`;
}

// Iniciar temporizador
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
    }, 1700); // Mude sempre que quiser alterar a velocidade do temporizador
}

// Função para virar a carta
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;

        // Inicia o temporizador apenas se o jogo está ativo
        if (!gameActive) {
            gameActive = true; // Ativa o jogo
            startTimer(); // Inicia o temporizador
        }
        return;
    }

    secondCard = this;
    lockBoard = true;

    moveCounter++;
    moveCounterDisplay.textContent = moveCounter; // Atualiza o contador de jogadas

    checkForMatch();
}

// Função para verificar se as cartas combinam
function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    isMatch ? disableCards() : unflipCards();
}

// Função para desabilitar cartas combinadas
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
    checkForVictory(); // Verifica vitória após desabilitar as cartas
}

// Função para voltar as cartas não combinadas
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

// Função para resetar o estado do jogo
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Função para embaralhar as cartas
(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * cards.length);
        card.style.order = randomPos;
    });
})();

// Função para verificar se todas as cartas foram desabilitadas
function checkForVictory() {
    const allCardsFlipped = [...cards].every(card => card.classList.contains('flip'));
    if (allCardsFlipped) {
        clearInterval(timerInterval); // Para o temporizador
        gameActive = false; // Para o jogo
        setTimeout(() => {
            alert(`Você venceu! Tempo: ${timer} segundos, Jogadas: ${moveCounter}`);
            resetGame(); // Reinicia o jogo
        }, 500);
    }
}

// Função para reiniciar o jogo
function resetGame() {
    clearInterval(timerInterval);
    timer = 0;
    moveCounter = 0;

    // Atualiza os displays
    timerDisplay.textContent = timer; // Exibe 0
    moveCounterDisplay.textContent = moveCounter;

    // Remove a classe 'flip' de todas as cartas
    cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flipCard); // Reativa o evento de clique
    });

    // Embaralha as cartas novamente
    shuffle();
}

// Adiciona eventos de clique às cartas
cards.forEach(card => card.addEventListener('click', flipCard));
