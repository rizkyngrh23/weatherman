let searchInput, searchButton, cityElem, descriptionElem, tempElem, forecastElem, weatherInfoElem, humidityElem, windElem, pressureElem, weatherIconElem, errorMessageElem, loadingSpinner, feelsLikeElem, visibilityElem, sunriseElem, sunsetElem, airQualityElem, dateTimeElem;
let defaultCityElems = {}, defaultDescriptionElems = {}, defaultTempElems = {}, defaultWeatherIconElems = {};

function updateWeatherInfo(data) {
    if (!data.weather) {
        console.error('Invalid weather data:', data);
        return;
    }
    cityElem.textContent = data.name;
    descriptionElem.textContent = data.weather[0].description;
    tempElem.textContent = `${Math.round(data.main.temp)}°C`;
    humidityElem.textContent = `Humidity: ${data.main.humidity}%`;
    windElem.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    pressureElem.textContent = `Pressure: ${data.main.pressure} hPa`;
    feelsLikeElem.textContent = `Feels Like: ${Math.round(data.main.feels_like)}°C`;
    visibilityElem.textContent = `Visibility: ${data.visibility / 1000} km`;
    sunriseElem.textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
    sunsetElem.textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;
    weatherIconElem.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIconElem.classList.remove('hidden');
    weatherInfoElem.classList.remove('hidden');
    errorMessageElem.classList.add('hidden');
}

function updateForecastInfo(data) {
    forecastElem.innerHTML = '<h3>2-Day Forecast</h3>';
    data.list.slice(0, 2).forEach(item => {
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        forecastDay.innerHTML = `
            <h4>${new Date(item.dt_txt).toLocaleDateString()}</h4>
            <p>${item.weather[0].description}</p>
            <p>${Math.round(item.main.temp)}°C</p>
        `;
        forecastElem.appendChild(forecastDay);
    });
    forecastElem.classList.remove('hidden');
    errorMessageElem.classList.add('hidden');
}

function getAQIColor(aqi) {
    if (aqi <= 50) return 'green';
    if (aqi <= 100) return 'yellow';
    if (aqi <= 150) return 'orange';
    if (aqi <= 200) return 'red';
    if (aqi <= 300) return 'purple';
    return 'maroon';
}

function convertAQI(aqi) {
    switch (aqi) {
        case 1:
            return 25;
        case 2:
            return 75;
        case 3:
            return 125;
        case 4:
            return 175;
        case 5:
            return 250;
        default:
            return 0;
    }
}

function updateAirQualityInfo(data) {
    const aqi = convertAQI(data.list[0].main.aqi);
    console.log('Converted AQI:', aqi);
    const aqiColor = getAQIColor(aqi);
    airQualityElem.innerHTML = `
        <h3>Air Quality</h3>
        <p style="color: ${aqiColor}; font-weight: bold;">AQI: ${aqi}</p>
        <p>PM2.5: ${data.list[0].components.pm2_5} µg/m³</p>
        <p>PM10: ${data.list[0].components.pm10} µg/m³</p>
        <p>O3: ${data.list[0].components.o3} µg/m³</p>
        <p>NO2: ${data.list[0].components.no2} µg/m³</p>
        <p>SO2: ${data.list[0].components.so2} µg/m³</p>
        <p>CO: ${data.list[0].components.co} µg/m³</p>
    `;
    airQualityElem.classList.remove('hidden');
    errorMessageElem.classList.add('hidden');
}

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    dateTimeElem.textContent = now.toLocaleDateString('en-US', options);
}

function updateDefaultCityWeather(city, data) {
    if (!data.weather) {
        console.error('Invalid weather data for default city:', data);
        return;
    }
    defaultCityElems[city].textContent = data.name;
    defaultDescriptionElems[city].textContent = data.weather[0].description;
    defaultTempElems[city].textContent = `${Math.round(data.main.temp)}°C`;
    defaultWeatherIconElems[city].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    defaultWeatherIconElems[city].classList.remove('hidden');
    document.getElementById(`${city.toLowerCase()}-weather`).classList.remove('hidden');
}

async function fetchDefaultCityWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Invalid API key or city not found');
        }
        const data = await response.json();
        updateDefaultCityWeather(city, data);
    } catch (error) {
        console.error(`Error fetching weather for ${city}:`, error);
    }
}

function addEventListeners() {
    searchInput.addEventListener('keypress', async (event) => {
        if (event.key === 'Enter') {
            const city = searchInput.value;
            if (city) {
                console.log('Enter key pressed, city:', city);
                await fetchData(city);
            }
        }
    });

    searchButton.addEventListener('click', async () => {
        const city = searchInput.value;
        if (city) {
            console.log('Search button clicked, city:', city);
            await fetchData(city);
        }
    });

    console.log('Event listeners added');
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchApiKey();
    searchInput = document.getElementById('search');
    searchButton = document.getElementById('search-button');
    cityElem = document.getElementById('city');
    descriptionElem = document.getElementById('description');
    tempElem = document.getElementById('temp');
    forecastElem = document.getElementById('forecast');
    weatherInfoElem = document.getElementById('weather-info');
    humidityElem = document.getElementById('humidity');
    windElem = document.getElementById('wind');
    pressureElem = document.getElementById('pressure');
    weatherIconElem = document.getElementById('weather-icon');
    errorMessageElem = document.getElementById('error-message');
    loadingSpinner = document.getElementById('loading-spinner');
    feelsLikeElem = document.getElementById('feels-like');
    visibilityElem = document.getElementById('visibility');
    sunriseElem = document.getElementById('sunrise');
    sunsetElem = document.getElementById('sunset');
    airQualityElem = document.getElementById('air-quality');
    dateTimeElem = document.getElementById('date-time');

    const cities = ['Jakarta', 'Bandung', 'Surabaya', 'Semarang'];
    cities.forEach(city => {
        defaultCityElems[city] = document.getElementById(`${city.toLowerCase()}-city`);
        defaultDescriptionElems[city] = document.getElementById(`${city.toLowerCase()}-description`);
        defaultTempElems[city] = document.getElementById(`${city.toLowerCase()}-temp`);
        defaultWeatherIconElems[city] = document.getElementById(`${city.toLowerCase()}-weather-icon`);
    });

    updateDateTime();
    setInterval(updateDateTime, 1000);

    addEventListeners();

    for (const city of cities) {
        await fetchDefaultCityWeather(city);
    }
});