async function getPAGASAWeather() {

    try {

        // Your backend endpoint
        const response = await fetch("/api/pagasa-weather.php");

        if (!response.ok) {
            throw new Error("Unable to connect to PAGASA");
        }

        const data = await response.json();

        console.log("PAGASA DATA:", data);


        // Example values returned by your backend
        const temperature = data.temperature;
        const humidity = data.humidity;
        const rainfall = data.rainfall;
        const wind = data.wind;
        const condition = data.condition;


        // MAIN WEATHER CARD

        document.getElementById("temperature").textContent =
            temperature + "°C";

        document.getElementById("weatherCondition").textContent =
            condition;

        document.getElementById("humidity").textContent =
            humidity;

        document.getElementById("rain").textContent =
            rainfall;

        document.getElementById("wind").textContent =
            wind;

        document.getElementById("feelsLike").textContent =
            data.feelsLike ?? "--";


        // LOWER WEATHER CARD

        document.getElementById("temp2").textContent =
            temperature + "°C";

        document.getElementById("condition2").textContent =
            condition;

        document.getElementById("rain2").textContent =
            rainfall + " mm";


        // WEATHER MONITORING MESSAGE

        document.getElementById("weatherMessage").innerHTML = `
            <strong>✓ PAGASA Weather Monitoring</strong>
            <p>
                Weather information is being monitored
                from the official PAGASA source.
            </p>
        `;


        // SYSTEM STATUS

        document.getElementById("systemStatus").innerHTML = `
            <span class="online-dot"></span>
            Online
        `;

        document.getElementById("systemMessage").textContent =
            "PAGASA weather monitoring active.";


    } catch (error) {

        console.error(error);

        document.getElementById("weatherMessage").innerHTML = `
            <strong>⚠ PAGASA Weather Monitoring</strong>
            <p>
                Unable to retrieve the latest PAGASA data.
                Please check the official PAGASA website.
            </p>
        `;

        document.getElementById("weatherCondition").textContent =
            "Unavailable";

        document.getElementById("condition2").textContent =
            "Unavailable";
    }
}


// Load PAGASA weather
getPAGASAWeather();


// Refresh every 10 minutes
setInterval(
    getPAGASAWeather,
    10 * 60 * 1000
);
