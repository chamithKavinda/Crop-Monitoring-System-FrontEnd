document.addEventListener('DOMContentLoaded', () => {
    const vehicleRegisterForm = document.getElementById('vehicle-register-form');
    const addVehicleButton = document.getElementById('add-vehicle');
    const closeButton = document.getElementById('vehicle-register-close');
    const vehicleForm = document.getElementById('vehicle-form');

    // Function to open the registration form
    const openForm = () => {
        vehicleRegisterForm.classList.add('active');
    };

    // Function to close the registration form
    const closeForm = () => {
        vehicleRegisterForm.classList.remove('active');
    };

    // Add event listeners for opening and closing the form
    if (addVehicleButton) {
        addVehicleButton.addEventListener('click', openForm);
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeForm);
    }

    // Close the form when clicking outside it
    window.addEventListener('click', (event) => {
        if (event.target === vehicleRegisterForm) {
            closeForm();
        }
    });

    //---------------------------------------------------------------------------------------------------------------

    // Check if the user is authenticated
    const isAuthenticated = () => {
        const token = localStorage.getItem('jwtToken');  // Use 'jwtToken' key to retrieve the token
        return token && token !== null;
    };

    // Save Vehicle ---------------------------------------------------------------------------------------------
    vehicleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!isAuthenticated()) {
            alert('You must be logged in to register a vehicle');
            return;
        }

        // Get form data
        const licensePlateNumber = document.getElementById('license-plate-number').value;
        const fuelType = document.getElementById('fuel-type').value;
        const status = document.getElementById('status').value;
        const vehicleCategory = document.getElementById('vehicle-category').value;
        const staffId = document.getElementById('staff-id').value;
        const remarks = document.getElementById('remarks').value;

        // Prepare the data to send
        const vehicleData = {
            licensePlateNumber,
            fuelType,
            status,
            vehicleCategory,
            staffId,
            remarks,
        };

        try {
            // Get JWT token from localStorage
            const token = localStorage.getItem('jwtToken');  // Use 'jwtToken' from localStorage
            
            // Send the data to the backend using fetch with authentication
            const response = await fetch('http://localhost:8080/api/v1/vehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Add the JWT token to the Authorization header
                },
                body: JSON.stringify(vehicleData),
            });

            // Log the raw response for debugging
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (response.ok) {
                // Parse the response only if it's not empty
                const savedVehicle = response.headers.get('Content-Length') === '0' ? {} : await response.json();
                console.log('Vehicle saved successfully:', savedVehicle);

                // Optionally, you can update the vehicle table with the new data
                addVehicleToTable(savedVehicle);

                closeForm();
            } else if (response.status === 401) {
                alert('Authentication failed. Please log in again.');
            } else {
                const errorText = await response.text(); // Read the raw response for debugging
                console.error('Failed to save vehicle. Response text:', errorText);
                alert(`Failed to save vehicle: ${errorText}`);
            }
        } catch (error) {
            console.error('Error saving vehicle:', error);
            alert(`An error occurred: ${error.message}`);
        }
    });

    // Function to dynamically add vehicle to the table
    const addVehicleToTable = (vehicle) => {
        console.log(vehicle)
        const tableBody = document.querySelector('.vehicle-table tbody');
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${vehicle.vehicleCode || 'N/A'}</td>
            <td>${vehicle.vehicleCategory || 'N/A'}</td>
            <td>${vehicle.fuelType || 'N/A'}</td>
            <td>${vehicle.licensePlateNumber || 'N/A'}</td>
            <td>${vehicle.status || 'N/A'}</td>
            <td>${vehicle.staffId || 'N/A'}</td>
            <td>${vehicle.remarks || 'N/A'}</td>
            <td><button class="update-button">Update</button></td>
            <td><button class="delete-button">Delete</button></td>
        `;
        
        tableBody.appendChild(row);
    };
});
