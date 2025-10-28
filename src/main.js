"use strict";

//Gets a reference to the current year to display
let currentYear = new Date().getFullYear();

//References to the current image displayed and the list of images to choose from
let image = document.querySelector("#placeholder");
let shownImages = document.querySelectorAll(".imagesInCarousel");
let currentSelectedImage = document.querySelector(".imagesInCarousel");

//Reference to the image text below the main carousel image
let carouselImageText = document.querySelector("#carouselImageText");

let prevCarouselButton = document.querySelector("#prev");
let nextCarouselButton = document.querySelector("#next");

//Sets up the functionality to click on each image
for (let currentImage of shownImages) {
    currentImage.onclick = e => nextCarouselImage(e.target);
}

function nextCarouselImage(newImage) {
    //Set the current "selected" image back to its original state, so it is no longer highlighted
    currentSelectedImage.src = image.src;
    //Change the main image to the selected one
    image.src = newImage.src;
    //Update the current selected image to the new one that was clicked, and highlight it
    currentSelectedImage = newImage;
    currentSelectedImage.src = `${String(newImage.src).split(".png")[0]}-Selected.png`;
    carouselImageText.innerHTML = newImage.alt;
}

function carouselLoop() {
    for (let i = 0; i < 1000; i++) {

        if (i == 999) {
            //If the current image is the last one, and the next one is null, loop back to the first one
            if(currentSelectedImage.nextElementSibling == null) {
                nextCarouselImage(document.querySelector(".imagesInCarousel"));
            }
            //Otherwise continue to the next image
            else {
                nextCarouselImage(currentSelectedImage.nextElementSibling);
            }
            
            carouselLoop();
        }
    }
}

export const init = () => {
    //Set the copyright year to the current year everytime the page is loaded
    document.querySelector("footer").innerHTML = `Copyright © ${currentYear} Peter Buechi: Portfolio - All Rights Reserved.`;

    //Set up functionality for the previous and next buttons in the image carousel
    prevCarouselButton.addEventListener('click', () => {
        //If the current image is the first one, and the previous one is null, loop to the last one
        if(currentSelectedImage.previousElementSibling == null) {
            nextCarouselImage(document.querySelectorAll(".imagesInCarousel")[document.querySelectorAll(".imagesInCarousel").length - 1]);
        }
        //Otherwise continue to the previous image
        else {
            nextCarouselImage(currentSelectedImage.previousElementSibling);
        }
    });
    nextCarouselButton.addEventListener('click', () => {
        //If the current image is the last one, and the next one is null, loop back to the first one
        if(currentSelectedImage.nextElementSibling == null) {
            nextCarouselImage(document.querySelector(".imagesInCarousel"));
        }
        //Otherwise continue to the next image
        else {
            nextCarouselImage(currentSelectedImage.nextElementSibling);
    ``    }
    });

    //Commented out for now as the timing is way off and results in a stack overflow
    //carouselLoop();
};