   $(document).ready(function() {
            // Load navbar and footer
            if (typeof loadPlaceholders === 'function') {
                loadPlaceholders('navbar-placeholder', '/nav-bar.html');
                loadPlaceholders('footer-placeholder', '/footer.html');
            }

            const ratingTexts = {
                1: "Poor - We'll do better next time",
                2: "Fair - Room for improvement",
                3: "Good - Thanks for your feedback",
                4: "Very Good - We're glad you're satisfied",
                5: "Excellent - Thank you for your trust!"
            };

            // Star rating functionality
            $('.star-rating .fa-star').on('click', function() {
                const rating = $(this).data('rating');
                $('#rating-value').val(rating);
                $('#rating-text').text(ratingTexts[rating]);
                
                // Remove all active classes
                $('.star-rating .fa-star').removeClass('active filled');
                
                // Add active class to clicked stars
                $('.star-rating .fa-star').each(function() {
                    if ($(this).data('rating') <= rating) {
                        $(this).addClass('active');
                    }
                });
            });

            // Hover effect for stars
            $('.star-rating .fa-star').hover(
                function() {
                    const rating = $(this).data('rating');
                    $('.star-rating .fa-star').removeClass('filled');
                    $('.star-rating .fa-star').each(function() {
                        if ($(this).data('rating') <= rating) {
                            $(this).addClass('filled');
                        }
                    });
                },
                function() {
                    $('.star-rating .fa-star').removeClass('filled');
                }
            );

            // Form submission
            $('#contact-form').on('submit', function(event) {
                event.preventDefault();
                
                // Check if form is valid
                if (!this.checkValidity()) {
                    event.stopPropagation();
                    $(this).addClass('was-validated');
                    return;
                }

                // Check if rating is selected
                if (!$('#rating-value').val()) {
                    alert('Please select a rating before submitting.');
                    return;
                }

                // Add loading state
                $(this).addClass('loading');
                
                // Simulate form submission
                setTimeout(function() {
                    $('#contact-form').removeClass('loading');
                    $('#success-message').slideDown(500);
                    
                    // Reset form
                    $('#contact-form')[0].reset();
                    $('#contact-form').removeClass('was-validated');
                    $('.star-rating .fa-star').removeClass('active filled');
                    $('#rating-value').val('');
                    $('#rating-text').text('Click on stars to rate us');
                    
                    // Hide success message after 5 seconds
                    setTimeout(function() {
                        $('#success-message').slideUp(500);
                    }, 5000);
                }, 1500);
            });

            // Real-time validation
            $('.form-control').on('input', function() {
                if ($(this).val().trim() !== '') {
                    $(this).addClass('is-valid').removeClass('is-invalid');
                } else {
                    $(this).addClass('is-invalid').removeClass('is-valid');
                }
            });
        });