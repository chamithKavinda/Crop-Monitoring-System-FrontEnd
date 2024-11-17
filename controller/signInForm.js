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