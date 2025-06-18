function loadPlaceholders(elementId, filepath) {
    fetch(filepath)
        .then(response => {
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const placeHolder = document.getElementById (elementId);
            if(placeHolder) {
                placeHolder.innerHTML = html;
            }else {
                console.error(`Element with ID ${elementId} not found.`);
            }
        })
        .catch(error => {
            console.error('Error loading placeholders:', error);
        });
}


