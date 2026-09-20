/* =========================================================
   NAMMA KOLAR — RAGI MUDDE DETAIL
   Location + Distance
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const revealElements = document.querySelectorAll(
        ".ragi-hero, .served-card, .restaurant-card, .district-note"
    );

    const restaurantCards = document.querySelectorAll(
        ".restaurant-card"
    );

    const locationPanel =
        document.getElementById("locationPanel");

    const locationTitle =
        document.getElementById("locationTitle");

    const locationMessage =
        document.getElementById("locationMessage");


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    if (reducedMotion) {

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
    ===================================================== */

    function calculateDistance(
        latitude1,
        longitude1,
        latitude2,
        longitude2
    ) {

        const earthRadius = 6371;

        const degreesToRadians =
            (degrees) => degrees * Math.PI / 180;

        const latDifference =
            degreesToRadians(latitude2 - latitude1);

        const lonDifference =
            degreesToRadians(longitude2 - longitude1);

        const a =
            Math.sin(latDifference / 2) *
            Math.sin(latDifference / 2) +

            Math.cos(
                degreesToRadians(latitude1)
            ) *

            Math.cos(
                degreesToRadians(latitude2)
            ) *

            Math.sin(lonDifference / 2) *
            Math.sin(lonDifference / 2);

        const c =
            2 * Math.atan2(
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
       GEOCODE RESTAURANT
       OpenStreetMap Nominatim
    ===================================================== */

    async function geocodeRestaurant(address) {

        const url =
            "https://nominatim.openstreetmap.org/search?" +
            new URLSearchParams({
                q: address,
                format: "json",
                limit: "1",
                countrycodes: "in"
            });


        const response = await fetch(url, {
            headers: {
                "Accept": "application/json"
            }
        });


        if (!response.ok) {
            throw new Error("Unable to find restaurant location.");
        }


        const results = await response.json();


        if (!results.length) {
            throw new Error("Restaurant location not found.");
        }


        return {
            latitude: Number(results[0].lat),
            longitude: Number(results[0].lon)
        };

    }


    /* =====================================================
       GET USER LOCATION
    ===================================================== */

    function getUserLocation() {

        return new Promise(
            (resolve, reject) => {

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
                        timeout: 10000,
                        maximumAge: 300000
                    }
                );

            }
        );

    }


    /* =====================================================
       SHOW ERROR
    ===================================================== */

    function showLocationError(message) {

        locationPanel.classList.remove("active");

        locationTitle.textContent =
            "Location unavailable";

        locationMessage.textContent =
            message;

    }


    /* =====================================================
       UPDATE RESTAURANT CARD
    ===================================================== */

    function updateRestaurantCard(
        card,
        distance
    ) {

        const distanceResult =
            card.querySelector(".distance-result");

        const distanceText =
            card.querySelector(".distance-text");

        distanceText.textContent =
            formatDistance(distance);

        distanceResult.classList.add(
            "available"
        );

    }


    /* =====================================================
       TRACK LOCATION
    ===================================================== */

    async function trackLocation() {

        const buttons =
            document.querySelectorAll(
                ".track-location"
            );


        buttons.forEach((button) => {
            button.disabled = true;
        });


        restaurantCards.forEach((card) => {
            card.classList.add("locating");
        });


        locationPanel.classList.add("active");

        locationTitle.textContent =
            "Finding your location...";

        locationMessage.textContent =
            "Please allow location access in your browser.";


        try {

            /* ---------------------------------------------
               USER LOCATION
            --------------------------------------------- */

            const position =
                await getUserLocation();


            const userLatitude =
                position.coords.latitude;

            const userLongitude =
                position.coords.longitude;


            locationTitle.textContent =
                "Your location detected";

            locationMessage.textContent =
                "Calculating distance to nearby food spots...";


            /* ---------------------------------------------
               GEOCODE RESTAURANTS
            --------------------------------------------- */

            const restaurantPromises =
                Array.from(
                    restaurantCards
                ).map(
                    async (card) => {

                        const address =
                            card.dataset.address;

                        try {

                            const coordinates =
                                await geocodeRestaurant(
                                    address
                                );


                            const distance =
                                calculateDistance(
                                    userLatitude,
                                    userLongitude,
                                    coordinates.latitude,
                                    coordinates.longitude
                                );


                            updateRestaurantCard(
                                card,
                                distance
                            );


                            return {
                                card,
                                distance
                            };

                        } catch (error) {

                            const distanceText =
                                card.querySelector(
                                    ".distance-text"
                                );

                            distanceText.textContent =
                                "Location unavailable";

                            return null;
                        }

                    }
                );


            const results =
                await Promise.all(
                    restaurantPromises
                );


            /* ---------------------------------------------
               SORT BY DISTANCE
            --------------------------------------------- */

            const validResults =
                results
                    .filter(Boolean)
                    .sort(
                        (a, b) =>
                            a.distance - b.distance
                    );


            /* ---------------------------------------------
               MARK NEAREST
            --------------------------------------------- */

            restaurantCards.forEach((card) => {

                const oldBadge =
                    card.querySelector(
                        ".nearest-badge"
                    );

                if (oldBadge) {
                    oldBadge.remove();
                }

            });


            if (validResults.length) {

                const nearestCard =
                    validResults[0].card;


                const badge =
                    document.createElement(
                        "span"
                    );

                badge.className =
                    "nearest-badge";

                badge.textContent =
                    "NEAREST TO YOU";


                const top =
                    nearestCard.querySelector(
                        ".restaurant-top"
                    );

                top.appendChild(badge);


                locationTitle.textContent =
                    "Distances calculated";

                locationMessage.textContent =
                    `${validResults.length} restaurant location${validResults.length > 1 ? "s" : ""} found near you.`;

            } else {

                locationTitle.textContent =
                    "Restaurant locations unavailable";

                locationMessage.textContent =
                    "We couldn't calculate distances right now.";

            }


        } catch (error) {

            console.error(
                "Location error:",
                error
            );


            if (error.code === 1) {

                showLocationError(
                    "Location permission was denied. Please allow location access and try again."
                );

            } else if (error.code === 2) {

                showLocationError(
                    "Your location could not be determined. Please try again."
                );

            } else if (error.code === 3) {

                showLocationError(
                    "Location request timed out. Please try again."
                );

            } else {

                showLocationError(
                    error.message ||
                    "Unable to detect your location."
                );

            }

        } finally {

            restaurantCards.forEach((card) => {
                card.classList.remove("locating");
            });


            buttons.forEach((button) => {
                button.disabled = false;
            });

        }

    }


    /* =====================================================
       BUTTON EVENTS
    ===================================================== */

    restaurantCards.forEach((card) => {

        const button =
            card.querySelector(
                ".track-location"
            );


        button.addEventListener(
            "click",
            trackLocation
        );

    });


    /* =====================================================
       HERO IMAGE
    ===================================================== */

    const heroImage =
        document.querySelector(
            ".ragi-hero-image img"
        );


    if (heroImage && !heroImage.complete) {

        heroImage.addEventListener(
            "load",
            () => {
                heroImage.classList.add("loaded");
            },
            { once: true }
        );

    }

});