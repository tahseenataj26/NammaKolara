document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ELEMENTS
    ========================================== */

    const options = document.querySelectorAll(".problem-option");

    const nextStep1 = document.getElementById("nextStep");
    const nextStep2 = document.getElementById("nextStep2");

    const backStep2 = document.getElementById("backStep");
    const backStep3 = document.getElementById("backStep3");

    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");

    const progress = document.querySelector(".form-progress");
    const progressSteps = document.querySelectorAll(".progress-step");
    const progressLines = document.querySelectorAll(".progress-line");

    const locationInput = document.getElementById("problemLocation");
    const useLocationButton = document.getElementById("useLocation");

    const landmarkInput =
        document.getElementById("problemLandmark");

    const description =
        document.getElementById("problemDescription");

    const descriptionCount =
        document.getElementById("descriptionCount");

    const photoUpload =
        document.getElementById("photoUpload");

    const problemPhoto =
        document.getElementById("problemPhoto");

    const photoPreview =
        document.getElementById("photoPreview");

    const removePhoto =
        document.getElementById("removePhoto");

    const reporterName =
        document.getElementById("reporterName");

    const reporterPhone =
        document.getElementById("reporterPhone");

    const reporterEmail =
        document.getElementById("reporterEmail");

    const summaryProblem =
        document.getElementById("summaryProblem");

    const summaryLocation =
        document.getElementById("summaryLocation");

    const submitReport =
        document.getElementById("submitReport");

    const reportSuccess =
        document.getElementById("reportSuccess");

    const newReport =
        document.getElementById("newReport");


    /* =========================================
       STATE
    ========================================== */

    let selectedProblem = "";

    let currentLatitude = null;
    let currentLongitude = null;


    /* =========================================
       BASIC HTML CHECK
    ========================================== */

    if (
        !step1 ||
        !step2 ||
        !step3 ||
        !nextStep1 ||
        !nextStep2 ||
        !backStep2 ||
        !backStep3
    ) {

        console.error(
            "Report Problem: required HTML elements are missing."
        );

        return;
    }


    /* =========================================
       STEP 1 — PROBLEM SELECTION
    ========================================== */

    options.forEach((option) => {

        option.addEventListener("click", () => {

            options.forEach((item) => {
                item.classList.remove("selected");
            });

            option.classList.add("selected");

            selectedProblem =
                option.dataset.value || "";

            nextStep1.disabled =
                !selectedProblem;

        });

    });


    /* =========================================
       STEP 1 → STEP 2
    ========================================== */

    nextStep1.addEventListener("click", () => {

        if (!selectedProblem) {
            return;
        }

        showStep2();

    });


    function showStep2() {

        step1.classList.remove("active");

        step2.classList.add("active");

        step3.classList.remove("active");

        setProgress(1);

    }


    /* =========================================
       STEP 2 → STEP 1
    ========================================== */

    backStep2.addEventListener("click", () => {

        step2.classList.remove("active");

        step3.classList.remove("active");

        step1.classList.add("active");

        setProgress(0);

    });


    /* =========================================
       DESCRIPTION COUNTER
    ========================================== */

    if (description && descriptionCount) {

        description.addEventListener("input", () => {

            const length =
                description.value.length;

            descriptionCount.textContent =
                `${length} / 500`;

            if (length >= 450) {

                descriptionCount.style.color =
                    "#F97316";

            } else {

                descriptionCount.style.color =
                    "#aaa19b";

            }

        });

    }


    /* =========================================
       CURRENT LOCATION
    ========================================== */

    if (
        useLocationButton &&
        locationInput
    ) {

        useLocationButton.addEventListener(
            "click",
            () => {

                if (!navigator.geolocation) {

                    locationInput.value = "";

                    locationInput.placeholder =
                        "Location detection is not supported. Enter manually.";

                    useLocationButton.textContent =
                        "Try again";

                    return;
                }


                useLocationButton.disabled =
                    true;

                useLocationButton.textContent =
                    "Detecting...";


                navigator.geolocation.getCurrentPosition(

                    async (position) => {

                        currentLatitude =
                            position.coords.latitude;

                        currentLongitude =
                            position.coords.longitude;


                        locationInput.dataset.latitude =
                            currentLatitude;

                        locationInput.dataset.longitude =
                            currentLongitude;


                        try {

                            const response =
                                await fetch(
                                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${currentLatitude}&lon=${currentLongitude}&zoom=18&addressdetails=1`
                                );


                            if (!response.ok) {

                                throw new Error(
                                    "Location lookup failed"
                                );

                            }


                            const data =
                                await response.json();

                            const address =
                                data.address || {};


                            const locationParts = [

                                address.road,

                                address.suburb ||
                                address.neighbourhood ||
                                address.village ||
                                address.town ||
                                address.city,

                                address.state

                            ].filter(Boolean);


                            const readableLocation =
                                locationParts.join(", ");


                            if (readableLocation) {

                                locationInput.value =
                                    `📍 ${readableLocation}`;

                            }

                            else if (
                                data.display_name
                            ) {

                                locationInput.value =
                                    `📍 ${data.display_name}`;

                            }

                            else {

                                locationInput.value =
                                    "📍 Location detected";

                            }


                            useLocationButton.textContent =
                                "Location added";

                        }

                        catch (error) {

                            console.error(
                                "Reverse geocoding error:",
                                error
                            );


                            locationInput.value =
                                `📍 Location detected (${currentLatitude.toFixed(5)}, ${currentLongitude.toFixed(5)})`;


                            useLocationButton.textContent =
                                "Location added";

                        }


                        useLocationButton.disabled =
                            false;

                    },


                    (error) => {

                        console.error(
                            "Geolocation error:",
                            error
                        );


                        useLocationButton.disabled =
                            false;

                        useLocationButton.textContent =
                            "Try again";


                        switch (error.code) {

                            case error.PERMISSION_DENIED:

                                locationInput.placeholder =
                                    "Location permission denied. Enter manually.";

                                break;


                            case error.POSITION_UNAVAILABLE:

                                locationInput.placeholder =
                                    "Location unavailable. Enter manually.";

                                break;


                            case error.TIMEOUT:

                                locationInput.placeholder =
                                    "Location request timed out. Try again.";

                                break;


                            default:

                                locationInput.placeholder =
                                    "Could not detect location. Enter manually.";

                        }

                    },


                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 0
                    }

                );

            }
        );

    }


    /* =========================================
       STEP 2 → STEP 3
    ========================================== */

    nextStep2.addEventListener("click", () => {

        const location =
            locationInput
                ? locationInput.value.trim()
                : "";

        const details =
            description
                ? description.value.trim()
                : "";


        if (!location) {

            if (locationInput) {
                locationInput.focus();
            }

            return;
        }


        if (!details) {

            if (description) {
                description.focus();
            }

            return;
        }


        showStep3();

    });


    function showStep3() {

        step1.classList.remove("active");

        step2.classList.remove("active");

        step3.classList.add("active");

        setProgress(2);


        if (summaryProblem) {

            summaryProblem.textContent =
                selectedProblem || "—";

        }


        if (summaryLocation) {

            summaryLocation.textContent =
                locationInput.value.trim() || "—";

        }

    }


    /* =========================================
       STEP 3 → STEP 2
    ========================================== */

    backStep3.addEventListener("click", () => {

        step3.classList.remove("active");

        step2.classList.add("active");

        setProgress(1);

    });


    /* =========================================
       PROGRESS
    ========================================== */

    function setProgress(activeIndex) {

        progressSteps.forEach(
            (step, index) => {

                step.classList.toggle(
                    "active",
                    index === activeIndex
                );

            }
        );


        progressLines.forEach(
            (line, index) => {

                if (index < activeIndex) {

                    if (index === 0) {

                        line.style.background =
                            "linear-gradient(90deg, #F97316, #FACC15)";

                    }

                    else if (index === 1) {

                        line.style.background =
                            "linear-gradient(90deg, #FACC15, #C026D3)";

                    }

                }

                else {

                    line.style.background =
                        "#ebe5df";

                }

            }
        );

    }


    /* =========================================
       PHOTO UPLOAD
    ========================================== */

    if (
        photoUpload &&
        problemPhoto &&
        photoPreview &&
        removePhoto
    ) {

        photoUpload.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === removePhoto ||
                    removePhoto.contains(event.target)
                ) {

                    return;

                }

                problemPhoto.click();

            }
        );


        problemPhoto.addEventListener(
            "change",
            () => {

                const file =
                    problemPhoto.files[0];


                if (!file) {
                    return;
                }


                if (!file.type.startsWith("image/")) {

                    problemPhoto.value = "";

                    alert(
                        "Please select an image file."
                    );

                    return;
                }


                const reader =
                    new FileReader();


                reader.onload =
                    (event) => {

                        photoPreview.src =
                            event.target.result;

                        photoUpload.classList.add(
                            "has-photo"
                        );

                    };


                reader.readAsDataURL(file);

            }
        );


        removePhoto.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                problemPhoto.value = "";

                photoPreview.src = "";

                photoUpload.classList.remove(
                    "has-photo"
                );

            }
        );

    }


    /* =========================================
       SUBMIT REPORT
    ========================================== */

    if (submitReport) {

        submitReport.addEventListener(
            "click",
            () => {

                const name =
                    reporterName
                        ? reporterName.value.trim()
                        : "";

                const phone =
                    reporterPhone
                        ? reporterPhone.value.trim()
                        : "";

                const email =
                    reporterEmail
                        ? reporterEmail.value.trim()
                        : "";

                const location =
                    locationInput
                        ? locationInput.value.trim()
                        : "";

                const details =
                    description
                        ? description.value.trim()
                        : "";

                const landmark =
                    landmarkInput
                        ? landmarkInput.value.trim()
                        : "";


                if (!name) {

                    reporterName?.focus();

                    return;

                }


                if (!phone) {

                    reporterPhone?.focus();

                    return;

                }


                if (!location) {

                    alert(
                        "Please add the problem location."
                    );

                    return;

                }


                if (!details) {

                    alert(
                        "Please describe the problem."
                    );

                    return;

                }


                const reportData = {

                    problem:
                        selectedProblem,

                    location:
                        location,

                    latitude:
                        locationInput?.dataset.latitude ||
                        null,

                    longitude:
                        locationInput?.dataset.longitude ||
                        null,

                    landmark:
                        landmark,

                    description:
                        details,

                    name:
                        name,

                    phone:
                        phone,

                    email:
                        email || null,

                    photo:
                        problemPhoto &&
                        problemPhoto.files[0]
                            ? problemPhoto.files[0].name
                            : null

                };


                console.log(
                    "Report ready to submit:",
                    reportData
                );


                showSuccess();

            }
        );

    }


    /* =========================================
       SUCCESS
    ========================================== */

    function showSuccess() {

        step1.classList.remove("active");

        step2.classList.remove("active");

        step3.classList.remove("active");


        if (progress) {

            progress.style.display =
                "none";

        }


        if (reportSuccess) {

            reportSuccess.classList.add(
                "show"
            );

        }

        else {

            console.error(
                "#reportSuccess is missing from HTML."
            );

        }

    }


    /* =========================================
       REPORT ANOTHER ISSUE
    ========================================== */

    if (newReport) {

        newReport.addEventListener(
            "click",
            () => {

                if (reportSuccess) {

                    reportSuccess.classList.remove(
                        "show"
                    );

                }


                if (progress) {

                    progress.style.display =
                        "flex";

                }


                step2.classList.remove("active");

                step3.classList.remove("active");

                step1.classList.add("active");


                setProgress(0);


                selectedProblem = "";


                options.forEach((option) => {

                    option.classList.remove(
                        "selected"
                    );

                });


                nextStep1.disabled =
                    true;


                if (locationInput) {

                    locationInput.value = "";

                    locationInput.dataset.latitude =
                        "";

                    locationInput.dataset.longitude =
                        "";

                }


                currentLatitude = null;

                currentLongitude = null;


                if (useLocationButton) {

                    useLocationButton.disabled =
                        false;

                    useLocationButton.textContent =
                        "Use my location";

                }


                if (landmarkInput) {
                    landmarkInput.value = "";
                }


                if (description) {
                    description.value = "";
                }


                if (descriptionCount) {

                    descriptionCount.textContent =
                        "0 / 500";

                    descriptionCount.style.color =
                        "#aaa19b";

                }


                if (reporterName) {
                    reporterName.value = "";
                }


                if (reporterPhone) {
                    reporterPhone.value = "";
                }


                if (reporterEmail) {
                    reporterEmail.value = "";
                }


                if (problemPhoto) {
                    problemPhoto.value = "";
                }


                if (photoPreview) {
                    photoPreview.src = "";
                }


                if (photoUpload) {

                    photoUpload.classList.remove(
                        "has-photo"
                    );

                }


                if (summaryProblem) {

                    summaryProblem.textContent =
                        "—";

                }


                if (summaryLocation) {

                    summaryLocation.textContent =
                        "—";

                }

            }
        );

    }


    /* =========================================
       INITIAL STATE
    ========================================== */

    setProgress(0);

    nextStep1.disabled = true;

});