const D = [

    {
        i: "🏥",

        t: "Hospitals & Healthcare",

        d: "Find hospitals, clinics, health centres and pharmacies across Kolar district.",

        c: [
            "Hospitals",
            "Clinics",
            "Health centres",
            "Pharmacies"
        ],

        l: "Explore Healthcare",

        h: "hospital.html"
    },


    {
        i: "🎓",

        t: "Education",

        d: "Discover schools, colleges, PU institutions and other educational facilities.",

        c: [
            "Schools",
            "Colleges",
            "PU institutions"
        ],

        l: "Explore Education",

        h: "#education"
    },


    {
        i: "🏛️",

        t: "Government Services",

        d: "Find government offices, post offices, courts, legal services and citizen facilities.",

        c: [
            "Government offices",
            "Post offices",
            "Courts",
            "Legal services"
        ],

        l: "Explore Government",

        h: "#government"
    },


    {
        i: "🏦",

        t: "Banks & ATMs",

        d: "Find banks, ATMs and other essential financial services near you.",

        c: [
            "Banks",
            "ATMs",
            "Financial services"
        ],

        l: "Explore Banking",

        h: "#banking"
    },


    {
        i: "🚌",

        t: "Transport",

        d: "Find bus stations, railway stations and important transport facilities.",

        c: [
            "Bus stations",
            "Railway stations"
        ],

        l: "Explore Transport",

        h: "#transport"
    },


    {
        i: "💧",

        t: "Public Utilities",

        d: "Find electricity, water and other essential public utility services.",

        c: [
            "Electricity",
            "Water"
        ],

        l: "Explore Utilities",

        h: "#utilities"
    }

];


const tabs =
    document.getElementById("tabs");


const panel =
    document.getElementById("panel");


/* ================================
   SHOW SERVICE
================================ */

function show(n) {

    [...tabs.children].forEach(
        (button, index) => {

            button.setAttribute(
                "aria-selected",
                index === n
            );

        }
    );


    const x = D[n];


    /* Restart animation */

    panel.style.animation = "none";

    panel.offsetHeight;

    panel.style.animation = "";


    /* Update panel */

    panel.innerHTML = `

        <div class="big">
            ${x.i}
        </div>

        <h2>
            ${x.t}
        </h2>

        <p>
            ${x.d}
        </p>

        <div class="chips">

            ${x.c
                .map(
                    service =>
                        `<span>${service}</span>`
                )
                .join("")
            }

        </div>

        <a
            class="cta"
            href="${x.h}"
        >
            ${x.l} →
        </a>

    `;
}


/* ================================
   CREATE TABS
================================ */

D.forEach(
    (x, n) => {

        const button =
            document.createElement("button");


        button.className =
            "tab";


        button.setAttribute(
            "role",
            "tab"
        );


        button.setAttribute(
            "aria-selected",
            "false"
        );


        button.innerHTML = `

            <span class="t-ico">
                ${x.i}
            </span>

            ${x.t}

        `;


        /* CLICK */

        button.onclick = () => {

            show(n);

        };


        /* KEYBOARD */

        button.onkeydown = event => {

            if (
                event.key === "ArrowDown" ||
                event.key === "ArrowRight"
            ) {

                event.preventDefault();


                const next =
                    (n + 1) % D.length;


                show(next);


                tabs.children[next].focus();

            }


            if (
                event.key === "ArrowUp" ||
                event.key === "ArrowLeft"
            ) {

                event.preventDefault();


                const previous =
                    (n + D.length - 1) %
                    D.length;


                show(previous);


                tabs.children[previous].focus();

            }

        };


        tabs.appendChild(button);

    }
);


/* FIRST SERVICE */

show(0);


/* ================================
   MOBILE NAVIGATION
================================ */

const menuToggle =
    document.querySelector(
        ".menu-toggle"
    );


const mobileMenu =
    document.querySelector(
        ".mobile-menu"
    );


const closeMenu =
    document.querySelector(
        ".close-menu"
    );


/* OPEN */

if (
    menuToggle &&
    mobileMenu
) {

    menuToggle.addEventListener(
        "click",
        function () {

            mobileMenu.classList.add(
                "active"
            );


            menuToggle.setAttribute(
                "aria-expanded",
                "true"
            );


            mobileMenu.setAttribute(
                "aria-hidden",
                "false"
            );

        }
    );

}


/* CLOSE */

if (
    closeMenu &&
    mobileMenu
) {

    closeMenu.addEventListener(
        "click",
        function () {

            mobileMenu.classList.remove(
                "active"
            );


            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );


            mobileMenu.setAttribute(
                "aria-hidden",
                "true"
            );

        }
    );

}


/* CLOSE AFTER LINK CLICK */

if (mobileMenu) {

    const mobileLinks =
        mobileMenu.querySelectorAll("a");


    mobileLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    mobileMenu.classList.remove(
                        "active"
                    );


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

                }
            );

        }
    );

}