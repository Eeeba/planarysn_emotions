    // card variable declarations
// selects all elements with the card class
const cards = document.querySelectorAll(".card");
// count of the number of pairs matched
let matched = 0;
// tracks the two cards flipped at a time
let cardOne, cardTwo;
// disables clicking once two cards are selected at a time
let disableDeck = false;

    // time variable declarations
// countdown number
let time = 60;
// timer id selector
let timerId;
// status of game over
let gameStop = false;

const continueBtn = document.getElementById("play-btn");

function format(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;       
}

function startCountdown() {
    const timerDisplay = document.getElementById("timer");
    timerDisplay.textContext = `Time: ${format(time)}`;
    timerId = setInterval(() => {
        time--;
        timerDisplay.textContent = `Time: ${format(time)}`;
        if (time <= 0) {
            clearInterval(timerId);
            gameOver();
        }
    }, 1000);
}

function gameOver() {
    gameOver = true;
    disableDeck = true;
    alert("Time's up! Game over.");
    cards.forEach(card => card.removeEventListener("click", flipCard));
    continueBtn.style.display = "inline-block"; // Show the button
}

    // card selection and flipping
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

    // compares the two cards selected and watches if all pairs are matched
function matchCards(img1, img2) {
    if(img1 === img2) {
    matched++;
        if(matched == 8) {
        setTimeout(() => {
        // Stop timer
        clearInterval(timerId); 
        // Show continue
        continueBtn.style.display = "inline-block"; 
        }, 1000);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    setTimeout(() => {
        cardOne.classList.remove("flip");
        cardTwo.classList.remove("flip");
        cardOne = cardTwo = "";
        disableDeck = false;
        }, 900);
}

    // random shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

    // shuffles the cards
function shuffleCard() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffle(arr);
}
shuffleCard();

    // resets all card faces and clicks for the next round
cards.forEach(card => {
    card.addEventListener("click", flipCard);
});

continueBtn.addEventListener("click", () => {
    // Hide the button again
    continueBtn.style.display = "none";

    // Reset time and game state
    clearInterval(timerId);
    time = 60;
    gameStop = false;
    matched = 0;
    cardOne = cardTwo = "";
    disableDeck = false;

    // Flip all cards back and re-add click events
    cards.forEach(card => {
        card.classList.remove("flip");
        card.addEventListener("click", flipCard);
    });

    shuffleCard();
    startCountdown();
});
