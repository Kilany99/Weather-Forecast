const API_KEY = '5da6d3d4a6634da18a0120115251606';

async function getWeather(city) {
    try {
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&days=5&alerts=yes&lang=en`);
        const data = await response.json();
        
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error.message);
        }
    } catch (error) {
        console.error('Failed to fetch weather:', error);
        throw error;
    }
}

// Hide weather details initially
document.querySelector('.weather-details').style.display = 'none';

// Reset form on click
document.getElementById('form-reset').addEventListener('click', () => {
    const weatherDetails = document.querySelector('.weather-details');
    weatherDetails.style.animation = 'fadeout 1s';
    weatherDetails.addEventListener('animationend', () => {
        weatherDetails.style.display = 'none';
        weatherDetails.style.animation = '';
    }, { once: true });
});



document.getElementById('weather-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form submission
    const city = document.getElementById('city-input').value.trim();
    
    if (!city) {
        document.getElementById('city-input').classList.add('is-invalid');
        return;
    }

    try {
        const data = await getWeather(city);
        
        // Update the UI
        document.getElementById('city-name').textContent = data.location.name;
        document.getElementById('country').textContent = data.location.country;
        document.getElementById('temperature').textContent = data.current.temp_c;
        document.getElementById('condition').textContent = data.current.condition.text;
        document.getElementById('humidity').textContent = data.current.humidity;
        document.getElementById('wind-speed').textContent = (data.current.wind_kph / 3.6).toFixed(1);
        document.getElementById('last-updated').textContent = data.current.last_updated;
        // Set the condition icon as an image source
        const iconElement = document.getElementById('condition-icon');
        iconElement.src = data.current.condition.icon;
        iconElement.style.display = 'inline'; // Make sure the icon is visible


        
        // Show weather details
        document.querySelector('.weather-details').style.display = 'block';
        document.getElementById('city-input').classList.remove('is-invalid');
    } catch (error) {
        document.getElementById('city-input').classList.add('is-invalid');
        console.error('Error:', error.message);
    }
});


// Location search functionality
async function searchLocation() {
    const searchInput = document.getElementById('location-search');
    const location = searchInput.value.trim();
    
    if (location) {
        try {
            const data = await getWeather(location);
            
            // Update the UI
            document.getElementById('temperature').textContent = data.current.temp_c;
            document.getElementById('condition').textContent = data.current.condition.text;
            document.getElementById('condition-icon').src = data.current.condition.icon;
            // Show weather details
            document.querySelector('.results').style.display = 'block';
            searchInput.value = '';
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}

function selectLocation(location) {
    document.getElementById('location-search').value = location;
    searchLocation();
}