"use strict";

let currentYear = new Date().getFullYear();

export const init = () => {
	//Set the copyright year to the current year everytime the page is loaded
    document.querySelector("footer").innerHTML = `Copyright © ${currentYear} Peter Buechi: Portfolio - All Rights Reserved.`;
};