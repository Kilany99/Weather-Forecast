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
    


    // Function to update UI based on authentication status
    function updateUIBasedOnAuth() {
        const isAuthenticated = isLoggedIn();
        
        // Weather Forecast link - only show if authenticated
        const weatherForecastLink = $('a[href="./weather-forecast.html"]').closest('.nav-item');
        if (isAuthenticated) {
            weatherForecastLink.show();
        } else {
            weatherForecastLink.hide();
        }

        // Profile section - show different content based on auth status
        const profileSection = $('#meControl');
        const userProfileWindow = $('#userProfileWindow');
        
        if (isAuthenticated) {
            // Show authenticated profile
            profileSection.show();
            // Update profile content if needed
            updateProfileContent(true);
        } else {
            // Hide profile section for unauthenticated users or show login button
            profileSection.hide();
            showLoginButton();
        }
    }

    // Function to update profile content based on auth status
    function updateProfileContent(isAuthenticated) {
        const profileContent = $('.profile-content');
        const profileHeader = $('#profileHeader'); 

        if (isAuthenticated) {
               const userInfo = getUserInfo();
          if (userInfo) {
                // Update profile header with user name
                profileHeader.text(`${userInfo.name}'s Profile`);
                
                // Create avatar section if avatar exists
                const avatarSection = userInfo.avatar ? 
                    `<div class="text-center mb-3">
                        <img src="${userInfo.avatar}" alt="Avatar" class="rounded-circle" width="60" height="60" style="object-fit: cover;">
                    </div>` : '';
                
                // Show full profile content with actual user data
                profileContent.html(`
                    ${avatarSection}
                    <div class="user-details">
                        <p><strong>Name:</strong> ${userInfo.name}</p>
                        <p><strong>Email:</strong> ${userInfo.email}</p>
                        <p><strong>Location:</strong> ${userInfo.location}</p>
                        ${userInfo.phone !== 'No phone provided' ? `<p><strong>Phone:</strong> ${userInfo.phone}</p>` : ''}
                        <p><strong>Role:</strong> <span class="badge bg-primary">${userInfo.role}</span></p>
                        <p><strong>Member Since:</strong> ${userInfo.memberSince}</p>
                        ${userInfo.expiresAt ? `<p class="text-muted small"><strong>Session expires:</strong> ${new Date(userInfo.expiresAt * 1000).toLocaleString()}</p>` : ''}
                    </div>
                    <hr>
                    <ul class="profile-options">
                        <li><a href="#"><i class="fas fa-cog me-2"></i>Settings</a></li>
                        <li><a href="#"><i class="fas fa-heart me-2"></i>My Favorites</a></li>
                        <li><a href="#"><i class="fas fa-user-edit me-2"></i>Edit Profile</a></li>
                        <li><a id="logout" onclick="logout(); return false;" href="#"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                    </ul>
                `);
            } else {
                // Token is invalid or expired
                profileHeader.text('Profile Error');
                profileContent.html(`
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Your session has expired or is invalid. Please log in again.
                    </div>
                    <ul class="profile-options">
                        <li><a href="#" onclick="logout(); return false;">Login Again</a></li>
                    </ul>
                `);
            }
        } else {
             // Reset profile header
            profileHeader.text('User Profile');
            
            // Show login/register options
            profileContent.html(`
                <p>Please log in to access your profile</p>
                <hr>
                <ul class="profile-options">
                    <li><a href="#" onclick="showLoginForm()">Login</a></li>
                    <li><a href="#" onclick="showRegisterForm()">Register</a></li>
                </ul>
            `);
        }
    }

    //  Function to show login button instead of hiding profile
    function showLoginButton() {
        const searchContainer = $('.search-container');
        
        // Remove existing login button if any
        $('#loginButton').remove();
        
        // Add login button
        const loginButton = $(`
            <button id="loginButton" class="btn btn-outline-primary ms-2" onclick="redirectToLogin()">
                <i class="fas fa-sign-in-alt me-1"></i>Login
            </button>
        `);
        
        searchContainer.append(loginButton);
    }

   
    
        window.logout = function() {
            if(isLoggedIn){
            // Clear token from session storage
            sessionStorage.removeItem('jwtToken');
            
            // Redirect to login page
            window.location.href = '/login.html';
            }else{
                // Redirect to login page
                window.location.href = '/login.html';
            }
        }

        function isLoggedIn(){
            // Check if the token is stored in session storage
            const token = sessionStorage.getItem('jwtToken');
            if (token) {
                return true;
            } else {
                return false;
            }
        }

    setTimeout(() => {
        let searchVisible = false;
        let profileWindowVisible = false;

        // Initialize UI based on authentication status
        updateUIBasedOnAuth();

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
                $('#searchInput').val('');
                searchVisible = false;
            }
        });

        // Enhanced search functionality with auth check
        $('#searchButton').off('click').on('click', function() {
            performSearch();
        });

        $('#searchInput').off('keypress').on('keypress', function(e) {
            if (e.which === 13) {
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

        // Enhanced search function with auth check
        function performSearch() {
            const searchTerm = $('#searchInput').val().trim();
            if (searchTerm) {
                console.log('Searching for:', searchTerm);
                
                if (searchTerm.toLowerCase().includes('weather') || searchTerm.toLowerCase().includes('forecast')) {
                    // Check if user is authenticated before allowing access to weather forecast
                    if (isLoggedIn()) {
                        window.location.href = './weather-forecast.html';
                    } else {
                        alert('Please log in to access weather forecast.');
                        //  redirect to login page
                         window.location.href = './login.html';
                    }
                } else if (searchTerm.toLowerCase().includes('contact')) {
                    window.location.href = './contact-us.html';
                } else if (searchTerm.toLowerCase().includes('about')) {
                    window.location.href = './about-us.html';
                } else {
                    alert('No results found for "' + searchTerm + '". Please try a different term.');
                }
            }
        }
      
    
        // Toggle user profile window functionality (only if authenticated)
        $('#meControl').off('click').on('click', function(e) {
            e.preventDefault();
            
            if (!isLoggedIn()) {
                // If not logged in, could redirect to login or show login modal
                alert('Please log in to access your profile.');
                return;
            }

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
        $(document).off('click.profile').on('click.profile', function(e) {
            if (profileWindowVisible &&
                !$(e.target).closest('#userProfileWindow').length &&
                !$(e.target).closest('#meControl').length) {
                $('#userProfileWindow').removeClass('show');
                profileWindowVisible = false;
            }
        });

        // Active link highlighting
        $('.nav-link').each(function() {
            let currentPage = window.location.pathname.split('/').pop();
            
            if (currentPage === '' || currentPage === '/') {
                currentPage = 'index.html';
            }
            
            currentPage = currentPage.split('?')[0].split('#')[0];
            
            $('.nav-link').each(function() {
                const $link = $(this);
                let linkHref = $link.attr('href');
                
                if (linkHref) {
                    linkHref = linkHref.replace(/^\.\//, '');
                    linkHref = linkHref.split('/').pop();
                    linkHref = linkHref.split('?')[0].split('#')[0];
                }
                
                const isActive = linkHref === currentPage || 
                                (currentPage === 'index.html' && (linkHref === 'index.html' || linkHref === '' || linkHref === '/'));
                
                if (isActive) {
                    $link.addClass('active');
                } else {
                    $link.removeClass('active');
                }
            });
        });

        // Add click handler for authenticated links
        $('a[href="./weather-forecast.html"]').off('click').on('click', function(e) {
            if (!isLoggedIn()) {
                e.preventDefault();
                alert('Please log in to access weather forecast.');
                // redirect to login page
                 window.location.href = './login.html';
            }
        });

    }, 100);
}
  function redirectToLogin()
{
    window.location.href = './login.html';
}
// Function to get user info from token
    function getUserInfo() {
        const token = sessionStorage.getItem('jwtToken');
        if (!token) {
            return null;
        }
        
        const decodedToken = decodeJWTToken(token);
        if (!decodedToken) {
            return null;
        }
        
        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < currentTime) {
            console.warn('Token has expired');
            return null;
        }
        
        return {
            id: decodedToken.sub || decodedToken.id,
            name: decodedToken.name || 'Unknown User',
            email: decodedToken.email || 'No email provided',
            location: decodedToken.location || 'Location not specified',
            phone: decodedToken.phone || 'No phone provided',
            role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 'user',
            avatar: decodedToken.avatar || null,
            memberSince: decodedToken.iat ? new Date(decodedToken.iat * 1000).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
            }) : 'Unknown',
            issuedAt: decodedToken.iat,
            expiresAt: decodedToken.exp
        };
    }

      // Function to decode JWT token
    function decodeJWTToken(token) {
        try {
            // Split the token into parts
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid token format');
            }
            
            // Decode the payload (second part)
            const payload = parts[1];
            
            // Add padding if needed
            const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
            
            // Decode base64
            const decodedPayload = atob(paddedPayload);
            
            // Parse JSON
            return JSON.parse(decodedPayload);
        } catch (error) {
            console.error('Error decoding JWT token:', error);
            return null;
        }
    }