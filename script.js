// ==========================================
// SCHOOL EMERGENCY ALERT SYSTEM
// ==========================================

// Weather API coordinates for Quezon City
const LATITUDE = 14.6760;
const LONGITUDE = 121.0437;


// ==========================================
// GET LIVE WEATHER
// ==========================================
async function getWeather() {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&timezone=Asia%2FManila`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to get weather data");
        }

        const data = await response.json();
        const weather = data.current;

        // Get weather condition
        const condition = getWeatherCondition(weather.weather_code);

        // Update top weather card
        document.getElementById("topTemperature").textContent =
            Math.round(weather.temperature_2m) + "°C";

        document.getElementById("topCondition").textContent = condition;

        document.getElementById("humidity").textContent =
            "Humidity: " + weather.relative_humidity_2m + "%";

        document.getElementById("wind").textContent =
            "Wind: " + weather.wind_speed_10m + " km/h";

        document.getElementById("rain").textContent =
            "Rain: " + weather.rain + " mm";

        document.getElementById("feels").textContent =
            "Feels: " + Math.round(weather.apparent_temperature) + "°C";


        // Update lower Live Weather section
        document.getElementById("currentTemperature").textContent =
            Math.round(weather.temperature_2m) + "°C";

        document.getElementById("weatherCondition").textContent =
            condition;

        document.getElementById("rainAmount").textContent =
            weather.rain + " mm";


        // Weather icon
        document.getElementById("weatherIcon").textContent =
            getWeatherIcon(weather.weather_code);


        // Weather monitoring message
        const monitoringMessage =
            document.getElementById("monitoringMessage");

        if (weather.rain > 0 || weather.precipitation > 0) {
            monitoringMessage.textContent =
                "Rain detected. Continue monitoring weather conditions.";
        } else {
            monitoringMessage.textContent =
                "Weather service connected and monitoring conditions.";
        }


        // Update safety status
        updateSafetyStatus(weather);

    } catch (error) {
        console.error("Weather Error:", error);

        document.getElementById("topTemperature").textContent = "--°C";
        document.getElementById("topCondition").textContent =
            "Weather unavailable";

        document.getElementById("monitoringMessage").textContent =
            "Unable to connect to the weather service.";

        document.getElementById("systemStatus").textContent =
            "Weather service offline";
    }
}


// ==========================================
// WEATHER CONDITION
// ==========================================
function getWeatherCondition(code) {

    const weatherCodes = {
        0: "Clear Sky",
        1: "Mostly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Foggy",
        51: "Light Drizzle",
        53: "Moderate Drizzle",
        55: "Heavy Drizzle",
        61: "Light Rain",
        63: "Moderate Rain",
        65: "Heavy Rain",
        71: "Light Snow",
        73: "Moderate Snow",
        75: "Heavy Snow",
        80: "Rain Showers",
        81: "Moderate Rain Showers",
        82: "Heavy Rain Showers",
        95: "Thunderstorm",
        96: "Thunderstorm with Hail",
        99: "Severe Thunderstorm"
    };

    return weatherCodes[code] || "Unknown";
}


// ==========================================
// WEATHER ICON
// ==========================================
function getWeatherIcon(code) {

    if (code === 0 || code === 1) {
        return "☀️";
    }

    if (code === 2 || code === 3) {
        return "☁️";
    }

    if (
        code === 51 ||
        code === 53 ||
        code === 55 ||
        code === 61 ||
        code === 63 ||
        code === 65 ||
        code === 80 ||
        code === 81 ||
        code === 82
    ) {
        return "🌧️";
    }

    if (code === 95 || code === 96 || code === 99) {
        return "⛈️";
    }

    return "🌤️";
}


// ==========================================
// SAFETY STATUS
// ==========================================
function updateSafetyStatus(weather) {

    const statusElement = document.getElementById("systemStatus");
    const safetyMessage = document.getElementById("safetyMessage");

    // Heavy rain warning
    if (weather.rain >= 7 || weather.weather_code === 65) {

        statusElement.textContent = "⚠ Weather Alert";

        safetyMessage.textContent =
            "Heavy rain detected. Monitor official announcements.";

        statusElement.style.color = "#d97706";

    }

    // Thunderstorm warning
    else if (
        weather.weather_code === 95 ||
        weather.weather_code === 96 ||
        weather.weather_code === 99
    ) {

        statusElement.textContent = "⚠ Thunderstorm Alert";

        safetyMessage.textContent =
            "Thunderstorm detected. Stay indoors and monitor official updates.";

        statusElement.style.color = "#dc2626";

    }

    // Normal weather
    else {

        statusElement.textContent = "● Online";

        safetyMessage.textContent =
            "All systems operational.";

        statusElement.style.color = "#2563eb";
    }
}


// ==========================================
// EMERGENCY ALERT BUTTON
// ==========================================
function activateEmergencyAlert() {

    const confirmed = confirm(
        "Do you want to activate the Emergency Alert?"
    );

    if (confirmed) {

        alert(
            "🚨 EMERGENCY ALERT ACTIVATED!\n\n" +
            "Please follow school safety procedures and wait for official instructions."
        );

        document.body.classList.add("emergency-mode");

        document.getElementById("systemStatus").textContent =
            "🚨 EMERGENCY ACTIVE";

        document.getElementById("safetyMessage").textContent =
            "Emergency alert is currently active. Follow official instructions.";
    }
}


// ==========================================
// VIEW ANNOUNCEMENTS BUTTON
// ==========================================
function viewAnnouncements() {

    const announcementSection =
        document.getElementById("announcements");

    if (announcementSection) {
        announcementSection.scrollIntoView({
            behavior: "smooth"
        });
    } else {
        alert("No announcements are available at this time.");
    }
}


// ==========================================
// UPDATE WEATHER AUTOMATICALLY
// ==========================================

// Load weather immediately
getWeather();

// Refresh every 5 minutes
setInterval(getWeather, 300000);
