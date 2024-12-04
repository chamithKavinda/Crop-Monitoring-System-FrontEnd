document.addEventListener('DOMContentLoaded', () => {
    const userRegisterForm = document.getElementById('user-register-form');
    const addUserButton = document.getElementById('add-user');
    const closeButton = document.getElementById('user-register-close');
    const userForm = document.getElementById('user-form');
    const tableBody = document.querySelector('.user-table tbody');
    const formTitle = document.querySelector('.user-register-title');
    const togglePasswordIcon = document.getElementById('toggle-password');
    const passwordField = document.getElementById('user-password');

    let currentUserEmail = null; 

    // Toggle password visibility 
    if (togglePasswordIcon && passwordField) {
        togglePasswordIcon.addEventListener('click', () => {
            const type = passwordField.type === 'password' ? 'text' : 'password';
            passwordField.type = type;
            togglePasswordIcon.innerHTML = type === 'password' ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
        });
    }

    // Open the registration form
    const openForm = () => {
        userRegisterForm.classList.add('active');
    };

    // Close the registration form
    const closeForm = () => {
        userRegisterForm.classList.remove('active');
    };

    // Add event listeners for opening and closing the form
    if (addUserButton) {
        addUserButton.addEventListener('click', () => {
            openForm();
            formTitle.textContent = 'Register User';
            clearForm();
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeForm);
    }

    // Close the form when clicking outside it
    window.addEventListener('click', (event) => {
        if (event.target === userRegisterForm) {
            closeForm();
        }
    });

    // Check if the user is authenticated
    const isAuthenticated = () => {
        const token = localStorage.getItem('jwtToken');
        return token && token !== null;
    };

    // Fetch and display user data
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('http://localhost:8080/api/v1/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const users = await response.json();
                tableBody.innerHTML = '';
                users.forEach(addUserToTable);
            } else if (response.status === 401) {
                alert('Authentication failed. Please log in again.');
            } else {
                const errorText = await response.text();
                console.error('Failed to fetch users:', errorText);
                alert('Failed to fetch users. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('An error occurred while fetching users.');
        }
    };

    // Save user data
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!isAuthenticated()) {
            alert('You must be logged in to register or update a user');
            return;
        }

        const email = document.getElementById('user-email').value.trim();
        const password = document.getElementById('user-password').value.trim();
        const role = document.getElementById('user-role').value.trim();

        const userData = {
            email,
            password,
            role,
        };

        try {
            const token = localStorage.getItem('jwtToken');
            let response;

            if (currentUserEmail) {
                response = await fetch(`http://localhost:8080/api/v1/user/${currentUserEmail}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(userData),
                });
            } else {
                response = await fetch('http://localhost:8080/api/v1/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(userData),
                });
            }

            if (response.ok || response.status === 201) {
                await fetchUsers();
                clearForm();
                closeForm();
                currentUserEmail = null;
            } else {
                const errorText = await response.text();
                console.error('Failed to save user. Response text:', errorText);
                alert(`Failed to save user: ${errorText}`);
            }
        } catch (error) {
            console.error('Error saving user:', error);
            alert(`An error occurred: ${error.message}`);
        }
    });

    // Add user to the table
    const addUserToTable = (user) => {
        const row = document.createElement('tr');

        const shortPassword = user.password ? user.password.substring(0, 10) : 'N/A';

        row.innerHTML = `
            <td>${user.email || 'N/A'}</td>
            <td>${shortPassword || 'N/A'}</td>
            <td>${user.role || 'N/A'}</td>
            <td><span class="update-button"><i class="fas fa-edit"></i></span></td>
            <td><span class="delete-button"><i class="fas fa-trash"></i></span></td>
        `;

        row.querySelector('.update-button').addEventListener('click', () => {
            openForm();
            formTitle.textContent = 'Update User';
            populateUpdateForm(user);
        });

        row.querySelector('.delete-button').addEventListener('click', () => {
            deleteUser(user.email);
        });

        tableBody.appendChild(row);
    };

    // Populate form for updating a user
    const populateUpdateForm = (user) => {
        document.getElementById('user-email').value = user.email || '';
        document.getElementById('user-password').value = user.password || '';
        document.getElementById('user-role').value = user.role || '';

        currentUserEmail = user.email;
    };

    // Clear form
    const clearForm = () => {
        userForm.reset();
        currentUserEmail = null;
    };

   // Delete a user with confirmation
    const deleteUser = async (email) => {
        if (!isAuthenticated()) {
            alert('You must be logged in to delete a user');
            return;
        }

        // Ask for confirmation before deleting the user
        const isConfirmed = confirm('Are you sure you want to delete this user?');
        if (!isConfirmed) {
            return; 
        }

        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`http://localhost:8080/api/v1/user/${email}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert('User deleted successfully');
                await fetchUsers();  
            } else {
                const errorText = await response.text();
                console.error('Failed to delete user:', errorText);
                alert(`Failed to delete user: ${errorText}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(`An error occurred: ${error.message}`);
        }
    };

    // Fetch users on page load
    fetchUsers();
});
