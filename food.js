/* =========================================
   NAMMA KOLAR — FOOD PAGE
   Scroll Reveal Animation
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const foodCards = document.querySelectorAll(".food-card");

    if (!foodCards.length) {
        return;
    }


    /* =========================================
       SCROLL REVEAL
    ========================================= */

    const observerOptions = {
        root: null,

        // Start the animation slightly before
        // the card reaches the middle of the screen.
        rootMargin: "0px 0px -10% 0px",

        threshold: 0.15
    };


    const foodObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    // Show card
                    entry.target.classList.add("show");

                } else {

                    // Remove class when it leaves viewport
                    // so animation can happen again
                    // when scrolling back.
                    entry.target.classList.remove("show");

                }

            });

        },
        observerOptions
    );


    /* =========================================
       OBSERVE ALL FOOD CARDS
    ========================================= */

    foodCards.forEach((card) => {
        foodObserver.observe(card);
    });


    /* =========================================
       IMAGE LOADING
    ========================================= */

    const foodImages = document.querySelectorAll(
        ".food-image img"
    );


    foodImages.forEach((image) => {

        if (image.complete) {

            image.classList.add("loaded");

        } else {

            image.addEventListener(
                "load",
                () => {
                    image.classList.add("loaded");
                },
                { once: true }
            );

        }

    });


    /* =========================================
       REDUCED MOTION
    ========================================= */

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


    if (prefersReducedMotion.matches) {

        foodCards.forEach((card) => {
            card.classList.add("show");
        });

    }

});