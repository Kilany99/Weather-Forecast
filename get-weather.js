let weatherData = null; // Store weather data globally for forecast options

async function getWeather(city) {
    try {
            const token = sessionStorage.getItem('jwtToken');
            if (!token) {
            $('#error-message').show();
            $('#error-message').text("User not found. Please log in first!!.");
            setTimeout(function() {
            window.location.href = '/login.html';
            },1500 );
        }
        const data = await $.ajax({
            url: `https://nextsparklystone16.conveyor.cloud/api/Weather/forecast`,
            method: 'GET',
            data: {
                CityName: city,
                NumberOfDays: 5, // Request 5 days of forecast data
            },
             headers: {
                'Authorization': 'Bearer ' + token
            },
            
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

      $('#city-name').text(data.cityName || 'Unknown City');
    $('#country').text(data.countryName || 'Unknown Country');
    $('#temperature').text(data.currentTemperatureC || 'N/A');
    $('#condition').text(data.conditionText || 'N/A');
    $('#humidity').text(data.humidity || 'N/A');
    $('#wind-speed').text(data.windSpeed ? (data.windSpeed / 3.6).toFixed(1) : 'N/A'); // Convert to m/s if needed
    $('#last-updated').text(data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'N/A');
    const $iconElement = $('#condition-icon');
    $iconElement.attr('src', data.conditionIconUrl).show();

     // Add country flag
    if (data.countryName && data.countryName !== 'Unknown Country') {
        const flagUrl = getFlagUrl(data.countryName, 'flat', '32');
        
        // Check if flag element already exists, if not create it
        let $flagElement = $('#country-flag');
        if ($flagElement.length === 0) {
            // Create flag element and insert it after the country name
            $flagElement = $('<img>', {
                id: 'country-flag',
                width: '32px',
                height: '24px',
                style: 'margin-left: 8px; vertical-align: middle; border-radius: 2px;',
                alt: 'Country flag'
            });
            $('#country').after($flagElement);
        }
        
        // Set flag source with error handling
        $flagElement.attr('src', flagUrl)
                   .attr('alt', `${data.countryName} flag`)
                   .show()
                   .on('error', function() {
                       // If flag fails to load, try with a different style or hide
                       const fallbackUrl = getFlagUrl(data.countryName, 'shiny', '32');
                       if (this.src !== fallbackUrl) {
                           this.src = fallbackUrl;
                       } else {
                           $(this).hide();
                       }
                   });
    }
   
}

// Display 5-day forecast
function displayFiveDayForecast(data) {
    const $forecastContainer = $('#forecast-cards-container');
    $forecastContainer.empty(); // Clear previous forecast cards
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
        $weatherDetails.fadeOut(1000, function() {
            $(this).hide(); 
            $(this).css('animation', ''); 
        });
     

        // Clear input and error message
        $('#city-input').val(''); // Use .val() for input fields
        $('#city-input').removeClass('is-invalid');
        $('#error-message').hide();
    });

    // Handle form submission
    $('#weather-form').on('submit', async function(e) {
        e.preventDefault(); // Prevent form submission
        const city = $('#city-input').val().trim(); 

        if (!city) {
            $('#city-input').addClass('is-invalid');
            $('#error-message').hide(); // Hide error if city input is empty 
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
    const cityName = document.getElementById('city-name');
    if (data) {
        // Update temperature
        temperature.textContent = Math.round(data.currentTemperatureC);
        
        // Update condition
        condition.textContent = data.conditionText;
        cityName.textContent = data.cityName;
        // Update condition icon
        conditionIcon.src = `https:${data.conditionIconUrl}`;
        conditionIcon.alt = data.conditiontext;
        conditionIcon.style.display = 'inline';
        
        // Show results container
        document.querySelector('.results').style.display = 'block';
        
        console.log('Weather data updated successfully for:', data.cityName);
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

// Function to get flag URL from Flags API
function getFlagUrl(countryName, style = 'flat', size = '32') {
    const countryCode = getCountryCode(countryName);
    
    // Flags API formats:
    // Flat: https://flagsapi.com/{country_code}/flat/{size}.png
    // Shiny: https://flagsapi.com/{country_code}/shiny/{size}.png
    // Sizes: 16, 24, 32, 48, 64
    
    return `https://flagsapi.com/${countryCode}/${style}/${size}.png`;
}






//helper function to get country code from name
 function getCountryCode(countryName) {
    // Common country name to ISO code mapping
    const countryMap = {
        'united states': 'US',
        'usa': 'US',
        'united kingdom': 'GB',
        'uk': 'GB',
        'canada': 'CA',
        'australia': 'AU',
        'germany': 'DE',
        'france': 'FR',
        'italy': 'IT',
        'spain': 'ES',
        'japan': 'JP',
        'china': 'CN',
        'india': 'IN',
        'brazil': 'BR',
        'russia': 'RU',
        'mexico': 'MX',
        'argentina': 'AR',
        'south africa': 'ZA',
        'egypt': 'EG',
        'nigeria': 'NG',
        'kenya': 'KE',
        'morocco': 'MA',
        'turkey': 'TR',
        'greece': 'GR',
        'netherlands': 'NL',
        'belgium': 'BE',
        'switzerland': 'CH',
        'austria': 'AT',
        'poland': 'PL',
        'sweden': 'SE',
        'norway': 'NO',
        'denmark': 'DK',
        'finland': 'FI',
        'ireland': 'IE',
        'portugal': 'PT',
        'czech republic': 'CZ',
        'hungary': 'HU',
        'romania': 'RO',
        'bulgaria': 'BG',
        'croatia': 'HR',
        'serbia': 'RS',
        'ukraine': 'UA',
        'thailand': 'TH',
        'vietnam': 'VN',
        'singapore': 'SG',
        'malaysia': 'MY',
        'indonesia': 'ID',
        'philippines': 'PH',
        'south korea': 'KR',
        'taiwan': 'TW',
        'hong kong': 'HK',
        'new zealand': 'NZ',
        'chile': 'CL',
        'peru': 'PE',
        'colombia': 'CO',
        'venezuela': 'VE',
        'ecuador': 'EC',
        'uruguay': 'UY',
        'paraguay': 'PY',
        'bolivia': 'BO',
        'saudi arabia': 'SA',
        'united arab emirates': 'AE',
        'qatar': 'QA',
        'kuwait': 'KW',
        'bahrain': 'BH',
        'oman': 'OM',
        'jordan': 'JO',
        'lebanon': 'LB',
        'israel': 'IL',
        'iran': 'IR',
        'iraq': 'IQ',
        'afghanistan': 'AF',
        'pakistan': 'PK',
        'bangladesh': 'BD',
        'sri lanka': 'LK',
        'nepal': 'NP',
        'bhutan': 'BT',
        'maldives': 'MV'
    };
        // Convert to lowercase for matching
    const lowerCountryName = countryName.toLowerCase().trim();
    
    // Try direct mapping first
    if (countryMap[lowerCountryName]) {
        return countryMap[lowerCountryName];
    }
    
    // Try partial matching for cases like "United States of America"
    for (const [key, code] of Object.entries(countryMap)) {
        if (lowerCountryName.includes(key) || key.includes(lowerCountryName)) {
            return code;
        }
    }
    
    // If no match found, try to extract first two letters as fallback
    return countryName.substring(0, 2).toUpperCase();
}