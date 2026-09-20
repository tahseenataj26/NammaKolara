/* =========================================================
   NAMMA KOLAR — RAGI MUDDE DETAIL PAGE
   Individual Restaurant Location + Directions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".ragi-hero, .served-card, .restaurant-card, .district-note"
    );

    const restaurantCards = document.querySelectorAll(".restaurant-card");

    const locationPanel = document.getElementById("locationPanel");
    const locationTitle = document.getElementById("locationTitle");
    const locationMessage = document.getElementById("locationMessage");


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {

        revealElements.forEach((element) => {
            element.classList.add("show");
        });

    } else {

        const observer = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
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
       DISTANCE CALCULATION
       Haversine formula
       ===================================================== */

    function calculateDistance(lat1, lon1, lat2, lon2) {

        const earthRadius = 6371;

        const toRadians = (degrees) => {
            return degrees * Math.PI / 180;
        };

        const latDiff = toRadians(lat2 - lat1);
        const lonDiff = toRadians(lon2 - lon1);

        const a =
            Math.sin(latDiff / 2) *
            Math.sin(latDiff / 2) +

            Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(lonDiff / 2) *
            Math.sin(lonDiff / 2);

        const c = 2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

        return earthRadius * c;
    }


    /* =====================================================
       FORMAT DISTANCE
       ===================================================== */

    function formatDistance(distance) {

        if (distance < 1) {
            return `${Math.round(distance * 1000)} m away`;
        }

        return `${distance.toFixed(1)} km away`;
    }


    /* =====================================================
       GET USER LOCATION
       ===================================================== */

    function getUserLocation() {

        return new Promise((resolve, reject) => {

            if (!navigator.geolocation) {

                reject(
                    new Error(
                        "Location is not supported by this browser."
                    )
                );

                return;
            }

            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 0
                }
            );

        });

    }


    /* =====================================================
       PANEL HELPERS
       ===================================================== */

    function setPanel(title, message) {

        if (locationPanel) {
            locationPanel.classList.add("active");
        }

        if (locationTitle) {
            locationTitle.textContent = title;
        }

        if (locationMessage) {
            locationMessage.textContent = message;
        }

    }


    function showLocationError(message) {

        setPanel(
            "Location unavailable",
            message
        );

    }


    /* =====================================================
       READ RESTAURANT COORDINATES
       ===================================================== */

    function getRestaurantCoordinates(card) {

        const rawLat = (card.dataset.lat || "").trim();
        const rawLng = (card.dataset.lng || "").trim();

        if (rawLat === "" || rawLng === "") {
            return null;
        }

        const latitude = Number(rawLat);
        const longitude = Number(rawLng);

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {

            return null;

        }

        return {
            latitude,
            longitude
        };

    }


    /* =====================================================
       GET RESTAURANT ADDRESS
       ===================================================== */

    function getRestaurantAddress(card) {

        return (card.dataset.address || "").trim();

    }


    /* =====================================================
       OPEN GOOGLE MAPS DIRECTIONS
       ===================================================== */

    function openDirections(
        userLatitude,
        userLongitude,
        destination
    ) {

        const origin =
            `${userLatitude},${userLongitude}`;

        const destinationEncoded =
            encodeURIComponent(destination);

        const mapsURL =
            `https://www.google.com/maps/dir/?api=1` +
            `&origin=${origin}` +
            `&destination=${destinationEncoded}` +
            `&travelmode=driving`;

        window.open(
            mapsURL,
            "_blank",
            "noopener,noreferrer"
        );

    }


    /* =====================================================
       TRACK ONE RESTAURANT ONLY
       ===================================================== */

    async function trackRestaurant(card, button) {

        /*
         * Disable only the clicked button.
         * Other restaurants remain available.
         */

        button.disabled = true;

        card.classList.add("locating");

        const restaurantName =
            card.querySelector("h3")?.textContent.trim() ||
            "Restaurant";

        const restaurantAddress =
            getRestaurantAddress(card);

        const distanceText =
            card.querySelector(".distance-text");

        const distanceResult =
            card.querySelector(".distance-result");


        if (distanceText) {
            distanceText.textContent =
                "Finding your location...";
        }


        if (distanceResult) {
            distanceResult.classList.remove("available");
        }


        setPanel(
            "Finding your location...",
            `Allow location access to get directions to ${restaurantName}.`
        );


        try {

            /* =============================================
               GET CURRENT USER LOCATION
               ============================================= */

            const position =
                await getUserLocation();


            const userLatitude =
                position.coords.latitude;

            const userLongitude =
                position.coords.longitude;


            console.log(
                "User latitude:",
                userLatitude
            );

            console.log(
                "User longitude:",
                userLongitude
            );


            /* =============================================
               TRY DISTANCE CALCULATION
               ONLY FOR CLICKED RESTAURANT
               ============================================= */

            const restaurantCoordinates =
                getRestaurantCoordinates(card);


            if (restaurantCoordinates) {

                const distance =
                    calculateDistance(
                        userLatitude,
                        userLongitude,
                        restaurantCoordinates.latitude,
                        restaurantCoordinates.longitude
                    );


                if (distanceText) {

                    distanceText.textContent =
                        formatDistance(distance);

                }


                if (distanceResult) {
                    distanceResult.classList.add("available");
                }


                setPanel(
                    "Location detected",
                    `${restaurantName} is ${formatDistance(distance)} from your current location.`
                );

            } else {

                /*
                 * Coordinates are optional for directions.
                 * We can still use the restaurant's address
                 * with Google Maps.
                 */

                if (distanceText) {

                    distanceText.textContent =
                        "Location detected";

                }


                setPanel(
                    "Location detected",
                    `Opening directions to ${restaurantName}.`
                );

            }


            /* =============================================
               OPEN DIRECTIONS ONLY FOR THIS RESTAURANT
               ============================================= */

            if (restaurantAddress) {

                openDirections(
                    userLatitude,
                    userLongitude,
                    restaurantAddress
                );

            } else {

                throw new Error(
                    "Restaurant address is missing."
                );

            }


        } catch (error) {

            console.error(
                "Location error code:",
                error.code
            );

            console.error(
                "Location error message:",
                error.message
            );

            console.error(
                "Full location error:",
                error
            );


            if (distanceText) {
                distanceText.textContent =
                    "Distance unavailable";
            }


            if (distanceResult) {
                distanceResult.classList.remove("available");
            }


            /* =============================================
               PERMISSION DENIED
               ============================================= */

            if (error.code === 1) {

                showLocationError(
                    "Location permission was denied. Please allow location access in your browser settings and try again."
                );

            }


            /* =============================================
               POSITION UNAVAILABLE
               ============================================= */

            else if (error.code === 2) {

                showLocationError(
                    "Your location could not be determined. Please turn on Location/GPS on your phone and try again."
                );

            }


            /* =============================================
               TIMEOUT
               ============================================= */

            else if (error.code === 3) {

                showLocationError(
                    "Location request timed out. Please make sure Location/GPS is enabled and try again."
                );

            }


            /* =============================================
               OTHER ERROR
               ============================================= */

            else {

                showLocationError(
                    error.message ||
                    "Unable to detect your current location."
                );

            }

        } finally {

            card.classList.remove("locating");

            button.disabled = false;

        }

    }


    /* =====================================================
       BUTTON EVENTS
       ===================================================== */

    restaurantCards.forEach((card) => {

        const button =
            card.querySelector(".track-location");


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            () => {
                trackRestaurant(card, button);
            }
        );

    });


    /* =====================================================
       HERO IMAGE
       ===================================================== */

    const heroImage =
        document.querySelector(
            ".ragi-hero-image img"
        );


    if (
        heroImage &&
        !heroImage.complete
    ) {

        heroImage.addEventListener(
            "load",
            () => {
                heroImage.classList.add("loaded");
            },
            { once: true }
        );

    }

});