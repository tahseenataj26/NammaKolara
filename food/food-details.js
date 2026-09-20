/* =========================================================
   NAMMA KOLAR — RAGI MUDDE DETAIL PAGE
   Location + Distance
   Coordinate-Based Version
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
       DISTANCE CALCULATION (Haversine formula)
       Straight-line distance, not road distance.
    ===================================================== */
 
    function calculateDistance(lat1, lon1, lat2, lon2) {
 
        const earthRadius = 6371; // km
 
        const toRadians = (degrees) => degrees * Math.PI / 180;
 
        const latDiff = toRadians(lat2 - lat1);
        const lonDiff = toRadians(lon2 - lon1);
 
        const a =
            Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
            Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
 
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
                reject(new Error("Location is not supported by this browser."));
                return;
            }
 
            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 60000
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
        setPanel("Location unavailable", message);
    }
 
 
    /* =====================================================
       CARD HELPERS
    ===================================================== */
 
    function setCardDistanceText(card, text, available) {
 
        const distanceResult = card.querySelector(".distance-result");
        const distanceText = card.querySelector(".distance-text");
 
        if (distanceText) {
            distanceText.textContent = text;
        }
 
        if (distanceResult) {
            distanceResult.classList.toggle("available", Boolean(available));
        }
 
    }
 
    function resetDistanceCards() {
 
        restaurantCards.forEach((card) => {
            setCardDistanceText(card, "Calculating...", false);
        });
 
    }
 
 
    /* =====================================================
       READ RESTAURANT COORDINATES
       Empty / missing / invalid values return null.
       (Number("") is 0, so empty values must be caught
       BEFORE converting, otherwise the coordinates become
       0,0 and the distance is thousands of km.)
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
            latitude < -90 || latitude > 90 ||
            longitude < -180 || longitude > 180
        ) {
            return null;
        }
 
        return { latitude, longitude };
 
    }
 
 
    /* =====================================================
       TRACK LOCATION
    ===================================================== */
 
    async function trackLocation() {
 
        const buttons = document.querySelectorAll(".track-location");
 
        buttons.forEach((button) => {
            button.disabled = true;
        });
 
        restaurantCards.forEach((card) => {
            card.classList.add("locating");
        });
 
        setPanel(
            "Finding your location...",
            "Please allow location access in your browser."
        );
 
        resetDistanceCards();
 
        try {
 
            /* ---------- GET USER GPS ---------- */
 
            const position = await getUserLocation();
 
            const userLatitude = position.coords.latitude;
            const userLongitude = position.coords.longitude;
 
            setPanel(
                "Your location detected",
                "Calculating distances..."
            );
 
            /* ---------- CALCULATE DISTANCES ----------
               No API, no geocoding, no network request. */
 
            let validRestaurantCount = 0;
 
            restaurantCards.forEach((card) => {
 
                const coordinates = getRestaurantCoordinates(card);
 
                if (!coordinates) {
                    setCardDistanceText(card, "Coordinates not added", false);
                    return;
                }
 
                const distance = calculateDistance(
                    userLatitude,
                    userLongitude,
                    coordinates.latitude,
                    coordinates.longitude
                );
 
                setCardDistanceText(card, formatDistance(distance), true);
 
                validRestaurantCount++;
 
            });
 
            /* ---------- RESULT MESSAGE ---------- */
 
            if (validRestaurantCount > 0) {
 
                setPanel(
                    "Distances calculated",
                    `${validRestaurantCount} restaurant location${
                        validRestaurantCount > 1 ? "s" : ""
                    } calculated from your location.`
                );
 
            } else {
 
                setPanel(
                    "Restaurant locations unavailable",
                    "Restaurant coordinates have not been added yet."
                );
 
            }
 
        } catch (error) {
 
            console.error("Location error:", error);
 
            /* Reset the cards so they don't stay on "Calculating..." */
            restaurantCards.forEach((card) => {
                setCardDistanceText(card, "Distance unavailable", false);
            });
 
            if (error.code === 1) {
 
                showLocationError(
                    "Location permission was denied. Please allow location access and try again."
                );
 
            } else if (error.code === 2) {
 
                showLocationError(
                    "Your location could not be determined. Please check your device location settings and try again."
                );
 
            } else if (error.code === 3) {
 
                showLocationError(
                    "Location request timed out. Please try again."
                );
 
            } else {
 
                showLocationError(
                    error.message || "Unable to detect your location."
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
 
        const button = card.querySelector(".track-location");
 
        if (!button) {
            return;
        }
 
        button.addEventListener("click", trackLocation);
 
    });
 
 
    /* =====================================================
       HERO IMAGE
    ===================================================== */
 
    const heroImage = document.querySelector(".ragi-hero-image img");
 
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
 