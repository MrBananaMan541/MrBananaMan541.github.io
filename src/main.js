"use strict";

let currentYear = new Date().getFullYear();

let img = document.querySelector("#placeholder");
let images = document.querySelectorAll("span[data-image]");

for (let image of images) {
    image.onclick = function (e) {
        let imageSrc = e.target.dataset.image;
        document.querySelector("#description").innerHTML = `You are looking at ${e.target.innerHTML}.`;
        document.querySelector("#description").style.fontSize = "large";
        img.src = `images/${imageSrc}`;

        image.style.color = "black";
        image.style.fontSize = "large";
        image.style.textDecoration = "underline";
    };
}

export const init = () => {
    //Set the copyright year to the current year everytime the page is loaded
    document.querySelector("footer").innerHTML = `Copyright © ${currentYear} Peter Buechi: Portfolio - All Rights Reserved.`;
};