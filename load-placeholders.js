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
                initializeNavbar();
            }else {
                console.error(`Element with ID ${elementId} not found.`);
            }
        })
        .catch(error => {
            console.error('Error loading placeholders:', error);
        });
}

function initializeNavbar() {
   
        setTimeout(() => {
            let searchVisible = false;
            let profileWindowVisible = false; //a flag for profile window
            // Toggle search functionality
            $('#searchIcon').off('click').on('click', function(e) {
                e.preventDefault();
                const $searchContainer = $('#searchInputContainer');
                const $searchIcon = $(this);
                
                if (!searchVisible) {
                    // Show search
                    $searchContainer.addClass('show');
                    $searchIcon.addClass('pulse');
                    $('#searchInput').focus();
                    searchVisible = true;
                } else {
                    // Hide search
                    $searchContainer.removeClass('show');
                    $searchIcon.removeClass('pulse');
                    $('#searchInput').val(''); // Clear input
                    searchVisible = false;
                }
            });

            // Search functionality
            $('#searchButton').off('click').on('click', function() {
                performSearch();
            });

            $('#searchInput').off('keypress').on('keypress', function(e) {
                if (e.which === 13) { // Enter key
                    performSearch();
                }
            });

            // Close search when clicking outside
            $(document).off('click.search').on('click.search', function(e) {
                if (!$(e.target).closest('.search-container').length && searchVisible) {
                    $('#searchInputContainer').removeClass('show');
                    $('#searchIcon').removeClass('pulse');
                    searchVisible = false;
                }
            });

            //  Search function
            function performSearch() {
                const searchTerm = $('#searchInput').val().trim();
                if (searchTerm) {
                    console.log('Searching for:', searchTerm);
                    
                    if (searchTerm.toLowerCase().includes('weather') || searchTerm.toLowerCase().includes('forecast')) {
                        window.location.href = './weather-forecast.html';
                    } else if (searchTerm.toLowerCase().includes('contact')) {
                        window.location.href = './contact-us.html';
                    } else if (searchTerm.toLowerCase().includes('about')) {
                        window.location.href = './about-us.html';
                    }
                    else {
                        alert('No results found for "' + searchTerm + '". Please try a different term.');
                    }
                }
            }
               // Toggle user profile window functionality
            $('#meControl').off('click').on('click', function(e) {
                e.preventDefault(); // Prevent any default link behavior
                const $profileWindow = $('#userProfileWindow');

                if (!profileWindowVisible) {
                    // Hide search if it's open
                    $('#searchInputContainer').removeClass('show');
                    $('#searchIcon').removeClass('pulse');
                    searchVisible = false;

                    // Show profile window
                    $profileWindow.addClass('show');
                    profileWindowVisible = true;
                } else {
                    // Hide profile window
                    $profileWindow.removeClass('show');
                    profileWindowVisible = false;
                }
            });

            // Close profile window when clicking the 'x' button
            $('#userProfileWindow .close-profile-btn').off('click').on('click', function() {
                $('#userProfileWindow').removeClass('show');
                profileWindowVisible = false;
            });

            // Close profile window when clicking outside
            // Use a different namespace for this click event to avoid conflicts
            $(document).off('click.profile').on('click.profile', function(e) {
                // Check if the click target is NOT within .user-profile-window AND NOT #meControl AND profile window is visible
                if (profileWindowVisible &&
                    !$(e.target).closest('#userProfileWindow').length &&
                    !$(e.target).closest('#meControl').length) {
                    $('#userProfileWindow').removeClass('show');
                    profileWindowVisible = false;
                }
            });
            // Active link highlighting
            $('.nav-link').each(function() {
                 // Get current page name from URL
                let currentPage = window.location.pathname.split('/').pop();
                
                // Handle empty pathname (root directory) - default to index.html
                if (currentPage === '' || currentPage === '/') {
                    currentPage = 'index.html';
                }
                
                // Remove any query parameters or hash fragments
                currentPage = currentPage.split('?')[0].split('#')[0];
                
                $('.nav-link').each(function() {
                    const $link = $(this);
                    let linkHref = $link.attr('href');
                    
                    // Clean up the href attribute
                    if (linkHref) {
                        // Remove ./ prefix if present
                        linkHref = linkHref.replace(/^\.\//, '');
                        
                        // Extract just the filename
                        linkHref = linkHref.split('/').pop();
                        
                        // Remove query parameters and hash fragments
                        linkHref = linkHref.split('?')[0].split('#')[0];
                    }
                    
                    // Check for matches
                    const isActive = linkHref === currentPage || 
                                    (currentPage === 'index.html' && (linkHref === 'index.html' || linkHref === '' || linkHref === '/'));
                    
                    if (isActive) {
                        $link.addClass('active');
                    } else {
                        $link.removeClass('active');
                    }
                });
            });



        }, 100);
    
    
}
