const API_URL = 'https://nextsparklystone16.conveyor.cloud/Auth/';

function login(email, password){
    // Clear previous messages
    $('#loginMessage').text('');
    
    // Validate email
    if (!email || !email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
        $('#loginMessage').text('Please enter a valid email address.');
        $('#loginMessage').show();
        $('#loginMessage').css('color', 'red');
        return;
    }
    
    $.ajax({
        url: API_URL + 'api/login', 
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            email: email,
            password: password
        }),
        success: function(response){
            if (response.token) {
                // Store the token in session storage
                sessionStorage.setItem('jwtToken', response.token);
                $('#loginMessage').show();
                $('#loginMessage').css('color', 'green');
                $('#loginMessage').text('Login successful! Token stored.');
                
                // Redirect after a short delay
                setTimeout(function() {
                    window.location.href = '/index.html';
                }, 1500);
            } else {
                $('#loginMessage').show();
                $('#loginMessage').css('color', 'red');
                $('#loginMessage').text('Login failed. Please check your email and password.');
                console.error('Login failed: No token received from server.', response);
            }
            console.log(response);
        },
        error: function(xhr, status, error){
            console.log('Error details:', xhr.responseText);
            $('#loginMessage').show();
            $('#loginMessage').css('color', 'red');
            
            if (xhr.status === 401) {
                $('#loginMessage').text('Invalid email or password. Please try again.');
            } else if (xhr.status === 400) {
                $('#loginMessage').text('Please check your input and try again.');
            } else {
                $('#loginMessage').text('An error occurred. Please try again later.');
            }
        }
    });
}


function register(name, email, phoneNumber, password, confirmPassword) {
    // Clear previous messages
    $('#registerMessage').text('');
    
    // Validate name
    if (!name || name.trim().length < 2) {
        $('#registerMessage').text('Please enter a valid name (at least 2 characters).');
        $('#registerMessage').show();
        $('#registerMessage').css('color', 'red');
        return;
    }
    
    // Validate email
    if (!email || !email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
        $('#registerMessage').text('Please enter a valid email address.');
        $('#registerMessage').show();
        $('#registerMessage').css('color', 'red');
        return;
    }
    
    // Validate phone number (basic validation)
    if (!phoneNumber || phoneNumber.trim().length < 10) {
        $('#registerMessage').text('Please enter a valid phone number (at least 10 digits).');
        $('#registerMessage').show();
        $('#registerMessage').css('color', 'red');
        return;
    }
    
    // Validate password
    if (!password || password.length < 6) {
        $('#registerMessage').text('Password must be at least 6 characters long.');
        $('#registerMessage').show();
        $('#registerMessage').css('color', 'red');
        return;
    }
    
    // Validate password confirmation
    if (password !== confirmPassword) {
        $('#registerMessage').text('Passwords do not match.');
        $('#registerMessage').show();
        $('#registerMessage').css('color', 'red');
        return;
    }
    
    $.ajax({
        url: API_URL + 'api/register',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phoneNumber: phoneNumber.trim(),
            password: password
        }),
        success: function(response) {
            $('#registerMessage').show();
            $('#registerMessage').css('color', 'green');
            $('#registerMessage').text('Registration successful! Redirecting to login...');
            
            // Clear form
            $('#registerName').val('');
            $('#registerEmail').val('');
            $('#registerPhoneNumber').val('');
            $('#registerPassword').val('');
            $('#registerConfirmPassword').val('');
            
            // Redirect to login page after success
            setTimeout(function() {
                window.location.href = '/login.html';
            }, 2000);
        },
        error: function(xhr, status, error) {
            console.log('Error details:', xhr.responseText);
            $('#registerMessage').show();
            $('#registerMessage').css('color', 'red');
            
            if (xhr.status === 400) {
                // Handle validation errors
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    if (errorResponse.errors) {
                        // Display specific validation errors
                        const errorMessages = errorResponse.errors.join(', ');
                        $('#registerMessage').text('Registration failed: ' + errorMessages);
                    } else if (errorResponse.message) {
                        $('#registerMessage').text(errorResponse.message);
                    } else {
                        $('#registerMessage').text('Please check your input and try again.');
                    }
                } catch (e) {
                    $('#registerMessage').text('Please check your input and try again.');
                }
            } else if (xhr.status === 500) {
                $('#registerMessage').text('Server error. Please try again later.');
            } else {
                $('#registerMessage').text('An error occurred. Please try again later.');
            }
        }
    });
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