'use strict';
//#region Global Variables
let gameOver = true;
let correctAnswer = false;
let assignedLetter;
let correctImageEl;
//#endregion
//#region Progress Bar
let width = 0;
let i = 0;
let barEl = document.querySelector('.slide-progress-bar');
let highScore = document.querySelector('.high-score span');
let score = document.querySelector('.score span');
//#endregion
//#region Difficulty Settings
let toggleDiff = false;
let difficulty = 1;
//#endregion
//#region Animation
let animation = 'draw 0.5s ease';
let checkMark = document.querySelector('#check');
//#endregion
// Sound
let toggleSound = true;

// Board
let gBoard = createMat(5, 5);

function init() {
    let images = fillImagesMatrix();
    assignedLetter = assignLetterGuess(images);
    let guessLetterEl = document.querySelector('.guess-letter');
    let cutStr = assignedLetter[7];
    guessLetterEl.innerText = `Find the sign: ${cutStr}`;
    renderBoard();
}

function createMat(ROWS, COLS) {
    let mat = [];
    for (let i = 0; i < ROWS; i++) {
        let row = [];
        for (let j = 0; j < COLS; j++) {
            row.push('');
        }
        mat.push(row);
    }
    return mat;
}

function renderBoard() {
    let strHTML = '<tbody>';
    for (let i = 0; i < gBoard.length; i++) {
        strHTML += '<tr class="table-row">\n';
        for (let j = 0; j < gBoard[i].length; j++) {
            strHTML += `<td class="board-cell" onclick="cellClicked(this)"><img src=${gBoard[i][j]}></td>`;
        }
        strHTML += '</tr>\n';
    }
    strHTML += '</tbody>';
    let elTable = document.querySelector('.game-board');
    elTable.innerHTML = strHTML;
    imageElAltUpdate();
}

function imageElAltUpdate() {
    let imagesEl = document.querySelectorAll('img');
    for (let h = 0; h < imagesEl.length; h++) {
        let newImageAlt = imagesEl[h].outerHTML.slice(10, imagesEl[h].outerHTML.length - 2);
        imagesEl[h].alt = newImageAlt;
        if (newImageAlt === assignedLetter) {
            correctImageEl = imagesEl[h];
        }
    }
    return correctImageEl;
}

function nextSign() {
    let playBtn = document.querySelector('.play-btn');
    let playBtnSpan = document.querySelector('.play-btn span');
    gameOver = !gameOver;
    if (!gameOver) {
        playBtn.classList.add('play-btn--active')
        playBtnSpan.innerText = '❚❚';
        barEl.style.opacity = 1;
        progressBar();
    } else {
        barEl.style.opacity = 0;
        endGame();
    }
}

function toggleDifficulty() {
    let checkBoxText = document.querySelector('.checkbox-text');
    let checkBox = document.querySelector('#checkbox');
    if (!gameOver) {
        let checkBoxStatus = checkBox.checked ? checkBox.checked = true : checkBox.checked = false;
        checkBox.checked = !checkBoxStatus;
        return;
    }
    if (gameOver) {
        // TOGGLE TEXT COLOR & CHECBKOX STATE
        checkBox.checked ? checkBoxText.style.color = 'blue' : checkBoxText.style.color = 'grey';
        checkBox.checked ? difficulty = 2 : difficulty = 1;
        checkBox.checked ? toggleDiff = true : toggleDiff = false;
    }
    return difficulty;
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
    init();
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
                if (width >= 100) {
                    correctImageEl.style.backgroundColor = 'green';
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

function cellClicked(cell) {
    if (gameOver) {
        return;
    }
    cell.classList.add('color-change');
    let clickedCell = cell.querySelector('img').alt;
    if (clickedCell === correctImageEl.alt) {
        correctAnswer = true;
        playAnimation();
        progressBar();
    } else {
        correctAnswer = false;
    }
    playAudio();
    calculateHighScore();
}

function assignLetterGuess(arr) {
    let randomImage = arr[getRandomInt(0, 24)];
    return randomImage;
}

function fillImagesMatrix() {
    let newImages = [];
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            let newImage = findNewImage();
            for (let h = 0; h < newImages.length; h++) {
                while (newImages[h] === newImage) {
                    newImage = findNewImage();
                    h = 0;
                }
            }
            newImages.push(newImage);
            gBoard[i][j] = newImage;
        }
    }
    return newImages
}

function findNewImage() {
    let newImage;
    let randomLetter = getRandomInt(0, 25);
    newImage = `Images/${String.fromCharCode(randomLetter + 'A'.charCodeAt(0))}.png`;
    return newImage;
}

function calculateHighScore() {
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}