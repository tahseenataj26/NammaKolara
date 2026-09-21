/* =========================================================
   NAMMA KOLAR — FOOD DETAIL PAGE
   GOOGLE MAPS RESTAURANT DIRECTIONS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".food-hero, .served-card, .restaurant-card, .district-note"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {

        revealElements.forEach((element) => {
            element.classList.add("show");
        });

    } else {

        const observer = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                root: null,
                rootMargin: "0px 0px -8% 0px",
                threshold: 0.1
            }
        );


        revealElements.forEach((element) => {
            observer.observe(element);
        });

    }


    /* =====================================================
       GET USER'S CURRENT LOCATION
    ===================================================== */

    function getUserLocation() {

        return new Promise((resolve, reject) => {

            if (!navigator.geolocation) {

                reject(
                    new Error(
                        "Geolocation is not supported by this browser."
                    )
                );

                return;
            }


            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                }
            );

        });

    }


    /* =====================================================
       CREATE GOOGLE MAPS DIRECTIONS URL
    ===================================================== */

    function createGoogleMapsURL(
        userLatitude,
        userLongitude,
        restaurantAddress
    ) {

        const origin =
            `${userLatitude},${userLongitude}`;


        return (
            "https://www.google.com/maps/dir/?api=1" +
            `&origin=${encodeURIComponent(origin)}` +
            `&destination=${encodeURIComponent(restaurantAddress)}` +
            "&travelmode=driving"
        );

    }


    /* =====================================================
       TRACK ONE RESTAURANT
    ===================================================== */

    async function trackRestaurant(card, button) {

        const restaurantName = (
            card.dataset.restaurantName ||
            card.querySelector("h3")?.textContent ||
            "Restaurant"
        ).trim();


        const restaurantAddress = (
            card.dataset.address ||
            ""
        ).trim();


        /* -----------------------------------------------
           CHECK ADDRESS
        ------------------------------------------------ */

        if (!restaurantAddress) {

            alert(
                "Restaurant address is missing."
            );

            return;

        }


        /* -----------------------------------------------
           LOADING STATE
        ------------------------------------------------ */

        button.disabled = true;

        card.classList.add("locating");


        const trackText =
            button.querySelector(".track-text");


        const originalText =
            trackText
                ? trackText.textContent
                : "Get Directions";


        if (trackText) {
            trackText.textContent = "Opening Maps...";
        }


        try {

            /* -------------------------------------------
               STEP 1
               Get phone's current location
            ------------------------------------------- */

            const position =
                await getUserLocation();


            const userLatitude =
                position.coords.latitude;


            const userLongitude =
                position.coords.longitude;


            console.log(
                "Current latitude:",
                userLatitude
            );


            console.log(
                "Current longitude:",
                userLongitude
            );


            /* -------------------------------------------
               STEP 2
               Create Google Maps directions URL
            ------------------------------------------- */

            const mapsURL =
                createGoogleMapsURL(
                    userLatitude,
                    userLongitude,
                    restaurantAddress
                );


            console.log(
                "Opening Google Maps for:",
                restaurantName
            );


            /* -------------------------------------------
               STEP 3
               Open Google Maps
            ------------------------------------------- */

            window.location.href = mapsURL;


        } catch (error) {

            console.error(
                "Location error:",
                error
            );


            /* -------------------------------------------
               PERMISSION DENIED
            ------------------------------------------- */

            if (error.code === 1) {

                alert(
                    "Location permission was denied. Please allow location access for this website and try again."
                );

            }


            /* -------------------------------------------
               LOCATION UNAVAILABLE
            ------------------------------------------- */

            else if (error.code === 2) {

                alert(
                    "Your phone location could not be determined. Please turn on Location/GPS and try again."
                );

            }


            /* -------------------------------------------
               TIMEOUT
            ------------------------------------------- */

            else if (error.code === 3) {

                alert(
                    "Getting your location took too long. Please check your GPS and try again."
                );

            }


            /* -------------------------------------------
               OTHER ERROR
            ------------------------------------------- */

            else {

                alert(
                    "Unable to get your current location. Please try again."
                );

            }


            /* -------------------------------------------
               RESTORE BUTTON
            ------------------------------------------- */

            if (trackText) {
                trackText.textContent = originalText;
            }

        } finally {

            button.disabled = false;

            card.classList.remove("locating");

        }

    }


    /* =====================================================
       RESTAURANT BUTTONS
    ===================================================== */

    const restaurantCards =
        document.querySelectorAll(
            ".restaurant-card"
        );


    restaurantCards.forEach((card) => {

        const button =
            card.querySelector(
                ".track-location"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            () => {

                trackRestaurant(
                    card,
                    button
                );

            }
        );

    });


    /* =====================================================
       HERO IMAGE
    ===================================================== */

    const heroImage =
        document.querySelector(
            ".food-hero-image img"
        );


    if (
        heroImage &&
        !heroImage.complete
    ) {

        heroImage.addEventListener(
            "load",
            () => {

                heroImage.classList.add(
                    "loaded"
                );

            },
            {
                once: true
            }
        );

    }

});