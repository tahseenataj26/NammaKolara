/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const closeMenu = document.querySelector(".close-menu");


/* OPEN MENU */

if (menuToggle && mobileMenu) {

    menuToggle.addEventListener("click", function () {

        mobileMenu.classList.add("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            "false"
        );

    });

}


/* CLOSE MENU */

if (closeMenu && mobileMenu) {

    closeMenu.addEventListener("click", function () {

        mobileMenu.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

    });

}


/* CLOSE AFTER CLICKING A LINK */

if (mobileMenu) {

    const mobileLinks =
        mobileMenu.querySelectorAll("a");

    mobileLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            mobileMenu.classList.remove("active");

            if (menuToggle) {

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

            mobileMenu.setAttribute(
                "aria-hidden",
                "true"
            );

        });

    });

}


/* =========================================================
   FAVOURITE BUTTON
========================================================= */

const favoriteButtons =
    document.querySelectorAll(".favorite-btn");


favoriteButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const isActive =
            button.classList.toggle("active");


        if (isActive) {

            button.textContent = "♥";

            button.setAttribute(
                "aria-label",
                "Remove from favourites"
            );

        } else {

            button.textContent = "♡";

            button.setAttribute(
                "aria-label",
                "Add to favourites"
            );

        }

    });

});


/* =========================================================
   HEALTHCARE SEARCH
========================================================= */

const healthcareSearch =
    document.querySelector(".healthcare-search input");

const searchButton =
    document.querySelector(
        '.healthcare-search button[aria-label="Search"]'
    );

const healthcareCards =
    document.querySelectorAll(".healthcare-card");


/* SEARCH FUNCTION */

function performSearch() {

    const searchValue =
        healthcareSearch.value
            .trim()
            .toLowerCase();


    healthcareCards.forEach(function (card) {

        const cardText =
            card.textContent.toLowerCase();


        if (
            searchValue === "" ||
            cardText.includes(searchValue)
        ) {

            card.classList.remove("hidden");

        } else {

            card.classList.add("hidden");

        }

    });

}


/* SEARCH WHILE TYPING */

if (healthcareSearch) {

    healthcareSearch.addEventListener(
        "input",
        performSearch
    );

}


/* SEARCH BUTTON */

if (searchButton) {

    searchButton.addEventListener(
        "click",
        performSearch
    );

}


/* SEARCH USING ENTER KEY */

if (healthcareSearch) {

    healthcareSearch.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                performSearch();

            }

        }
    );

}


/* =========================================================
   TALUK FILTER
========================================================= */

const talukSelect =
    document.querySelector(".taluk-select select");


if (talukSelect) {

    talukSelect.addEventListener(
        "change",
        function () {

            const selectedTaluk =
                talukSelect.value;


            healthcareCards.forEach(function (card) {

                const cardTaluk =
                    card.dataset.taluk;


                if (
                    selectedTaluk === "" ||
                    cardTaluk === selectedTaluk
                ) {

                    card.classList.remove("hidden");

                } else {

                    card.classList.add("hidden");

                }

            });

        }
    );

}