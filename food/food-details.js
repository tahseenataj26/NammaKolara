/* =========================================================
   NAMMA KOLAR — RAGI MUDDE DETAIL PAGE

   Features:
   1. Scroll reveal
   2. Current user location
   3. Restaurant address geocoding
   4. Approximate straight-line distance
   5. Individual restaurant processing
   6. Google Maps directions
========================================================= */


document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".ragi-hero, .served-card, .restaurant-card, .district-note"
        );


    const restaurantCards =
        document.querySelectorAll(
            ".restaurant-card"
        );


    const locationPanel =
        document.getElementById(
            "locationPanel"
        );


    const locationTitle =
        document.getElementById(
            "locationTitle"
        );


    const locationMessage =
        document.getElementById(
            "locationMessage"
        );


    /* =====================================================
       DEBUG MESSAGE
    ===================================================== */

    console.log(
        "Namma Kolara food-details.js loaded successfully."
    );

    console.log(
        "Restaurant cards found:",
        restaurantCards.length
    );


    /* =====================================================
       REDUCED MOTION
    ===================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {

        revealElements.forEach(
            (element) => {

                element.classList.add(
                    "show"
                );

            }
        );

    } else {

        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "show"
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    root: null,

                    rootMargin:
                        "0px 0px -8% 0px",

                    threshold: 0.1
                }
            );


        revealElements.forEach(
            (element) => {

                observer.observe(
                    element
                );

            }
        );

    }


    /* =====================================================
       HAVERSINE DISTANCE

       This gives straight-line distance.

       It is NOT road/driving distance.
    ===================================================== */

    function calculateDistance(
        lat1,
        lon1,
        lat2,
        lon2
    ) {

        const earthRadius =
            6371;


        const toRadians =
            (degrees) =>
                degrees * Math.PI / 180;


        const latitudeDifference =
            toRadians(
                lat2 - lat1
            );


        const longitudeDifference =
            toRadians(
                lon2 - lon1
            );


        const a =
            Math.sin(
                latitudeDifference / 2
            ) ** 2 +

            Math.cos(
                toRadians(lat1)
            ) *

            Math.cos(
                toRadians(lat2)
            ) *

            Math.sin(
                longitudeDifference / 2
            ) ** 2;


        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );


        return earthRadius * c;

    }


    /* =====================================================
       FORMAT DISTANCE
    ===================================================== */

    function formatDistance(
        distance
    ) {

        if (
            distance < 1
        ) {

            return (
                Math.round(
                    distance * 1000
                ) +
                " m away"
            );

        }


        return (
            distance.toFixed(1) +
            " km away"
        );

    }


    /* =====================================================
       GET USER LOCATION
    ===================================================== */

    function getUserLocation() {

        return new Promise(
            (resolve, reject) => {

                if (
                    !navigator.geolocation
                ) {

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

                        timeout: 20000,

                        maximumAge: 0
                    }

                );

            }
        );

    }


    /* =====================================================
       LOCATION PANEL
    ===================================================== */

    function setPanel(
        title,
        message
    ) {

        if (
            locationPanel
        ) {

            locationPanel.classList.add(
                "active"
            );

        }


        if (
            locationTitle
        ) {

            locationTitle.textContent =
                title;

        }


        if (
            locationMessage
        ) {

            locationMessage.textContent =
                message;

        }

    }


    /* =====================================================
       GEOCODE RESTAURANT ADDRESS

       We use OpenStreetMap Nominatim.

       The restaurant address is supplied by the HTML card.

       No restaurant coordinates need to be manually
       inserted into JavaScript.
    ===================================================== */

    async function geocodeRestaurant(
        restaurantName,
        address
    ) {

        const cacheKey =
            "namma-kolar-" +
            restaurantName
                .toLowerCase()
                .replace(
                    /[^a-z0-9]+/g,
                    "-"
                );


        /* -------------------------------------------------
           SESSION CACHE
        ------------------------------------------------- */

        try {

            const cached =
                sessionStorage.getItem(
                    cacheKey
                );


            if (
                cached
            ) {

                const parsed =
                    JSON.parse(
                        cached
                    );


                if (
                    Number.isFinite(
                        parsed.latitude
                    ) &&

                    Number.isFinite(
                        parsed.longitude
                    )
                ) {

                    return parsed;

                }

            }

        } catch (error) {

            console.warn(
                "Could not read location cache:",
                error
            );

        }


        /* -------------------------------------------------
           BUILD SEARCH QUERY
        ------------------------------------------------- */

        const query =
            `${restaurantName}, ${address}, Kolar, Karnataka, India`;


        const apiURL =
            "https://nominatim.openstreetmap.org/search" +

            `?format=jsonv2` +

            `&q=${encodeURIComponent(query)}` +

            "&limit=1";


        /* -------------------------------------------------
           REQUEST
        ------------------------------------------------- */

        const response =
            await fetch(
                apiURL,
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Restaurant location service is unavailable."
            );

        }


        const results =
            await response.json();


        if (
            !Array.isArray(results) ||
            results.length === 0
        ) {

            throw new Error(
                "Restaurant location could not be found."
            );

        }


        const latitude =
            Number(
                results[0].lat
            );


        const longitude =
            Number(
                results[0].lon
            );


        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {

            throw new Error(
                "Invalid restaurant coordinates were returned."
            );

        }


        const result = {
            latitude,
            longitude
        };


        /* -------------------------------------------------
           SAVE CACHE
        ------------------------------------------------- */

        try {

            sessionStorage.setItem(
                cacheKey,
                JSON.stringify(result)
            );

        } catch (error) {

            console.warn(
                "Could not save location cache:",
                error
            );

        }


        return result;

    }


    /* =====================================================
       GOOGLE MAPS URL
    ===================================================== */

    function createGoogleMapsURL(
        userLatitude,
        userLongitude,
        restaurantAddress
    ) {

        const origin =
            `${userLatitude},${userLongitude}`;


        const params =
            new URLSearchParams({

                api: "1",

                origin: origin,

                destination:
                    restaurantAddress,

                travelmode: "driving"

            });


        return (
            "https://www.google.com/maps/dir/?" +
            params.toString()
        );

    }


    /* =====================================================
       CREATE DIRECTIONS BUTTON
    ===================================================== */

    function showDirectionsButton(
        card,
        mapsURL
    ) {

        let directionsContainer =
            card.querySelector(
                ".directions-container"
            );


        /* -------------------------------------------------
           CREATE CONTAINER
        ------------------------------------------------- */

        if (
            !directionsContainer
        ) {

            directionsContainer =
                document.createElement(
                    "div"
                );


            directionsContainer.className =
                "directions-container";


            const restaurantBottom =
                card.querySelector(
                    ".restaurant-bottom"
                );


            if (
                restaurantBottom
            ) {

                restaurantBottom.appendChild(
                    directionsContainer
                );

            } else {

                card.appendChild(
                    directionsContainer
                );

            }

        }


        /* -------------------------------------------------
           REMOVE OLD BUTTON
        ------------------------------------------------- */

        directionsContainer.innerHTML =
            "";


        /* -------------------------------------------------
           CREATE LINK
        ------------------------------------------------- */

        const directionsLink =
            document.createElement(
                "a"
            );


        directionsLink.className =
            "google-directions";


        directionsLink.href =
            mapsURL;


        directionsLink.target =
            "_blank";


        directionsLink.rel =
            "noopener noreferrer";


        directionsLink.innerHTML = `
            <span class="directions-icon">
                🗺️
            </span>

            <span>
                Get Directions
            </span>

            <span class="directions-arrow">
                ↗
            </span>
        `;


        directionsContainer.appendChild(
            directionsLink
        );

    }


    /* =====================================================
       SHOW ERROR
    ===================================================== */

    function showRestaurantError(
        card,
        message
    ) {

        const distanceText =
            card.querySelector(
                ".distance-text"
            );


        const distanceResult =
            card.querySelector(
                ".distance-result"
            );


        if (
            distanceText
        ) {

            distanceText.textContent =
                message;

        }


        if (
            distanceResult
        ) {

            distanceResult.classList.add(
                "available"
            );

        }

    }


    /* =====================================================
       TRACK ONE RESTAURANT
    ===================================================== */

    async function trackRestaurant(
        card,
        button
    ) {

        console.log(
            "Clicked restaurant:",
            card.dataset.restaurantName
        );


        /* -------------------------------------------------
           LOCK ONLY THIS BUTTON
        ------------------------------------------------- */

        button.disabled =
            true;


        card.classList.add(
            "locating"
        );


        /* -------------------------------------------------
           GET RESTAURANT DATA
        ------------------------------------------------- */

        const restaurantName =
            (
                card.dataset.restaurantName ||
                card.querySelector("h3")?.textContent ||
                "Restaurant"
            ).trim();


        const restaurantAddress =
            (
                card.dataset.address ||
                ""
            ).trim();


        const distanceResult =
            card.querySelector(
                ".distance-result"
            );


        const distanceText =
            card.querySelector(
                ".distance-text"
            );


        /* -------------------------------------------------
           REMOVE OLD DIRECTIONS
        ------------------------------------------------- */

        const oldDirections =
            card.querySelector(
                ".directions-container"
            );


        if (
            oldDirections
        ) {

            oldDirections.remove();

        }


        /* -------------------------------------------------
           CHECK ADDRESS
        ------------------------------------------------- */

        if (
            !restaurantAddress
        ) {

            showRestaurantError(
                card,
                "Address unavailable"
            );

            button.disabled =
                false;

            card.classList.remove(
                "locating"
            );

            return;

        }


        /* -------------------------------------------------
           LOADING MESSAGE
        ------------------------------------------------- */

        if (
            distanceText
        ) {

            distanceText.textContent =
                "Finding location...";

        }


        if (
            distanceResult
        ) {

            distanceResult.classList.add(
                "available"
            );

        }


        setPanel(
            "Finding your location",
            `Please allow location access to calculate your distance to ${restaurantName}.`
        );


        try {

            /* =============================================
               STEP 1
               GET USER LOCATION
            ============================================== */

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
               STEP 2
               GEOCODE RESTAURANT
            ============================================== */

            if (
                distanceText
            ) {

                distanceText.textContent =
                    "Finding restaurant...";

            }


            const restaurantLocation =
                await geocodeRestaurant(
                    restaurantName,
                    restaurantAddress
                );


            console.log(
                "Restaurant coordinates:",
                restaurantLocation
            );


            /* =============================================
               STEP 3
               CALCULATE DISTANCE
            ============================================== */

            const distance =
                calculateDistance(

                    userLatitude,

                    userLongitude,

                    restaurantLocation.latitude,

                    restaurantLocation.longitude

                );


            const formattedDistance =
                formatDistance(
                    distance
                );


            /* =============================================
               STEP 4
               SHOW DISTANCE ON SAME CARD
            ============================================== */

            if (
                distanceText
            ) {

                distanceText.textContent =
                    formattedDistance;

            }


            setPanel(
                "Location detected",
                `${restaurantName} is approximately ${formattedDistance} from your current location.`
            );


            /* =============================================
               STEP 5
               CREATE GOOGLE MAPS URL
            ============================================== */

            const mapsURL =
                createGoogleMapsURL(

                    userLatitude,

                    userLongitude,

                    restaurantAddress

                );


            /* =============================================
               STEP 6
               ADD GET DIRECTIONS TO SAME CARD
            ============================================== */

            showDirectionsButton(
                card,
                mapsURL
            );


            /* =============================================
               STEP 7
               CHANGE BUTTON TEXT
            ============================================== */

            const trackText =
                button.querySelector(
                    ".track-text"
                );


            if (
                trackText
            ) {

                trackText.textContent =
                    "Location Found";

            }


            button.classList.add(
                "location-found"
            );


        } catch (error) {

            console.error(
                "Restaurant location error:",
                error
            );


            /* =============================================
               RESET DISTANCE
            ============================================== */

            if (
                distanceText
            ) {

                distanceText.textContent =
                    "Distance unavailable";

            }


            /* =============================================
               GEOLOCATION ERRORS
            ============================================== */

            if (
                error &&
                error.code === 1
            ) {

                setPanel(
                    "Location permission denied",
                    "Please allow location access for this website in your browser settings and try again."
                );

                showRestaurantError(
                    card,
                    "Allow location access"
                );

            }


            else if (
                error &&
                error.code === 2
            ) {

                setPanel(
                    "Location unavailable",
                    "Your device could not determine your current location. Turn on Location/GPS and try again."
                );

                showRestaurantError(
                    card,
                    "Location unavailable"
                );

            }


            else if (
                error &&
                error.code === 3
            ) {

                setPanel(
                    "Location timed out",
                    "The location request took too long. Please try again."
                );

                showRestaurantError(
                    card,
                    "Try again"
                );

            }


            else {

                setPanel(
                    "Restaurant location unavailable",
                    error?.message ||
                    "We could not find this restaurant's location. Please try again."
                );

                showRestaurantError(
                    card,
                    "Location unavailable"
                );

            }

        }


        /* -------------------------------------------------
           UNLOCK THIS BUTTON
        ------------------------------------------------- */

        finally {

            button.disabled =
                false;


            card.classList.remove(
                "locating"
            );

        }

    }


    /* =====================================================
       BUTTON EVENTS
    ===================================================== */

    restaurantCards.forEach(
        (card) => {

            const button =
                card.querySelector(
                    ".track-location"
                );


            if (
                !button
            ) {

                console.warn(
                    "No location button found for:",
                    card
                );

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

        }
    );


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