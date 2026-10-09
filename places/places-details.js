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

/* =========================================
   DISTANCE FROM VISITOR TO ANTARGANGE
========================================= */

const distanceButton = document.querySelector("#distanceButton");
const distanceResult = document.querySelector("#distanceResult");

// Approximate Antargange destination coordinates
const antargangeLocation = {
    latitude: 13.105,
    longitude: 78.132
};

if (distanceButton && distanceResult) {
    distanceButton.addEventListener("click", function () {

        if (!navigator.geolocation) {
            distanceResult.textContent =
                "Your browser does not support location access.";
            return;
        }

        distanceButton.disabled = true;
        distanceResult.textContent =
            "Getting your location...";

        navigator.geolocation.getCurrentPosition(
            function (position) {

                const userLatitude =
                    position.coords.latitude;

                const userLongitude =
                    position.coords.longitude;

                const toRadians = function (degrees) {
                    return degrees * Math.PI / 180;
                };

                const earthRadiusKm = 6371;

                const latitudeDifference = toRadians(
                    antargangeLocation.latitude - userLatitude
                );

                const longitudeDifference = toRadians(
                    antargangeLocation.longitude - userLongitude
                );

                const a =
                    Math.sin(latitudeDifference / 2) ** 2 +
                    Math.cos(toRadians(userLatitude)) *
                    Math.cos(toRadians(antargangeLocation.latitude)) *
                    Math.sin(longitudeDifference / 2) ** 2;

                const centralAngle =
                    2 * Math.atan2(
                        Math.sqrt(a),
                        Math.sqrt(1 - a)
                    );

                const distance =
                    earthRadiusKm * centralAngle;

                distanceResult.textContent =
                    "About " + distance.toFixed(1) +
                    " km away in a straight line.";

                distanceButton.disabled = false;
            },

            function (error) {

                if (error.code === error.PERMISSION_DENIED) {
                    distanceResult.textContent =
                        "Location permission denied. Allow location access to calculate distance.";
                } else if (error.code === error.TIMEOUT) {
                    distanceResult.textContent =
                        "Location request timed out. Please try again.";
                } else {
                    distanceResult.textContent =
                        "Unable to get your location. Please try again.";
                }

                distanceButton.disabled = false;
            },

            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 60000
            }
        );

    });
}
