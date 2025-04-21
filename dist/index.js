"use strict";
var CardMatchGame = /** @class */ (function () {
    function CardMatchGame() {
        this.attempts = 0;
        this.matchesFound = 0;
        this.timer = 0; // Timer in seconds
        this.timerInterval = null;
        this.score = 0;
        this.moves = 0;
        this.bestScore = Number(localStorage.getItem("bestScore")) || 0;
        this.initializeGame();
    }
    CardMatchGame.prototype.initializeGame = function () {
        this.cards = this.initializeCards();
        this.attempts = 0;
        this.matchesFound = 0;
        this.timer = 180; // 3 minutes in seconds
        this.startTimer();
        this.renderCards(); // Render cards on the UI
    };
    CardMatchGame.prototype.initializeCards = function () {
        var values = ["🦄 ", "🌈", "🔮"]; // Three pairs
        var cards = [];
        // Create pairs of cards
        values.forEach(function (value, index) {
            cards.push({ id: index * 2, value: value, isFlipped: false });
            cards.push({ id: index * 2 + 1, value: value, isFlipped: false });
        });
        // Shuffle cards
        return this.shuffle(cards);
    };
    CardMatchGame.prototype.shuffle = function (array) {
        var _a;
        for (var i = array.length - 1; i > 0; i--) {
            var ShuffleIndex = Math.floor(Math.random() * (i + 1));
            _a = [array[ShuffleIndex], array[i]], array[i] = _a[0], array[ShuffleIndex] = _a[1];
        }
        return array;
    };
    CardMatchGame.prototype.startTimer = function () {
        var _this = this;
        this.timerInterval = setInterval(function () {
            if (_this.timer > 0) {
                _this.timer--;
                _this.updateScoreboard();
            }
            else {
                clearInterval(_this.timerInterval);
                _this.setMessage("Time's up! Game over!");
            }
        }, 1000);
    };
    CardMatchGame.prototype.flipCard = function (cardId) {
        console.log("flipCard called", cardId);
        var card = this.cards.find(function (c) { return c.id === cardId; });
        if (!card || card.isFlipped)
            return;
        card.isFlipped = true;
        this.moves++;
        this.updateScoreboard();
        this.renderCards();
        this.checkForMatch();
    };
    CardMatchGame.prototype.checkForMatch = function () {
        var _this = this;
        var flippedCards = this.cards.filter(function (card) { return card.isFlipped; });
        if (flippedCards.length === 2) {
            this.attempts++;
            if (flippedCards[0].value === flippedCards[1].value) {
                this.matchesFound++;
                this.score += 10;
                this.updateScoreboard();
                this.setMessage("Match found: ".concat(flippedCards[0].value));
                if (this.matchesFound === 3 && flippedCards.length === 2) {
                    this.setMessage("All matches found! You win!");
                    clearInterval(this.timerInterval); // Stop the timer
                }
            }
            else {
                this.setMessage("No match. Try again.");
                setTimeout(function () {
                    flippedCards.forEach(function (card) { return (card.isFlipped = false); });
                    _this.renderCards();
                    _this.setMessage(""); // Clear message after flipping back
                }, 1000);
            }
            // Reset attempts after two tries
            if (this.attempts >= 2) {
                this.setMessage("Game over! You used all your attempts.");
                clearInterval(this.timerInterval); // Stop the timer
            }
        }
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem("bestScore", this.bestScore.toString());
            this.updateScoreboard();
        }
    };
    CardMatchGame.prototype.restartGame = function () {
        clearInterval(this.timerInterval); // Stop the timer
        this.initializeGame(); // Reinitialize the game
        this.setMessage("Game restarted!");
    };
    CardMatchGame.prototype.renderCards = function () {
        var _this = this;
        var cardTable = document.querySelector(".card-table");
        cardTable.innerHTML = "";
        this.cards.forEach(function (card) {
            var cardElement = document.createElement("div");
            cardElement.className = "card";
            cardElement.textContent = card.isFlipped ? card.value : "?";
            cardElement.addEventListener("click", function () { return _this.flipCard(card.id); });
            cardTable.appendChild(cardElement);
        });
        // Render restart button in its own container
        var buttonContainer = document.querySelector(".button-container");
        buttonContainer.innerHTML = "";
        var restartButton = document.createElement("button");
        restartButton.textContent = "Restart Game";
        restartButton.addEventListener("click", function () { return _this.restartGame(); });
        buttonContainer.appendChild(restartButton);
    };
    CardMatchGame.prototype.setMessage = function (message) {
        var messageDiv = document.getElementById("game-message");
        if (messageDiv) {
            messageDiv.textContent = message;
        }
    };
    CardMatchGame.prototype.updateScoreboard = function () {
        var scoreDiv = document.querySelector(".score");
        var timerDiv = document.querySelector(".timer");
        var movesDiv = document.querySelector(".moves");
        var bestScoreDiv = document.querySelector(".best-score");
        if (scoreDiv)
            scoreDiv.textContent = "Score: ".concat(this.score);
        if (timerDiv)
            timerDiv.textContent = "Time: ".concat(this.formatTime(this.timer));
        if (movesDiv)
            movesDiv.textContent = "Moves: ".concat(this.moves);
        if (bestScoreDiv)
            bestScoreDiv.textContent = "Best Score: ".concat(this.bestScore);
    };
    CardMatchGame.prototype.formatTime = function (seconds) {
        var min = Math.floor(seconds / 60);
        var sec = seconds % 60;
        var minStr = min < 10 ? "0" + min : "" + min;
        var secStr = sec < 10 ? "0" + sec : "" + sec;
        return minStr + ":" + secStr;
    };
    return CardMatchGame;
}());
var game = new CardMatchGame();
