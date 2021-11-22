'use strict';
let imageWrapperEl = document.querySelector('.images-wrapper');
let images = ['Images/A.png', 'Images/B.png', 'Images/C.png', 'Images/D.png',
    'Images/E.png', 'Images/F.png', 'Images/G.png', 'Images/H.png', 'Images/I.png',
    'Images/J.png', 'Images/K.png', 'Images/L.png', 'Images/M.png', 'Images/N.png',
    'Images/O.png', 'Images/P.png', 'Images/Q.png', 'Images/R.png', 'Images/S.png',
    'Images/T.png', 'Images/U.png', 'Images/V.png', 'Images/W.png', 'Images/X.png',
    'Images/Y.png', 'Images/Z.png'];


async function startGame() {
    for (let i = 0; i < images.length; i++) {
        await sleep(2000);
        showSign(i)
    }
}

async function showSign(i) {
    let newImage;
    imageWrapperEl.innerHTML = '';
    newImage = `${images[i]}`;
    let img = document.createElement('img');
    img.src = newImage;
    img.alt = `Guess The Letter`;
    img.classList.add('img');
    imageWrapperEl.appendChild(img);
    return newImage;
}

function warnUserMsg() {
    let warnMsg = document.querySelector('.warn-msg');
    warnMsg.classList.add('opacity');
}

function removeWarnMsg() {
    let warnMsg = document.querySelector('.warn-msg');
    warnMsg.classList.remove('opacity');
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
