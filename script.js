let searchButton = document.getElementById("search-button");
let searchInput = document.getElementById("search-input");
let weatherDisplay = document.getElementById("weather-display");
let errorMessage = document.getElementById("error-message");
let restartButton = document.getElementById("restart-button");
let apiKey = "dc3978a56078da4ccabbaae5656e43cc";

searchButton.addEventListener("click", handleSearch);
restartButton.addEventListener("click", restartSearch);

async function fetchWeatherData(location) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Weather data not found");
  }
  console.log(response);
  return response.json();
}


function displayWeatherData(weatherDataArray) {
    const table = document.createElement('table');
    let tableContent = `
        <tr>
            <th>Location</th>
            <th>Temperature (°C)</th>
            <th>Humidity (%)</th>
            <th>Description</th>
        </tr>
    `;

    weatherDataArray.forEach(weatherData => {
        tableContent += `
            <tr>
                <td>${weatherData.name}, ${weatherData.country}</td>
                <td>${weatherData.temperature}</td>
                <td>${weatherData.humidity}</td>
                <td>${weatherData.description}</td>
            </tr>
        `;
    });

    table.innerHTML = tableContent;

    weatherDisplay.innerHTML = '';
    weatherDisplay.appendChild(table);

    const backButton = document.createElement('button');
    backButton.textContent = 'Back to Current Weather';
    backButton.addEventListener('click', () => {
        const currentWeatherData = weatherDataArray[weatherDataArray.length - 1];
        displayCurrentWeather(currentWeatherData);
    });

    weatherDisplay.appendChild(backButton);

    weatherDisplay.style.display = 'block';
}

function displayCurrentWeather(weatherData) {
    weatherDisplay.innerHTML = `
        <h2>Weather in ${weatherData.name}, ${weatherData.country}</h2>
        <p>Temperature: ${weatherData.temperature}°C</p>
        <p>Humidity: ${weatherData.humidity}%</p>
        <p>Description: ${weatherData.description}</p>
    `;

    weatherDisplay.style.display = 'block';
}

function updateWeatherDisplay(data) {
    const weatherData = {
        name: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        description: data.weather[0].description,
    };

    let savedWeatherData = JSON.parse(localStorage.getItem('savedWeatherData')) || [];
    savedWeatherData.push(weatherData);

    localStorage.setItem('savedWeatherData', JSON.stringify(savedWeatherData));

    displayCurrentWeather(weatherData);

    const viewPreviousButton = document.createElement('button');
    viewPreviousButton.textContent = 'View Previous Searches';
    viewPreviousButton.addEventListener('click', () => {
        displayWeatherData(savedWeatherData);
    });

    weatherDisplay.appendChild(viewPreviousButton);

    weatherDisplay.style.display = 'block';
}

async function handleSearch(){
    const location = searchInput.value.trim();

    try {
        const data = await fetchWeatherData(location);
        console.log(data);
        updateWeatherDisplay(data);
        errorMessage.textContent = '';
        restartButton.style.display = 'block';
    } catch (error) {
        weatherDisplay.style.display = 'none';
        errorMessage.textContent = `Error: ${error.message}`;
        restartButton.style.display = 'none';
    }
}

function restartSearch() {
  searchInput.value = "";
  weatherDisplay.style.display = "none";
  errorMessage.textContent = "";
  restartButton.style.display = "none";
}
