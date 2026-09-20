// =========================================
// NAMMA KOLAR - PLACES SEARCH & FILTER
// =========================================

// Get elements
const searchInput = document.getElementById("placeSearch");
const categoryButtons = document.querySelectorAll(".category-btn");
const placeCards = document.querySelectorAll(".place-card");
const placesGrid = document.querySelector(".places-grid");

// Current selected category
let selectedCategory = "All";


// =========================================
// FILTER PLACES
// =========================================

function filterPlaces() {

    const searchText = searchInput.value.toLowerCase().trim();

    let visibleCount = 0;

    placeCards.forEach(card => {

        // Get card content
        const cardText = card.textContent.toLowerCase();

        const category = card
            .querySelector(".place-category")
            .textContent
            .toLowerCase()
            .trim();


        // Search match
        const matchesSearch =
            cardText.includes(searchText);


        // Category match
        let matchesCategory = false;

        if (selectedCategory === "All") {

            matchesCategory = true;

        } else {

            matchesCategory =
                categoryMatches(category, selectedCategory);
        }


        // Show / hide card
        if (matchesSearch && matchesCategory) {

            card.style.display = "flex";

            visibleCount++;

        } else {

            card.style.display = "none";
        }

    });


    showNoResults(visibleCount);
}


// =========================================
// CATEGORY MATCHING
// =========================================

function categoryMatches(cardCategory, selectedCategory) {

    if (cardCategory === selectedCategory.toLowerCase()) {
        return true;
    }

    // Handle your existing mixed category names
    if (
        selectedCategory === "Temples" &&
        cardCategory.includes("temple")
    ) {
        return true;
    }

    if (
        selectedCategory === "Historical Places" &&
        cardCategory.includes("historical")
    ) {
        return true;
    }

    if (
        selectedCategory === "Tourist Places" &&
        cardCategory.includes("tourist")
    ) {
        return true;
    }

    if (
        selectedCategory === "Heritage Locations" &&
        cardCategory.includes("heritage")
    ) {
        return true;
    }

    if (
        selectedCategory === "Landmarks" &&
        cardCategory.includes("landmark")
    ) {
        return true;
    }

    return false;
}


// =========================================
// NO RESULTS MESSAGE
// =========================================

function showNoResults(visibleCount) {

    let message = document.querySelector(".no-results");

    if (visibleCount === 0) {

        if (!message) {

            message = document.createElement("p");

            message.className = "no-results";

            message.textContent =
                "No places found. Try another search or category.";

            placesGrid.appendChild(message);
        }

    } else {

        if (message) {
            message.remove();
        }
    }
}


// =========================================
// SEARCH EVENT
// =========================================

searchInput.addEventListener("input", filterPlaces);


// =========================================
// CATEGORY EVENT
// =========================================

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active from all buttons
        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });


        // Add active to clicked button
        button.classList.add("active");


        // Store selected category
        selectedCategory = button.textContent.trim();


        // Filter places
        filterPlaces();

    });

});
// =========================================
// PLACES PAGE SCROLL ANIMATION
// =========================================

const placesIntro = document.querySelector(".places-intro");
const placeCardsForAnimation = document.querySelectorAll(".place-card");

const placesObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }
        });
    },
    { threshold: 0.2 }
);

if (placesIntro) {
    placesObserver.observe(placesIntro);
}

placeCardsForAnimation.forEach((card) => {
    placesObserver.observe(card);
});