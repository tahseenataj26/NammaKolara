
/* =========================================================
   NAMMA KOLAR
   STAY PAGE JAVASCRIPT
========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           ELEMENTS
        ================================================== */

        const track =
            document.querySelector(
                ".stay-track"
            );


        const sourceCards =
            Array.from(
                track.querySelectorAll(
                    ".stay-card"
                )
            );


        const categoryButtons =
            Array.from(
                document.querySelectorAll(
                    ".stay-category"
                )
            );


        const searchInput =
            document.querySelector(
                "#staySearch"
            );


        const searchWrapper =
            document.querySelector(
                ".stay-search-wrapper"
            );


        const clearSearchButton =
            document.querySelector(
                "#searchClear"
            );


        const noResults =
            document.querySelector(
                "#stayNoResults"
            );


        const resetButton =
            document.querySelector(
                "#resetResults"
            );


        const marquee =
            document.querySelector(
                ".stay-marquee"
            );


        /* =================================================
           STATE
        ================================================== */

        let currentCategory =
            "all";


        let currentSearch =
            "";


        let marqueePaused =
            false;


        let currentFilteredCards =
            [];


        /* =================================================
           SCROLL REVEAL
        ================================================== */

        const revealObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "is-visible"
                                );

                            } else {

                                /*
                                 * Remove the class when
                                 * the element leaves the
                                 * viewport.
                                 *
                                 * This makes the animation
                                 * happen again when the
                                 * user scrolls back.
                                 */

                                entry.target.classList.remove(
                                    "is-visible"
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.12,

                    rootMargin:
                        "0px 0px -35px 0px"
                }
            );


        function observeRevealElement(
            element
        ) {

            if (!element) {

                return;

            }


            revealObserver.observe(
                element
            );

        }


        /*
         * Observe all static
         * scroll elements.
         */

        document
            .querySelectorAll(
                ".scroll-reveal"
            )
            .forEach(
                observeRevealElement
            );


        /* =================================================
           NORMALIZE TEXT
        ================================================== */

        function normalizeText(
            text
        ) {

            return String(text || "")
                .toLowerCase()
                .trim();

        }


        /* =================================================
           FILTER
        ================================================== */

        function getFilteredCards() {

            const search =
                normalizeText(
                    currentSearch
                );


            return sourceCards.filter(
                (card) => {

                    const category =
                        normalizeText(
                            card.dataset.category
                        );


                    const searchableText =
                        normalizeText(
                            `
                            ${card.dataset.search || ""}
                            ${card.textContent || ""}
                            `
                        );


                    const matchesCategory =
                        currentCategory === "all" ||
                        category === currentCategory;


                    const matchesSearch =
                        search === "" ||
                        searchableText.includes(
                            search
                        );


                    return (
                        matchesCategory &&
                        matchesSearch
                    );

                }
            );

        }


        /* =================================================
           CARD CLONE
        ================================================== */

        function createCardClone(
            card
        ) {

            const clone =
                card.cloneNode(true);


            /*
             * Add scroll reveal class
             * to dynamically created cards.
             */

            clone.classList.add(
                "scroll-reveal"
            );


            return clone;

        }


        /* =================================================
           CREATE CARD SET
        ================================================== */

        function createCardSet(
            filteredCards
        ) {

            const set =
                document.createElement(
                    "div"
                );


            set.className =
                "stay-track-set";


            /*
             * Make the set wide enough
             * to cover the screen.
             *
             * This prevents empty spaces
             * when the user selects one
             * category.
             */

            const requiredWidth =
                window.innerWidth + 500;


            const approximateCardWidth =
                window.innerWidth <= 420
                    ? 271
                    : window.innerWidth <= 700
                        ? 291
                        : window.innerWidth <= 900
                            ? 311
                            : 335;


            const requiredCopies =
                Math.max(
                    1,
                    Math.ceil(
                        requiredWidth /
                        (
                            filteredCards.length *
                            approximateCardWidth
                        )
                    )
                );


            /*
             * Extra safety.
             */

            const copies =
                Math.min(
                    10,
                    Math.max(
                        1,
                        requiredCopies
                    )
                );


            for (
                let copy = 0;
                copy < copies;
                copy++
            ) {

                filteredCards.forEach(
                    (card) => {

                        const clone =
                            createCardClone(
                                card
                            );


                        set.appendChild(
                            clone
                        );

                    }
                );

            }


            return set;

        }


        /* =================================================
           BUILD MARQUEE
        ================================================== */

        function buildMarquee(
            filteredCards
        ) {

            currentFilteredCards =
                filteredCards;


            /*
             * Clear existing marquee.
             */

            track.innerHTML = "";


            /* ---------------------------------------------
               NO RESULTS
            --------------------------------------------- */

            if (
                filteredCards.length === 0
            ) {

                track.classList.remove(
                    "is-moving"
                );


                noResults.classList.add(
                    "active"
                );


                return;

            }


            noResults.classList.remove(
                "active"
            );


            /* ---------------------------------------------
               FIRST SET
            --------------------------------------------- */

            const firstSet =
                createCardSet(
                    filteredCards
                );


            /* ---------------------------------------------
               SECOND SET
            --------------------------------------------- */

            const secondSet =
                firstSet.cloneNode(
                    true
                );


            /*
             * Remove the current
             * scroll state from clones.
             */

            secondSet
                .querySelectorAll(
                    ".stay-card"
                )
                .forEach(
                    (card) => {

                        card.classList.remove(
                            "is-visible"
                        );

                    }
                );


            /* ---------------------------------------------
               ADD SETS
            --------------------------------------------- */

            track.appendChild(
                firstSet
            );


            track.appendChild(
                secondSet
            );


            /* ---------------------------------------------
               SPEED
            --------------------------------------------- */

            const cardCount =
                firstSet.children.length;


            const speed =
                Math.max(
                    28,
                    Math.min(
                        60,
                        cardCount * 4
                    )
                );


            track.style.setProperty(
                "--marquee-speed",
                `${speed}s`
            );


            /* ---------------------------------------------
               RESTART ANIMATION
            --------------------------------------------- */

            track.classList.remove(
                "is-moving"
            );


            /*
             * Force browser reflow.
             */

            void track.offsetWidth;


            if (
                !marqueePaused
            ) {

                track.classList.add(
                    "is-moving"
                );

            }


            /* ---------------------------------------------
               OBSERVE CARDS
            --------------------------------------------- */

            track
                .querySelectorAll(
                    ".scroll-reveal"
                )
                .forEach(
                    observeRevealElement
                );


            /*
             * Because the cards are moving,
             * reveal them naturally once they
             * enter the viewport.
             */

        }


        /* =================================================
           APPLY FILTERS
        ================================================== */

        function applyFilters() {

            const filteredCards =
                getFilteredCards();


            buildMarquee(
                filteredCards
            );

        }


        /* =================================================
           CATEGORY BUTTONS
        ================================================== */

        categoryButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        currentCategory =
                            button.dataset.category;


                        categoryButtons.forEach(
                            (item) => {

                                const isActive =
                                    item === button;


                                item.classList.toggle(
                                    "active",
                                    isActive
                                );


                                item.setAttribute(
                                    "aria-selected",
                                    String(
                                        isActive
                                    )
                                );

                            }
                        );


                        applyFilters();

                    }
                );

            }
        );


        /* =================================================
           SEARCH INPUT
        ================================================== */

        searchInput.addEventListener(
            "input",
            () => {

                currentSearch =
                    searchInput.value;


                searchWrapper.classList.toggle(
                    "has-value",
                    searchInput.value.trim() !== ""
                );


                applyFilters();

            }
        );


        /* =================================================
           CLEAR SEARCH
        ================================================== */

        clearSearchButton.addEventListener(
            "click",
            () => {

                searchInput.value =
                    "";


                currentSearch =
                    "";


                searchWrapper.classList.remove(
                    "has-value"
                );


                searchInput.focus();


                applyFilters();

            }
        );


        /* =================================================
           ESCAPE
        ================================================== */

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape" &&
                    searchInput.value
                ) {

                    searchInput.value =
                        "";


                    currentSearch =
                        "";


                    searchWrapper.classList.remove(
                        "has-value"
                    );


                    applyFilters();

                }

            }
        );


        /* =================================================
           RESET
        ================================================== */

        resetButton.addEventListener(
            "click",
            () => {

                currentCategory =
                    "all";


                currentSearch =
                    "";


                searchInput.value =
                    "";


                searchWrapper.classList.remove(
                    "has-value"
                );


                categoryButtons.forEach(
                    (button) => {

                        const active =
                            button.dataset.category ===
                            "all";


                        button.classList.toggle(
                            "active",
                            active
                        );


                        button.setAttribute(
                            "aria-selected",
                            String(
                                active
                            )
                        );

                    }
                );


                applyFilters();

            }
        );


        /* =================================================
           MOUSE PAUSE
        ================================================== */

        marquee.addEventListener(
            "mouseenter",
            () => {

                marqueePaused =
                    true;


                track.style.animationPlayState =
                    "paused";

            }
        );


        marquee.addEventListener(
            "mouseleave",
            () => {

                marqueePaused =
                    false;


                track.style.animationPlayState =
                    "running";

            }
        );


        /* =================================================
           TOUCH PAUSE
        ================================================== */

        marquee.addEventListener(
            "touchstart",
            () => {

                marqueePaused =
                    true;


                track.style.animationPlayState =
                    "paused";

            },
            {
                passive: true
            }
        );


        marquee.addEventListener(
            "touchend",
            () => {

                marqueePaused =
                    false;


                track.style.animationPlayState =
                    "running";

            },
            {
                passive: true
            }
        );


        /* =================================================
           PAGE VISIBILITY
        ================================================== */

        document.addEventListener(
            "visibilitychange",
            () => {

                if (
                    document.hidden
                ) {

                    track.style.animationPlayState =
                        "paused";

                } else if (
                    !marqueePaused &&
                    currentFilteredCards.length > 0
                ) {

                    track.style.animationPlayState =
                        "running";

                }

            }
        );


        /* =================================================
           PREVENT IMAGE DRAG
        ================================================== */

        document.addEventListener(
            "dragstart",
            (event) => {

                if (
                    event.target.tagName ===
                    "IMG"
                ) {

                    event.preventDefault();

                }

            }
        );


        /* =================================================
           INITIAL LOAD
        ================================================== */

        applyFilters();

    }
);