    // variable declarations

// Selects all elements with the card class
const cards = document.querySelectorAll(".card");
// Continue button element
const continueBtn = document.getElementById("play-btn");
// Reshuffle button element
const reshuffleBtn = document.getElementById("reshuffle-btn");
reshuffleBtn.style.display = "none";
const scoreDisplay = document.getElementById("score");
const messageBox = document.getElementById("box");
const lofiAudio = document.getElementById('background-audio');
// Count of the number of pairs matched
let matched = 0;
// Tracks the two cards flipped at a time
let cardOne, cardTwo;
// Disables clicking once two cards are selected at a time
let disableDeck = false;
// Countdown number
let time = 60;
// Timer id selector
let timerId;
// Status of game over
let gameStop = false;
// Score number
let scoreNumber = 0;

    // Score setup

// Updates the points earned
function pointsEarned() {
    scoreDisplay.textContent = `Score: ${scoreNumber}`;
}

// Adds a certain number of points based on whether the time is over or under 30 seconds
function pointsAdded() {
    if (time >= 30) {
        scoreNumber += 10;
    }
    else {
        scoreNumber += 5;
    }
    localStorage.setItem("score", scoreNumber);
    pointsEarned();
}

    // Timer setup

function format(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;       
}

// Countdown from one minute for timer
function startCountdown() {
    const timerDisplay = document.getElementById("timer");
    timerDisplay.textContent = `Time: ${format(time)}`;
    timerId = setInterval(() => {
        time--;
        timerDisplay.textContent = `Time: ${format(time)}`;
        if (time <= 0) {
            clearInterval(timerId);
            gameOver();
            scoreNumber -= 5;
            pointsEarned();
        }
    }, 1000);
}

    // Game functions

// Card selection and flipping
function flipCard({target: clickedCard}) {
    if(cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add("flip");
        if(!cardOne) {
        return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

// Compares the two cards selected and watches if all pairs are matched
function matchCards(img1, img2) {
    // If card one and card two match, add one to the matched pairs
    if(img1 === img2) {
    messageBox.textContent = "You matched a pair. :)";
    matched++;
        // If there are nine matched pairs, the timer stops and the continue button is displayed
        if(matched == 9) {
        pointsAdded();   
        setTimeout(() => {
        clearInterval(timerId); 
        continueBtn.style.display = "inline-block";
        messageBox.textContent = "You won the round."; 
        });
        }
        // Keeps matched cards flipped
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    // Flips cards that don't match
    setTimeout(() => {
        messageBox.textContent = "No match. :(";
        cardOne.classList.remove("flip");
        cardTwo.classList.remove("flip");
        cardOne = cardTwo = "";
        disableDeck = false;
        }, 1000);
}

// Randomizer shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Shuffles the cards
function shuffleCard() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    let characters = ["rin", "pierrette", "nori", "yuna", "amber", "abraham", "nicholas", "lenora", "spring",
    "rin", "pierrette", "nori", "yuna", "amber", "abraham", "nicholas", "lenora", "spring"];
    shuffle(characters);
    cards.forEach((card, index) => {
        card.classList.remove("flip");
        const img = card.querySelector(".back-view img");
        img.src = `behind/${characters[index]}.png`;
        card.addEventListener("click", flipCard);
    });
}

// Handles the game over status
function gameOver() {
    gameOver = true;
    disableDeck = true;
    messageBox.textContent = "You lost the round.";
    cards.forEach(card => card.removeEventListener("click", flipCard));
    continueBtn.style.display = "inline-block";
}

    // Game start

continueBtn.addEventListener("click", () => {
    lofiAudio.muted = false;
    lofiAudio.play();
    reshuffleBtn.style.display = "inline-block";
    // Hides the button
    continueBtn.style.display = "none";
    // Variable declarations reset
    time = 60;
    gameStop = false;
    matched = 0;
    scoreNumber = scoreNumber;
    cardOne = cardTwo = "";
    disableDeck = false;
    // Reset time and game state
    shuffleCard();
    clearInterval(timerId);
    pointsEarned();
    // Flip all cards back and re-add click events
    cards.forEach(card => {
        card.classList.remove("flip");
        card.addEventListener("click", flipCard);
    });
    startCountdown();
    messageBox.textContent = "The round has started.";
});

    // Reshuffle

reshuffleBtn.addEventListener("click", () => {
    // Variable declarations reset
    time = 60;
    gameStop = false;
    matched = 0;
    scoreNumber = scoreNumber;
    cardOne = cardTwo = "";
    disableDeck = false;
    // Reset time and game state
    shuffleCard();
    clearInterval(timerId);
    pointsEarned();
    // Flip all cards back and re-add click events
    cards.forEach(card => {
        card.classList.remove("flip");
        card.addEventListener("click", flipCard);
    });
    startCountdown();
    messageBox.textContent = "The memory cards have been shuffled.";
})