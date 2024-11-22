let apiKey;

async function fetchApiKey() {
    try {
        const response = await fetch('/api-key');
        const data = await response.json();
        apiKey = data.apiKey;
    } catch (error) {
        console.error('Error fetching API key:', error);
    }
}

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        updateWeatherInfo(data);
        return data;
    } catch (error) {
        console.error('Error fetching weather:', error);
        weatherInfoElem.classList.add('hidden');
        forecastElem.classList.add('hidden');
        errorMessageElem.classList.remove('hidden');
        throw error;
    }
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error('Location not found');
        }
        const data = await response.json();
        updateWeatherInfo(data);
        await fetchForecast(data.name);
        await fetchAirQuality(lat, lon);
    } catch (error) {
        console.error('Error fetching weather by coordinates:', error);
        weatherInfoElem.classList.add('hidden');
        forecastElem.classList.add('hidden');
        errorMessageElem.classList.remove('hidden');
    }
}

async function fetchForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        updateForecastInfo(data);
    } catch (error) {
        console.error('Error fetching forecast:', error);
        weatherInfoElem.classList.add('hidden');
        forecastElem.classList.add('hidden');
        errorMessageElem.classList.remove('hidden');
    }
}

async function fetchAirQuality(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        console.log('Air Quality Data:', data); // Debugging information
        updateAirQualityInfo(data);
    } catch (error) {
        console.error('Error fetching air quality:', error);
        airQualityElem.classList.add('hidden');
        errorMessageElem.classList.remove('hidden');
    }
}

async function fetchData(city) {
    console.log('Fetching data for:', city);
    loadingSpinner.classList.remove('hidden');
    weatherInfoElem.classList.add('hidden');
    forecastElem.classList.add('hidden');
    airQualityElem.classList.add('hidden');
    errorMessageElem.classList.add('hidden');
    try {
        const weatherData = await fetchWeather(city);
        await fetchForecast(city);
        await fetchAirQuality(weatherData.coord.lat, weatherData.coord.lon);
    } finally {
        loadingSpinner.classList.add('hidden');
    }
}