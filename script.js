const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const error = document.getElementById("error");

const weatherContainer =
    document.getElementById("weatherContainer");

const cityName =
    document.getElementById("cityName");

const countryName =
    document.getElementById("countryName");

const temperature =
    document.getElementById("temperature");

const feelsLike =
    document.getElementById("feelsLike");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const weatherDescription =
    document.getElementById("weatherDescription");

const weatherIcon =
    document.getElementById("weatherIcon");

const dayNight =
    document.getElementById("dayNight");

const updatedTime =
    document.getElementById("updatedTime");


// ---------------------------------------
// Weather code conversion
// ---------------------------------------

function getWeatherInfo(code) {

    if (code === 0) {
        return {
            description: "Clear sky",
            icon: "☀️"
        };
    }

    if (code === 1 || code === 2) {
        return {
            description: "Partly cloudy",
            icon: "🌤️"
        };
    }

    if (code === 3) {
        return {
            description: "Overcast",
            icon: "☁️"
        };
    }

    if (code === 45 || code === 48) {
        return {
            description: "Foggy",
            icon: "🌫️"
        };
    }

    if (
        code === 51 ||
        code === 53 ||
        code === 55
    ) {
        return {
            description: "Drizzle",
            icon: "🌦️"
        };
    }

    if (
        code === 61 ||
        code === 63 ||
        code === 65
    ) {
        return {
            description: "Rain",
            icon: "🌧️"
        };
    }

    if (
        code === 71 ||
        code === 73 ||
        code === 75
    ) {
        return {
            description: "Snow",
            icon: "❄️"
        };
    }

    if (
        code === 80 ||
        code === 81 ||
        code === 82
    ) {
        return {
            description: "Rain showers",
            icon: "🌦️"
        };
    }

    if (
        code === 95 ||
        code === 96 ||
        code === 99
    ) {
        return {
            description: "Thunderstorm",
            icon: "⛈️"
        };
    }

    return {
        description: "Unknown",
        icon: "🌍"
    };
}


// ---------------------------------------
// Get city coordinates
// ---------------------------------------

async function getCityCoordinates(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?` +
        `name=${encodeURIComponent(city)}` +
        `&count=1` +
        `&language=en` +
        `&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Could not search for the city.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found.");
    }

    return data.results[0];
}


// ---------------------------------------
// Get weather data
// ---------------------------------------

async function getWeather(latitude, longitude) {

    const url =
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,` +
        `apparent_temperature,weather_code,wind_speed_10m,is_day` +
        `&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Could not fetch weather data.");
    }

    const data = await response.json();

    return data;
}


// ---------------------------------------
// Display weather
// ---------------------------------------

function displayWeather(location, weather) {

    const current = weather.current;

    const weatherInfo =
        getWeatherInfo(current.weather_code);


    // Location
    cityName.textContent = location.name;

    countryName.textContent =
        `${location.admin1 || ""}, ${location.country}`;


    // Temperature
    temperature.textContent =
        Math.round(current.temperature_2m);


    // Weather description
    weatherDescription.textContent =
        weatherInfo.description;


    // Weather icon
    weatherIcon.textContent =
        weatherInfo.icon;


    // Feels like
    feelsLike.textContent =
        Math.round(current.apparent_temperature);


    // Humidity
    humidity.textContent =
        current.relative_humidity_2m;


    // Wind
    windSpeed.textContent =
        Math.round(current.wind_speed_10m);


    // Day / Night
    dayNight.textContent =
        current.is_day === 1
            ? "Day"
            : "Night";


    // Updated time
    const date =
        new Date(current.time);

    updatedTime.textContent =
        date.toLocaleString();


    // Show weather
    weatherContainer.classList.remove("hidden");
}


// ---------------------------------------
// Main search function
// ---------------------------------------

async function searchWeather() {

    const city =
        cityInput.value.trim();


    // Check empty input
    if (city === "") {

        showError("Please enter a city name.");

        return;
    }


    // UI state
    loading.classList.remove("hidden");

    error.classList.add("hidden");

    weatherContainer.classList.add("hidden");


    try {

        // Step 1:
        // Convert city name into coordinates

        const location =
            await getCityCoordinates(city);


        // Step 2:
        // Get weather using coordinates

        const weather =
            await getWeather(
                location.latitude,
                location.longitude
            );


        // Step 3:
        // Display weather

        displayWeather(
            location,
            weather
        );

    }

    catch (err) {

        showError(err.message);

    }

    finally {

        loading.classList.add("hidden");

    }
}


// ---------------------------------------
// Show error
// ---------------------------------------

function showError(message) {

    error.textContent = message;

    error.classList.remove("hidden");

    weatherContainer.classList.add("hidden");
}


// ---------------------------------------
// Button click
// ---------------------------------------

searchBtn.addEventListener(
    "click",
    searchWeather
);


// ---------------------------------------
// Press Enter in input
// ---------------------------------------

cityInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            searchWeather();

        }

    }
);


// ---------------------------------------
// Load Bengaluru initially
// ---------------------------------------

cityInput.value = "Bengaluru";

searchWeather();