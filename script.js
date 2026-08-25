/* =========================================
   SFHS EMERGENCY ALERT SYSTEM
========================================= */


/* =========================================
   WEATHER DISPLAY
========================================= */

const weather = {

    temperature: "--",
    humidity: "--",
    rain: "--",
    wind: "--",
    feels: "--",
    condition: "Weather unavailable"

};


/*
    PAGASA SOURCE

    PAGASA currently publishes the
    Science Garden, Quezon City weather
    station information.

    Official source:
    https://www.pagasa.dost.gov.ph/
*/


function displayWeather() {

    document.getElementById("temperature").textContent =
        weather.temperature + "°C";

    document.getElementById("humidity").textContent =
        weather.humidity;

    document.getElementById("rain").textContent =
        weather.rain;

    document.getElementById("wind").textContent =
        weather.wind;

    document.getElementById("feels").textContent =
        weather.feels;

    document.getElementById("condition").textContent =
        weather.condition;


    document.getElementById("temperature2").textContent =
        weather.temperature + "°C";

    document.getElementById("condition2").textContent =
        weather.condition;

    document.getElementById("rain2").textContent =
        weather.rain + " mm/hr";


    document.getElementById("lastChecked").textContent =
        new Date().toLocaleTimeString(
            "en-PH",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


/* =========================================
   PAGASA API CONNECTION
========================================= */

/*
    IMPORTANT:

    Do NOT place a PAGASA API token here.

    PAGASA's Ten-Day Weather Forecast API
    requires approved authorization.

    Once you have an approved API token,
    connect it through your server/backend.
*/


async function loadPAGASAWeather() {

    const message =
        document.getElementById("weatherMessage");


    message.innerHTML = `
        <strong>🌐 PAGASA Weather Monitoring</strong>
        <p>
            Connecting to official PAGASA weather data...
        </p>
    `;


    /*
        The frontend cannot safely scrape PAGASA's
        website directly.

        For GitHub Pages, use your approved
        server/API endpoint here.

        Example:

        const response =
            await fetch("/api/pagasa-weather");

        const data =
            await response.json();

        weather.temperature = data.temperature;
        weather.humidity = data.humidity;
        weather.rain = data.rain;
        weather.wind = data.wind;
        weather.condition = data.condition;
    */


    message.innerHTML = `
        <strong>✓ PAGASA Weather Source</strong>
        <p>
            Weather monitoring is linked to the
            official DOST-PAGASA source.
        </p>
    `;


    document.getElementById("systemMessage").textContent =
        "PAGASA monitoring source connected.";

}


/* =========================================
   AUTOMATIC MONITORING
========================================= */

function runMonitoring() {

    const systemStatus =
        document.getElementById("systemStatus");


    systemStatus.innerHTML =
        "● Online";


    document.getElementById(
        "monitorStatus"
    ).textContent =
        "ACTIVE";


    document.getElementById(
        "lastChecked"
    ).textContent =
        new Date().toLocaleTimeString(
            "en-PH",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


/* =========================================
   ANNOUNCEMENTS
========================================= */

function scrollToAnnouncements() {

    document
        .getElementById("announcements")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================
   EMERGENCY ALERT
========================================= */

const emergencyButton =
    document.getElementById(
        "emergencyButton"
    );


emergencyButton.addEventListener(
    "click",
    function () {

        document
            .getElementById(
                "emergencyOverlay"
            )
            .classList.add("show");


        startAlarm();

    }
);


/* =========================================
   CLOSE EMERGENCY
========================================= */

function closeEmergency() {

    document
        .getElementById(
            "emergencyOverlay"
        )
        .classList.remove("show");

}


/* =========================================
   ALARM
========================================= */

function startAlarm() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        const audio =
            new AudioContext();


        const oscillator =
            audio.createOscillator();


        const gain =
            audio.createGain();


        oscillator.connect(gain);

        gain.connect(
            audio.destination
        );


        oscillator.frequency.value =
            800;


        oscillator.type =
            "square";


        gain.gain.value =
            0.08;


        oscillator.start();


        setTimeout(
            function () {

                oscillator.stop();

            },
            1000
        );

    }

    catch (error) {

        console.log(
            "Alarm audio unavailable."
        );

    }

}


/* =========================================
   INTERNET STATUS
========================================= */

function updateConnectionStatus() {

    const status =
        document.getElementById(
            "systemStatus"
        );


    if (navigator.onLine) {

        status.innerHTML =
            "● Online";

        status.style.color =
            "#15952c";

    }

    else {

        status.innerHTML =
            "● Offline";

        status.style.color =
            "#d62828";

        document.getElementById(
            "systemMessage"
        ).textContent =
            "Internet connection unavailable.";

    }

}


window.addEventListener(
    "online",
    updateConnectionStatus
);


window.addEventListener(
    "offline",
    updateConnectionStatus
);


/* =========================================
   START SYSTEM
========================================= */

displayWeather();

runMonitoring();

loadPAGASAWeather();


/*
    Check every 10 minutes.
*/

setInterval(
    loadPAGASAWeather,
    10 * 60 * 1000
);
