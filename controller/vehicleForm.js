document.addEventListener('DOMContentLoaded', () => {
    const vehicleRegisterForm = document.getElementById('vehicle-register-form');
    const addVehicleButton = document.getElementById('add-vehicle');
    const closeButton = document.getElementById('vehicle-register-close');
    const vehicleForm = document.getElementById('vehicle-form');
    const tableBody = document.querySelector('.vehicle-table tbody');

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

    // Check if the user is authenticated
    const isAuthenticated = () => {
        const token = localStorage.getItem('jwtToken');
        return token && token !== null;
    };

    // Fetch and display vehicle data from the backend
    const fetchVehicles = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('http://localhost:8080/api/v1/vehicles', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const vehicles = await response.json();

                // Clear existing table rows
                tableBody.innerHTML = '';

                // Populate the table with the latest data
                vehicles.forEach(addVehicleToTable);
            } else if (response.status === 401) {
                alert('Authentication failed. Please log in again.');
            } else {
                const errorText = await response.text();
                console.error('Failed to fetch vehicles:', errorText);
                alert('Failed to fetch vehicles. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            alert('An error occurred while fetching vehicles.');
        }
    };

    // Save vehicle data
    vehicleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!isAuthenticated()) {
            alert('You must be logged in to register a vehicle');
            return;
        }

        // Get form data
        const licensePlateNumber = document.getElementById('license-plate-number').value.trim();
        const fuelType = document.getElementById('fuel-type').value.trim();
        const status = document.getElementById('status').value.trim();
        const vehicleCategory = document.getElementById('vehicle-category').value.trim();
        const staffId = document.getElementById('staff-id').value.trim();
        const remarks = document.getElementById('remarks').value.trim();

        const vehicleData = {
            licensePlateNumber,
            fuelType,
            status,
            vehicleCategory,
            staffId,
            remarks,
        };

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('http://localhost:8080/api/v1/vehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(vehicleData),
            });

            if (response.ok || response.status === 201) {
                // Vehicle saved successfully, now fetch the updated list
                await fetchVehicles();

                // Clear the form fields
                clearForm();

                // Close the registration form
                closeForm();
            } else {
                const errorText = await response.text();
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

    // Function to clear the form fields
    const clearForm = () => {
        vehicleForm.reset();
    };

    // Fetch vehicles on page load
    fetchVehicles();
});
