'use strict';

function showSigns() {
    let userInput = document.querySelector('.user-input').value;
    let imageWrapperEl = document.querySelector('.images-wrapper');
    let newImages = [];
    userInput = userInput.split('');
    for (let i of userInput) {
        if ((i >= 'A' && i <= 'Z') || (i >= 'a' && i <= 'z')) {
            newImages.push(`Images/${i.toUpperCase()}.png`);
        }
        if (i === ' ') {
            newImages.push(`Images/space.png`);
        }
    }
    imageWrapperEl.innerHTML = '';
    for (let j = 0; j < newImages.length; j++) {
        let img = document.createElement('img');
        img.src = newImages[j];
        img.alt = `${newImages[j]}`;
        img.classList.add('img');
        imageWrapperEl.appendChild(img);
    }
}
