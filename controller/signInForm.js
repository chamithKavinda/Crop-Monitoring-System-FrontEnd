const navigateBtn = document.getElementById('navigateLoginPage');
const backBtn = document.getElementById('backToWelcomePage');
const carousel = document.getElementById('carousel');
const loginForm = document.getElementById('loginForm');

// Navigate to Login Form
navigateBtn.addEventListener('click', () => {
    carousel.classList.add('swipe-left');
    loginForm.classList.add('active');
});

// Navigate back to Carousel
backBtn.addEventListener('click', () => {
    carousel.classList.remove('swipe-left');
    loginForm.classList.remove('active');
});

const loginBtn = document.getElementById('log');

loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    // Clear any existing error messages
    const existingErrorMsg = document.getElementById('error-message');
    if (existingErrorMsg) {
        existingErrorMsg.remove();
    }

    // Make the API request to login
    const response = await fetch('http://localhost:8080/api/v1/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        // Parse the response to extract the token (assuming the token is sent in the response)
        const data = await response.json();

        // Store the JWT token in localStorage
        const token = data.token; 
        localStorage.setItem('jwtToken', token);  // Store token as 'jwtToken'

        // Redirect to the home page or dashboard
        window.location.href = '/index.html';
    } else {
        // Show error message
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'Invalid email or password';
        errorMsg.style.color = 'red';
        errorMsg.id = 'error-message'; // Set an ID for the error message element
        document.getElementById('login-form').appendChild(errorMsg);

        // Clear the input fields
        document.getElementById('email-login').value = '';
        document.getElementById('password-login').value = '';

        // Remove the error message after 2 seconds
        setTimeout(() => {
            const errorMsg = document.getElementById('error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }, 2000); // 2 seconds
    }
});





