const API_KEY = '5da6d3d4a6634da18a0120115251606';
let weatherData = null; // Store weather data globally for forecast options

async function getWeather(city) {
    try {
        // Using jQuery's $.ajax for the API request
        const data = await $.ajax({
            url: `http://api.weatherapi.com/v1/forecast.json`,
            method: 'GET',
            data: {
                key: API_KEY,
                q: city,
                days: 5, // Request 5 days of forecast data
                aqi: 'yes',  // Include air quality index
                alerts: 'no'
            }
        });


        if (data && data.error) {
            throw new Error(data.error.message);
        }
        return data;

    } catch (error) {

        let errorMessage = 'Failed to fetch weather data.';
        if (error.responseJSON && error.responseJSON.error && error.responseJSON.error.message) {
            errorMessage = error.responseJSON.error.message;
        } else if (error.message) {
            errorMessage = error.message;
        }
        console.error('Failed to fetch weather:', errorMessage);
        throw new Error(errorMessage);
    }
}

// Hide all weather sections initially
function hideAllWeatherSections() {
    $('.weather-details').hide();
    $('#five-day-forecast').hide();
    $('#hourly-forecast').hide();
}

// Display current weather
function displayCurrentWeather(data) {
    $('.weather-details').show(); // Show the current weather section

    $('#city-name').text(data.location.name);
    $('#country').text(data.location.country);
    $('#temperature').text(data.current.temp_c);
    $('#condition').text(data.current.condition.text);
    $('#humidity').text(data.current.humidity);
    $('#wind-speed').text((data.current.wind_kph / 3.6).toFixed(1)); // Convert to m/s
    $('#last-updated').text(data.current.last_updated);

    const $iconElement = $('#condition-icon');
    $iconElement.attr('src', data.current.condition.icon).show(); // Set src and ensure it's visible
}

// Display 5-day forecast
function displayFiveDayForecast(data) {
    const $forecastContainer = $('#forecast-cards-container');
    $forecastContainer.empty(); // Clear previous forecast cards using .empty()
    $('#five-day-forecast').show(); // Show the 5-day forecast section

    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        const card = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body text-center">
                        <h5 class="card-title">${formattedDate}</h5>
                        <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" class="mb-2">
                        <p class="card-text">Max Temp: ${day.day.maxtemp_c}°C</p>
                        <p class="card-text">Min Temp: ${day.day.mintemp_c}°C</p>
                        <p class="card-text">Condition: ${day.day.condition.text}</p>
                    </div>
                </div>
            </div>
        `;
        $forecastContainer.append(card); // Append the card HTML
    });
}

// Display hourly forecast for the current day
function displayHourlyForecast(data) {
    const $hourlyListContainer = $('#hourly-list-container');
    $hourlyListContainer.empty(); // Clear previous hourly items
    $('#hourly-forecast').show(); // Show the hourly forecast section

    const todayForecast = data.forecast.forecastday[0]; // Get today's forecast data
    $('#hourly-forecast-date').text(todayForecast.date);

    todayForecast.hour.forEach(hour => {
        const time = new Date(hour.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const listItem = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${time}</span>
                <img src="${hour.condition.icon}" alt="${hour.condition.text}" width="30px" height="30px">
                <span>${hour.temp_c}°C</span>
                <span>${hour.condition.text}</span>
            </li>
        `;
        $hourlyListContainer.append(listItem); // Append the list item HTML
    });
}

// --- Document Ready and Event Listeners ---
$(document).ready(function() {
    // Hide weather details initially
    $('.weather-details').hide();
    $('#five-day-forecast').hide();
    $('#hourly-forecast').hide();

    // Reset form on click
    $('#form-reset').on('click', function() {
        hideAllWeatherSections(); // Hide all sections on reset
        const $weatherDetails = $('.weather-details');
        // Using jQuery's fadeOut for animation, then a callback to ensure it's hidden
        $weatherDetails.fadeOut(1000, function() {
            $(this).hide(); // Ensure it's fully hidden after fadeOut
            $(this).css('animation', ''); // Clear any lingering animation style
        });

        // Clear input and error message
        $('#city-input').val(''); // Use .val() for input fields
        $('#city-input').removeClass('is-invalid');
        $('#error-message').hide();
    });

    // Handle form submission
    $('#weather-form').on('submit', async function(e) {
        e.preventDefault(); // Prevent form submission
        const city = $('#city-input').val().trim(); // Use .val() to get input value

        if (!city) {
            $('#city-input').addClass('is-invalid');
            $('#error-message').hide(); // Hide error if city input is empty (for immediate feedback)
            return;
        }

        try {
            weatherData = await getWeather(city); // Store data globally
            hideAllWeatherSections(); // Hide all sections before displaying current
            displayCurrentWeather(weatherData);
            $('#city-input').removeClass('is-invalid');
            $('#error-message').hide();
        } catch (error) {
            $('#city-input').addClass('is-invalid');
            $('#error-message').text(error.message || 'Could not find weather for this city. Please try again.').show();
            console.error('Error:', error.message);
            hideAllWeatherSections(); // Hide weather details on error
        }
    });

    // Event listeners for forecast buttons
    $('#show-current-weather').on('click', function() {
        if (weatherData) {
            hideAllWeatherSections();
            displayCurrentWeather(weatherData);
        } else {
            $('#error-message').text('Please search for a city first to view current weather.').show();
        }
    });

    $('#show-5day-forecast').on('click', function() {
        if (weatherData) {
            hideAllWeatherSections();
            displayFiveDayForecast(weatherData);
        } else {
            $('#error-message').text('Please search for a city first to view the 5-day forecast.').show();
        }
    });

    $('#show-hourly-forecast').on('click', function() {
        if (weatherData) {
            hideAllWeatherSections();
            displayHourlyForecast(weatherData);
        } else {
            $('#error-message').text('Please search for a city first to view the hourly forecast.').show();
        }
    });
        addLocationTagEffects();

});


// Function to search for weather based on input field
async function searchLocation() {
    const locationInput = document.getElementById('location-search');
    const city = locationInput.value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    
 
    
    try {
        const data = await getWeather(city);
        weatherData = data; // Store globally
        displayWeatherData(data);
        
        // Clear the input field after successful search
        locationInput.value = '';
        
    } catch (error) {
        showErrorState(error.message);
    }
}

// Function to select a predefined location
async function selectLocation(city) {

    
    // Also update the input field to show selected city
    document.getElementById('location-search').value = city;
    
    try {
        const data = await getWeather(city);
        weatherData = data; // Store globally
        displayWeatherData(data);
        
    } catch (error) {
        showErrorState(error.message);
    }
}

// Function to display weather data in the results div
function displayWeatherData(data) {
    const temperature = document.getElementById('temperature');
    const condition = document.getElementById('condition');
    const conditionIcon = document.getElementById('condition-icon');
    
    if (data && data.current) {
        // Update temperature
        temperature.textContent = Math.round(data.current.temp_c);
        
        // Update condition
        condition.textContent = data.current.condition.text;
        
        // Update condition icon
        conditionIcon.src = `https:${data.current.condition.icon}`;
        conditionIcon.alt = data.current.condition.text;
        conditionIcon.style.display = 'inline';
        
        // Show results container
        document.querySelector('.results').style.display = 'block';
        
        console.log('Weather data updated successfully for:', data.location.name);
    }
}
function addLocationTagEffects() {
    const locationTags = document.querySelectorAll('.location-tag');
    
    locationTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        tag.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}