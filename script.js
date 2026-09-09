const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const closeMenu = document.querySelector(".close-menu");


/* ========================================= */
/*              MOBILE MENU                  */
/* ========================================= */

if (menuToggle && mobileMenu) {

    menuToggle.addEventListener("click", function() {
        mobileMenu.classList.toggle("active");
    });

}

if (closeMenu && mobileMenu) {

    closeMenu.addEventListener("click", function() {
        mobileMenu.classList.remove("active");
    });

}


/* ========================================= */
/*          ABOUT SCROLL ANIMATION            */
/* ========================================= */

const aboutContent = document.querySelector(".about-content");

const aboutObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }

        });

    },
    {
        threshold: 0.2
    }
);

if (aboutContent) {
    aboutObserver.observe(aboutContent);
}


/* ========================================= */
/*          EXPLORE CARD ANIMATION            */
/* ========================================= */

const exploreCards = document.querySelectorAll(".explore-card");

const exploreObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }

        });

    },
    {
        threshold: 0.2
    }
);

exploreCards.forEach((card) => {
    exploreObserver.observe(card);
});


/* ========================================= */
/*          EXPLORE HEADING ANIMATION         */
/* ========================================= */

const exploreHeading = document.querySelector(".explore-heading");

const headingObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }

        });

    },
    {
        threshold: 0.3
    }
);

if (exploreHeading) {
    headingObserver.observe(exploreHeading);
}


/* ========================================= */
/*              UPDATE FILTERS               */
/* ========================================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const updateItems = document.querySelectorAll(".update-item");

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        /* Remove active state from all buttons */
        filterButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        /* Add active state to clicked button */
        button.classList.add("active");

        /* Get selected category */
        const selectedFilter = button.textContent.trim();

        updateItems.forEach((item) => {

            const category = item.dataset.category;

            if (
                selectedFilter === "All" ||
                (selectedFilter === "Govt Notices" && category === "govt") ||
                (selectedFilter === "Weather" && category === "weather") ||
                (selectedFilter === "Mandi Prices" && category === "mandi") ||
                (selectedFilter === "Transport" && category === "transport")
            ) {

                item.style.display = "grid";

            } else {

                item.style.display = "none";

            }

        });

    });

});


/* ========================================= */
/*          UPDATES HEADING ANIMATION         */
/* ========================================= */

const updatesHeading = document.querySelector(".updates-heading");

const updatesHeadingObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }

        });

    },
    {
        threshold: 0.3
    }
);

if (updatesHeading) {
    updatesHeadingObserver.observe(updatesHeading);
}


/* ========================================= */
/*            UPDATE ITEM ANIMATION           */
/* ========================================= */

const updateObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }

        });

    },
    {
        threshold: 0.2
    }
);

updateItems.forEach((item) => {
    updateObserver.observe(item);
});


/* ========================================= */
/*             EVENTS ANIMATION               */
/* ========================================= */

const eventsHeading = document.querySelector(".events-heading");
const eventCards = document.querySelectorAll(".event-card");


const eventsHeadingObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }

        });

    },
    {
        threshold: 0.3
    }
);

if (eventsHeading) {
    eventsHeadingObserver.observe(eventsHeading);
}


const eventCardsObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }

        });

    },
    {
        threshold: 0.2
    }
);

eventCards.forEach((card) => {
    eventCardsObserver.observe(card);
});
/* ========================================= */
/*            REPORT ANIMATION                */
/* ========================================= */

const reportSection = document.querySelector(".report-section");
const reportContent = document.querySelector(".report-content");
const reportVisual = document.querySelector(".report-visual");

const reportObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                /* Start animation */
                if (reportContent) {
                    reportContent.classList.add("show");
                }

                if (reportVisual) {
                    reportVisual.classList.add("show");
                }

            } else {

                /* Reset animation */
                if (reportContent) {
                    reportContent.classList.remove("show");
                }

                if (reportVisual) {
                    reportVisual.classList.remove("show");
                }

            }

        });

    },
    {
        threshold: 0.2
    }
);

if (reportSection) {
    reportObserver.observe(reportSection);
}
/* HOME SCROLL ANIMATION */

const heroSection = document.querySelector(".hero");

const heroObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("home-visible");
            } else {
                entry.target.classList.remove("home-visible");
            }

        });

    },
    {
        threshold: 0.35
    }
);

if (heroSection) {
    heroObserver.observe(heroSection);
}
// =============================
//       KNOW KOLAR FAQ
// =============================

const knowKolarQuestions =
    document.querySelectorAll(".know-kolar-question");

knowKolarQuestions.forEach((question) => {

    question.addEventListener("click", () => {

        const item =
            question.closest(".know-kolar-item");

        document
            .querySelectorAll(".know-kolar-item")
            .forEach((otherItem) => {

                if (otherItem !== item) {
                    otherItem.classList.remove("active");
                }

            });

        item.classList.toggle("active");

    });

});
// =============================
//     KNOW KOLAR ANIMATION
// =============================

const knowKolarHeading =
    document.querySelector(".know-kolar-heading");

const knowKolarItems =
    document.querySelectorAll(".know-kolar-item");

const knowKolarObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }

        });

    },
    {
        threshold: 0.2
    }
);

if (knowKolarHeading) {
    knowKolarObserver.observe(knowKolarHeading);
}

knowKolarItems.forEach((item) => {
    knowKolarObserver.observe(item);
});