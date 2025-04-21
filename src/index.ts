interface Card {
    id: number;
    value: string;
    isFlipped: boolean;
}

class CardMatchGame {
    private cards!: Card[];
    private attempts: number = 0;
    private matchesFound: number = 0;
    private timer: number = 0; // Timer in seconds
    private timerInterval: ReturnType<typeof setInterval> | null = null;
    private score: number = 0;
    private moves: number = 0;
    private bestScore: number = Number(localStorage.getItem("bestScore")) || 0;

constructor() {
    this.initializeGame();
}

private initializeGame(): void {
    this.cards = this.initializeCards();
    this.attempts = 0;
    this.matchesFound = 0;
    this.timer = 180; // 3 minutes in seconds
    this.startTimer();
    this.renderCards(); // Render cards on the UI
}

private initializeCards(): Card[] {
    const values = ["🦄 ", "🌈", "🔮"]; // Three pairs
    const cards: Card[] = [];

    // Create pairs of cards
    values.forEach((value, index) => {
      cards.push({ id: index * 2, value, isFlipped: false });
      cards.push({ id: index * 2 + 1, value, isFlipped: false });
    });

    // Shuffle cards
    return this.shuffle(cards);
}

private shuffle(array: Card[]): Card[] {
    for (let i = array.length - 1; i > 0; i--) {
      const ShuffleIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[ShuffleIndex]] = [array[ShuffleIndex], array[i]];
    }
    return array;
}

private startTimer(): void {
    this.timerInterval = setInterval(() => {
        if (this.timer > 0) {
        this.timer--;
        this.updateScoreboard();
    } else {
        clearInterval(this.timerInterval!);
        this.setMessage("Time's up! Game over!");
    }
    }, 1000);
}

public flipCard(cardId: number): void {
    console.log("flipCard called", cardId);
    const card = this.cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped) return;

    card.isFlipped = true;
    this.moves++;
    this.updateScoreboard();
    this.renderCards();
    this.checkForMatch();
}

private checkForMatch(): void {
    const flippedCards = this.cards.filter((card) => card.isFlipped);

    if (flippedCards.length === 2) {
        this.attempts++;
        if (flippedCards[0].value === flippedCards[1].value) {
        this.matchesFound++;
        this.score += 10;
        this.updateScoreboard();
        this.setMessage(`Match found: ${flippedCards[0].value}`);
        if (this.matchesFound === 3 && flippedCards.length === 2) {
            this.setMessage("All matches found! You win!");
          clearInterval(this.timerInterval!); // Stop the timer
        }
    } else {
        this.setMessage("No match. Try again.");
        setTimeout(() => {
            flippedCards.forEach((card) => (card.isFlipped = false));
            this.renderCards();
          this.setMessage(""); // Clear message after flipping back
        }, 1000);
    }
      // Reset attempts after two tries
if (this.attempts >= 2) {
        this.setMessage("Game over! You used all your attempts.");
        clearInterval(this.timerInterval!); // Stop the timer
        }
    }

if (this.score > this.bestScore) {
        this.bestScore = this.score;
        localStorage.setItem("bestScore", this.bestScore.toString());
        this.updateScoreboard();
    }
}

public restartGame(): void {
    clearInterval(this.timerInterval!); // Stop the timer
    this.initializeGame(); // Reinitialize the game
    this.setMessage("Game restarted!");
}

private renderCards(): void {
    const cardTable = document.querySelector(".card-table") as HTMLElement;
    cardTable.innerHTML = "";

    this.cards.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        cardElement.textContent = card.isFlipped ? card.value : "?";
        cardElement.addEventListener("click", () => this.flipCard(card.id));
        cardTable.appendChild(cardElement);
    });

    // Render restart button in its own container
    const buttonContainer = document.querySelector(
        ".button-container"
    ) as HTMLElement;
    buttonContainer.innerHTML = "";
    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart Game";
    restartButton.addEventListener("click", () => this.restartGame());
    buttonContainer.appendChild(restartButton);
}

private setMessage(message: string): void {
    const messageDiv = document.getElementById("game-message");
    if (messageDiv) {
        messageDiv.textContent = message;
    }
}

private updateScoreboard(): void {
    const scoreDiv = document.querySelector(".score") as HTMLElement;
    const timerDiv = document.querySelector(".timer") as HTMLElement;
    const movesDiv = document.querySelector(".moves") as HTMLElement;
    const bestScoreDiv = document.querySelector(".best-score") as HTMLElement;

    if (scoreDiv) scoreDiv.textContent = `Score: ${this.score}`;
    if (timerDiv) timerDiv.textContent = `Time: ${this.formatTime(this.timer)}`;
    if (movesDiv) movesDiv.textContent = `Moves: ${this.moves}`;
    if (bestScoreDiv)
        bestScoreDiv.textContent = `Best Score: ${this.bestScore}`;
}

private formatTime(seconds: number): string {
    const min: number = Math.floor(seconds / 60);
    const sec: number = seconds % 60;
    const minStr: string = min < 10 ? "0" + min : "" + min;
    const secStr: string = sec < 10 ? "0" + sec : "" + sec;
    return minStr + ":" + secStr;
}
}
const game = new CardMatchGame();
