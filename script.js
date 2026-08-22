/*
    QUEZON CITY LOCATION

    Latitude: 14.6511
    Longitude: 121.0486
*/

const LATITUDE = 14.6511;
const LONGITUDE = 121.0486;


/*
    WEATHER DESCRIPTION
*/

function getWeatherDescription(code) {

    const weatherCodes = {

        0: "Clear Sky",

        1: "Mainly Clear",
        2: "Partly Cloudy",
        3: "Overcast",

        45: "Foggy",
        48: "Foggy",

        51: "Light Drizzle",
        53: "Drizzle",
        55: "Heavy Drizzle",

        61: "Light Rain",
        63: "Moderate Rain",
        65: "Heavy Rain",

        71: "Light Snow",
        73: "Snow",
        75: "Heavy Snow",

        80: "Rain Showers",
        81: "Rain Showers",
        82: "Heavy Rain Showers",

        95: "Thunderstorm",
        96: "Thunderstorm",
        99: "Severe Thunderstorm"

    };

    return weatherCodes[code] || "Unknown Weather";
}


/*
    WEATHER ICON
*/

function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code >= 1 && code <= 3) {
        return "🌤️";
    }

    if (code >= 45 && code <= 48) {
        return "🌫️";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️";
    }

    if (code >= 80 && code <= 82) {
        return "🌧️";
    }

    if (code >= 95) {
        return "⛈️";
    }

    return "🌤️";
}


/*
    GET LIVE WEATHER
*/

async function getWeather() {

    try {

        const url =
            `[api.open-meteo.com](https://api.open-meteo.com/v1/forecast)` +
            `?latitude=${LATITUDE}` +
            `&longitude=${LONGITUDE}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m` +
            `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
            `&timezone=Asia%2FManila`;


        const response = await fetch(url);


        if (!response.ok) {
            throw new Error("Weather request failed");
        }


        const data = await response.json();


        /*
            CURRENT WEATHER
        */

        const current = data.current;


        const temperature =
            Math.round(current.temperature_2m);

        const feels =
            Math.round(current.apparent_temperature);

        const humidity =
            Math.round(current.relative_humidity_2m);

        const wind =
            Math.round(current.wind_speed_10m);

        const rain =
            current.precipitation;

        const code =
            current.weather_code;


        const description =
            getWeatherDescription(code);


        const icon =
            getWeatherIcon(code);


        /*
            UPDATE WEATHER CARD
        */

        document.getElementById("temperature")
            .textContent = temperature;

        document.getElementById("condition")
            .textContent = description;

        document.getElementById("weatherIcon")
            .textContent = icon;

        document.getElementById("humidity")
            .textContent = humidity;

        document.getElementById("wind")
            .textContent = wind;

        document.getElementById("rain")
            .textContent = rain;

        document.getElementById("feels")
            .textContent = feels;


        /*
            UPDATE STATUS CARD
        */

        document.getElementById("statusTemperature")
            .textContent = ` ${temperature}°C`;

        document.getElementById("statusCondition")
            .textContent = ` ${description}`;

        document.getElementById("statusRain")
            .textContent = ` ${rain} mm`;


        /*
            AUTOMATIC RAIN MONITORING
        */

        const rainState =
            document.getElementById("rainState");

        const rainTitle =
            document.getElementById("rainTitle");

        const rainMessage =
            document.getElementById("rainMessage");


        if (
            code === 65 ||
            code === 82 ||
            code === 95 ||
            code === 96 ||
            code === 99
        ) {

            rainState.textContent =
                "⚠️ ACTIVE";

            rainState.style.color =
                "#e12626";

            rainTitle.textContent =
                "Heavy Rain / Storm Alert";

            rainMessage.textContent =
                "Severe weather conditions detected in Quezon City.";

        }

        else if (
            code >= 51 &&
            code <= 82
        ) {

            rainState.textContent =
                "Rain detected";

            rainState.style.color =
                "#e09b00";

            rainTitle.textContent =
                "Rain Detected";

            rainMessage.textContent =
                "Rain is currently being monitored.";

        }

        else {

            rainState.textContent =
                "No heavy rain";

            rainState.style.color =
                "#16a052";

            rainTitle.textContent =
                "Weather Monitoring";

            rainMessage.textContent =
                "No severe weather detected.";

        }


        /*
            FORECAST
        */

        const forecast =
            document.getElementById("forecast");

        forecast.innerHTML = "";


        for (
            let i = 0;
            i < 5;
            i++
        ) {

            const date =
                new Date(
                    data.daily.time[i]
                );


            const day =
                date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
                    }
                );


            const max =
                Math.round(
                    data.daily.temperature_2m_max[i]
                );


            const min =
                Math.round(
                    data.daily.temperature_2m_min[i]
                );


            const dailyCode =
                data.daily.weather_code[i];


            const dailyIcon =
                getWeatherIcon(dailyCode);


            forecast.innerHTML += `

                <div class="forecast-day">

                    <strong>
                        ${day}
                    </strong>

                    <div class="icon">
                        ${dailyIcon}
                    </div>

                    ${max}° / ${min}°

                </div>

            `;

        }


        /*
            LAST CHECKED
        */

        const now =
            new Date();


        document.getElementById("lastChecked")
            .textContent =
            now.toLocaleTimeString(
                "en-PH",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );


    }

    catch (error) {

        console.error(error);

        document.getElementById("condition")
            .textContent =
            "Weather unavailable";

        document.getElementById("rainMessage")
            .textContent =
            "Unable to connect to the weather service.";

    }

}


/*
    LOAD WEATHER
*/

getWeather();


/*
    UPDATE EVERY 10 MINUTES
*/

setInterval(
    getWeather,
    10 * 60 * 1000
);
