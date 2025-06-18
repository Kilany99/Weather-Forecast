// Use OpenStreetMap with Leaflet using jQuery
function loadLeafletMap() {
    // Add Leaflet CSS and JS using jQuery
    $('<link>')
        .attr({
            rel: 'stylesheet',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css'
        })
        .appendTo('head');

    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js')
        .done(function() {
            initLeafletMap();
        });
}

function initLeafletMap() {
    $('#map-placeholder').hide();
    $('#map').show();

    const map = L.map('map').setView([30.06263, 31.24967], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const customIcon = L.divIcon({
        html: '<i class="fas fa-map-marker-alt" style="color: #667eea; font-size: 30px;"></i>',
        iconSize: [30, 30],
        className: 'custom-div-icon'
    });

    L.marker([30.06263, 31.24967], {icon: customIcon})
        .addTo(map)
        .bindPopup(`
            <div style="font-family: 'Segoe UI', sans-serif;">
                <h5 style="color: #667eea;">WeatherCast HQ</h5>
                <p><strong>Location:</strong> Cairo, Egypt</p>
                <p><strong>Services:</strong> Weather Forecasting</p>
            </div>
        `);
}

function initializeMap() {
    loadLeafletMap();
}
