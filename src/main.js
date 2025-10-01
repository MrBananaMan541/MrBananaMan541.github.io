"use strict";

let currentYear = new Date().getFullYear();

let image = document.querySelector("#placeholder");
let listOfImages = document.querySelectorAll("span[data-image]");

for (let currentImage of listOfImages) {
    currentImage.onclick = function (e) {
        let imageSrc = e.target.dataset.image;
        document.querySelector("#description").innerHTML = `You are looking at ${e.target.innerHTML}.`;
        document.querySelector("#description").style.fontSize = "large";
        image.src = `assets/images/${imageSrc}`;

        currentImage.style.color = "black";
        currentImage.style.fontSize = "large";
        currentImage.style.textDecoration = "underline";
    };
}

export const init = () => {
    //Set the copyright year to the current year everytime the page is loaded
    document.querySelector("footer").innerHTML = `Copyright © ${currentYear} Peter Buechi: Portfolio - All Rights Reserved.`;
};