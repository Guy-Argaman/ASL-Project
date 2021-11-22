'use strict';
let userInput = document.querySelector('.user-input');
let imageWrapperEl = document.querySelector('.images-wrapper');
let gameOver = true;
let currentImage;
let correctAnswer = false;
// PROGRESS BAR
let width = 0;
let i = 0;
let barEl = document.querySelector('.slide-progress-bar');
let highScore = document.querySelector('.high-score span');
let score = document.querySelector('.score span');
// Difficulty Settings
let checkBox = document.querySelector('#checkbox');
let toggleDiff;
let difficulty = 1;
// Animation
let animation = 'draw 0.5s ease';
let checkMark = document.querySelector('#check');
// Sound
let toggleSound = true;

function startGame() {
    let playBtn = document.querySelector('.play-btn');
    let playBtnSpan = document.querySelector('.play-btn span');
    difficulty = 1;
    gameOver = !gameOver;
    if (!gameOver) {
        userInput.focus();
        userInput.select();
        playBtn.classList.add('play-btn--active')
        playBtnSpan.innerText = '❚❚';
        barEl.style.opacity = 1;
        progressBar();
    } else {
        endGame();
        barEl.style.opacity = 0;
    }
}

function toggleDifficulty() {
    if (gameOver) {
        toggleDiff = !toggleDiff;
        // TOGGLE TEXT COLOR
        let checkBoxText = document.querySelector('.checkbox-text');
        if (checkBox.checked) {
            checkBoxText.style.color = 'blue';
        } else {
            checkBoxText.style.color = 'grey';
        }
    } else {
        if (toggleDiff) {
            checkBox.checked = true;
        } else {
            checkBox.checked = false;
        }
    }
}

function setDifficulty() {
    difficulty++;
    if (Number(score.innerText) % 5 === 0) {
        difficulty = 1;
    }
}

function endGame() {
    let playBtn = document.querySelector('.play-btn');
    let playBtnSpan = document.querySelector('.play-btn span');
    playBtnSpan.innerText = '▶';
    playBtn.classList.remove('play-btn--active');
    gameOver = true;
    if (Number(score.innerText) < Number(highScore.innerText)) {
        score.innerText = 0;
        return;
    }
    highScore.innerText = score.innerText;
    score.innerText = 0;
}

function progressBar() {
    if (gameOver) {
        return;
    }
    currentImage = showSign();
    resetProgressBar();
    if (i == 0) {
        i = 1;
        width = 1;
        let id = setInterval(frame, 100);
        function frame() {
            if (gameOver) {
                resetProgressBar();
                return;
            }
            if (width > 50 && width <= 70) {
                barEl.style.backgroundColor = 'orange';
            } if (width > 80) {
                barEl.style.backgroundColor = 'red';
            }
            if (width >= 100) {
                clearInterval(id);
                i = 0;
                endGame();
            } else {
                if (toggleDiff) {
                    width = width + difficulty;
                } else {
                    width++;
                }
                if (width > 100) {
                    width = 100;
                }
                barEl.style.width = width + "%";
            }
        }
    }
}

function resetProgressBar() {
    width = 0;
    barEl.style.width = width + '%';
    barEl.style.backgroundColor = 'green';
}

function isChecked() {
    return checkBox.checked ? checkBox.checked = true : checkBox.checked = false;
}

function showSign() {
    let newImage;
    if (!gameOver) {
        imageWrapperEl.innerHTML = '';
        let randomLetter = getRandomInt(0, 25);
        newImage = `Images/${String.fromCharCode(randomLetter + 'A'.charCodeAt(0))}.png`;
        let img = document.createElement('img');
        img.src = newImage;
        img.alt = `Guess The Letter`;
        img.classList.add('img');
        imageWrapperEl.appendChild(img);
    }
    return newImage;
}

function checkUserInput(input) {
    let format = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(input)) {
        return true;
    } else {
        return false;
    }
}

function warnUserMsg() {
    let warnMsg = document.querySelector('.warn-msg');
    warnMsg.classList.add('opacity');
}

function removeWarnMsg() {
    let warnMsg = document.querySelector('.warn-msg');
    warnMsg.classList.remove('opacity');
}

function userGuessInput() {
    if (gameOver) {
        return;
    }
    let newInput = userInput.value;
    if (checkUserInput(newInput)) {
        warnUserMsg();
        userInput.style.color = 'red';
    } else {
        removeWarnMsg();
        userInput.style.color = 'black';
    };
    newInput = newInput.toUpperCase();
    if (newInput === currentImage[7]) {
        correctAnswer = true;
        playAudio();
        playAnimation();
    }
    calculateHighScore();
    if (correctAnswer) {
        userInput.value = null;
        if (toggleDiff) {
            setDifficulty();
            difficulty++;
        }
        progressBar();
    } else {
        if (userInput.value === '' || userInput.value === ' ') {
            correctAnswer = false;
            return;
        }
        shakeImage();
        playAudio();
    }
    correctAnswer = false;
}

function calculateHighScore() {
    if (userInput.value === ' ' || userInput.value === '') {
        return;
    }
    let scoreText = Number(score.innerText);
    correctAnswer ? scoreText++ : scoreText--;
    if (scoreText < 0) {
        scoreText = 0;
    }
    score.innerText = scoreText;
}

function playAudio() {
    if (!toggleSound) {
        return;
    }
    let chosenAudio = !correctAnswer ? 'Incorrect.wav' : 'Correct.wav';
    let audio = new Audio(`Sound/${chosenAudio}`);
    audio.currentTime = 0;
    audio.play();
}

function playAnimation() {
    checkMark.style.animation = animation;
    setTimeout(() => {
        checkMark.style.animation = '';
    }, 500);
}

function mute(soundIcon) {
    let soundEl = document.querySelector('.sound');
    if (toggleSound) {
        soundIcon.innerText = '🔇';
        soundEl.title = 'Click to Unmute';
    } else {
        soundIcon.innerText = '🔊';
        soundEl.title = 'Click to Mute';
    }
    toggleSound = !toggleSound;
}

function shakeImage() {
    let img = document.querySelector('.img');
    img.style.transform = 'translateX(10px)';
    setTimeout(() => { img.style.transform = 'translateX(-10px)' }, 100);
    setTimeout(() => { img.style.transform = 'translateX(0px)' }, 200);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}