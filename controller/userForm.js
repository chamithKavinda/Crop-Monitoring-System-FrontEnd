document.addEventListener('DOMContentLoaded', () => {
    // Elements for the User Registration Form
    const userRegisterForm = document.getElementById('user-register-form');
    const addUserButton = document.getElementById('add-user');
    const closeButton = document.getElementById('user-register-close');
    const passwordField = document.getElementById('user-password');
    const togglePasswordButton = document.getElementById('toggle-password');
    const toggleIcon = togglePasswordButton.querySelector('i');

    // Open the form
    const openForm = () => {
        console.log('Opening User Registration Form...');
        userRegisterForm.classList.add('active');
    };

    // Close the form
    const closeForm = () => {
        console.log('Closing User Registration Form...');
        userRegisterForm.classList.remove('active');
    };

    // Add event listener for opening the form
    if (addUserButton) {
        addUserButton.addEventListener('click', openForm);
    } else {
        console.error("Add User button (id: 'add-user') not found!");
    }

    // Add event listener for closing the form
    if (closeButton) {
        closeButton.addEventListener('click', closeForm);
    } else {
        console.error("Close button (id: 'user-register-close') not found!");
    }

    // Close the form when clicking outside it
    window.addEventListener('click', (event) => {
        if (event.target === userRegisterForm) {
            closeForm();
        }
    });

    // Toggle password visibility with icon change
    if (togglePasswordButton && passwordField) {
        togglePasswordButton.addEventListener('click', () => {
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            }
        });
    } else {
        console.error("Password field or toggle button not found!");
    }
});
