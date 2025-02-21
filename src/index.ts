// Imports your SCSS stylesheet
import "./styles/index.scss";

interface Card {
  value: number;
  element: HTMLElement;
  isFlipped: boolean;
  isMatched: boolean;
}

let cards: Card[] = [];
let attempts = 3;
let flippedCards: Card[] = [];
let matchesFound = 0;

const cardValues = [1, 1, 2, 2, 3, 3];
const cardsGrid = document.getElementById("cards-grid")!;
const attemptsDisplay = document.getElementById("attempts")!;
const resetButton = document.getElementById("reset")!;

function initializeGame() {
  cards = [];
  attempts = 3;
  flippedCards = [];
  matchesFound = 0;
  attemptsDisplay.textContent = attempts.toString();
  cardsGrid.innerHTML = "";
  shuffleCards();
  createCards();
}

function shuffleCards() {
  for (let i = cardValues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardValues[i], cardValues[j]] = [cardValues[j], cardValues[i]];
  }
}

function createCards() {
  cardValues.forEach((value, index) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-value", value.toString());
    cardElement.addEventListener("click", () => handleCardClick(index));

    const card: Card = {
      value: value,
      element: cardElement,
      isFlipped: false,
      isMatched: false,
    };

    cards.push(card);
    cardsGrid.appendChild(cardElement);
  });
}

function handleCardClick(index: number) {
  const card = cards[index];

  if (card.isFlipped || card.isMatched || flippedCards.length === 2) return;

  flipCard(card);
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkForMatch();
  }
}

function flipCard(card: Card) {
  card.isFlipped = true;
  card.element.classList.add("flipped");
}

function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.value === card2.value) {
    card1.isMatched = true;
    card2.isMatched = true;
    card1.element.classList.add("matched");
    card2.element.classList.add("matched");
    matchesFound += 2;

    if (matchesFound === cardValues.length) {
      setTimeout(() => alert("Congratulations! You won!"), 500);
    }
  } else {
    attempts--;
    attemptsDisplay.textContent = attempts.toString();

    if (attempts === 0) {
      setTimeout(() => alert("Game Over! Try again."), 500);
    }

    setTimeout(() => {
      flipCardBack(card1);
      flipCardBack(card2);
    }, 1000);
  }

  flippedCards = [];
}

function flipCardBack(card: Card) {
  card.isFlipped = false;
  card.element.classList.remove("flipped");
}

resetButton.addEventListener("click", initializeGame);

// Initialize the first game
initializeGame();