'use strict';
let imageWrapperEl = document.querySelector('.images-wrapper');
let images = ['Images/A.png', 'Images/B.png', 'Images/C.png', 'Images/D.png',
    'Images/E.png', 'Images/F.png', 'Images/G.png', 'Images/H.png', 'Images/I.png',
    'Images/J.png', 'Images/K.png', 'Images/L.png', 'Images/M.png', 'Images/N.png',
    'Images/O.png', 'Images/P.png', 'Images/Q.png', 'Images/R.png', 'Images/S.png',
    'Images/T.png', 'Images/U.png', 'Images/V.png', 'Images/W.png', 'Images/X.png',
    'Images/Y.png', 'Images/Z.png'];

let newSign = -1;
let keyPressed = false;
let currSign = '';

function changeColorFwdBtn() {
    if (newSign > 24) {
        let fwdBtn = document.querySelector('.fwd-btn');
        fwdBtn.style.backgroundColor = 'red';
        setTimeout(() => {
            fwdBtn.style.backgroundColor = '';
        }, 200);
    }
    if (keyPressed) {
        let playBtn = document.querySelector('.fwd-btn');
        playBtn.classList.add('fwd-btn--active');
        setTimeout(() => {
            playBtn.classList.remove('fwd-btn--active');
        }, 200);
    }
}

function changeColorReturnBtn() {
    if (newSign <= 0) {
        let returnBtn = document.querySelector('.return-btn');
        returnBtn.style.backgroundColor = 'red';
        setTimeout(() => {
            returnBtn.style.backgroundColor = '';
        }, 200);
    }
    if (keyPressed) {
        let playBtn = document.querySelector('.return-btn');
        playBtn.classList.add('return-btn--active');
        setTimeout(() => {
            playBtn.classList.remove('return-btn--active');
        }, 200);
    }
}

document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
        case 39:
            nextSign();
            keyPressed = true;
            changeColorFwdBtn();
            break;
        case 37:
            keyPressed = true;
            lastSign();
            changeColorReturnBtn();
            break;
    }
    keyPressed = !keyPressed;
});

function nextSign() {
    if (newSign > 24) {
        changeColorFwdBtn();
        return;
    } else {
        newSign++;
        showSign();
    }
}

function lastSign() {
    if (newSign <= 0) {
        changeColorReturnBtn();
        return;
    }
    newSign--;
    showSign();
}

function showSign() {
    let msg = document.querySelector('.msg');
    msg.innerText = `${String.fromCharCode(newSign + 'A'.charCodeAt(0))}`;
    let newImage;
    imageWrapperEl.innerHTML = '';
    newImage = `${images[newSign]}`;
    let img = document.createElement('img');
    img.src = newImage;
    img.alt = `Guess The Letter`;
    img.classList.add('img');
    imageWrapperEl.appendChild(img);
    return newImage;
}

const video = document.querySelector('#video');
video.addEventListener('timeupdate', (event) => {
    checkCaptions();
});

let tracks = video.textTracks;
tracks.addEventListener('change', hideCaptions);

function checkCaptions() {
    let tracks = document.querySelector('#video').textTracks[0];

    if (tracks.activeCues === null) {
        return;
    }
    let newStr;
    if (tracks.activeCues.length > 0) {
        newStr = tracks.activeCues[0].text;
    }
    let sign = newStr.match(/<b>([A-Z])<\/b>/);
    if (sign) {
        if (currSign !== sign[1]) {
            currSign = sign[1];
            newSign = sign[1].charCodeAt(sign[1]) - 65;
            showSign();
        }
    }
}

function hideCaptions() {
    let track = document.querySelector('#video').textTracks[0];
    let isTrackDisabled = track.mode === 'disabled';
    if (isTrackDisabled) {
        track.mode = 'hidden';
    }
}