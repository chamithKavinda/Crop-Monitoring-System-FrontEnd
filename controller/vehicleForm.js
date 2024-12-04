document.addEventListener('DOMContentLoaded', () => {
    const vehicleRegisterForm = document.getElementById('vehicle-register-form');
    const addVehicleButton = document.getElementById('add-vehicle');
    const closeButton = document.getElementById('vehicle-register-close');
    const vehicleForm = document.getElementById('vehicle-form');
    const tableBody = document.querySelector('.vehicle-table tbody');
    const staffIdDropdown = document.getElementById('staff-id');
    const formTitle = document.querySelector('.vehicle-register-title');
    let currentVehicleId = null; 

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
        addVehicleButton.addEventListener('click', () => {
            openForm();
            formTitle.textContent = 'Register Vehicle'; 
            clearForm();
        });
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
                tableBody.innerHTML = '';
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

    // Fetch staff IDs and populate the dropdown
    const fetchStaffIds = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('http://localhost:8080/api/v1/staff', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const staffList = await response.json();
                staffIdDropdown.innerHTML = `<option value="">Select Staff ID</option>`; options

                // Filter out staff entries with undefined or null staffId
                staffList
                    .filter(staff => staff.staffId) 
                    .forEach((staff) => {
                        const option = document.createElement('option');
                        option.value = staff.staffId;
                        option.textContent = staff.staffId; 
                        staffIdDropdown.appendChild(option);
                    });
            } else {
                console.error('Failed to fetch staff IDs:', await response.text());
                alert('Failed to fetch staff IDs. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching staff IDs:', error);
            alert('An error occurred while fetching staff IDs.');
        }
    };

    // Save vehicle data
    vehicleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!isAuthenticated()) {
            alert('You must be logged in to register or update a vehicle');
            return;
        }

        // Get form data
        const licensePlateNumber = document.getElementById('license-plate-number').value.trim();
        const fuelType = document.getElementById('fuel-type').value.trim();
        const status = document.getElementById('status').value.trim();
        const vehicleCategory = document.getElementById('vehicle-category').value.trim();
        const staffId = staffIdDropdown.value;
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
            let response;

            if (currentVehicleId) {
                response = await fetch(`http://localhost:8080/api/v1/vehicles/${currentVehicleId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(vehicleData),
                });
            } else {
                response = await fetch('http://localhost:8080/api/v1/vehicles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(vehicleData),
                });
            }

            if (response.ok || response.status === 201) {
                await fetchVehicles();
                clearForm();
                closeForm();
                currentVehicleId = null;
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
            <td><span class="update-button"><i class="fas fa-edit"></i></span></td>
            <td><span class="delete-button"><i class="fas fa-trash"></i></span></td>
        `;
        row.querySelector('.update-button').addEventListener('click', () => {
            openForm();
            formTitle.textContent = 'Update Vehicle'; 
            populateUpdateForm(vehicle);
        });
        row.querySelector('.delete-button').addEventListener('click', () => {
            deleteVehicle(vehicle.vehicleCode);
        });

        tableBody.appendChild(row);
    };

    // Populate the form with vehicle data for update
    const populateUpdateForm = (vehicle) => {
        document.getElementById('license-plate-number').value = vehicle.licensePlateNumber || '';
        document.getElementById('fuel-type').value = vehicle.fuelType || '';
        document.getElementById('status').value = vehicle.status || '';
        document.getElementById('vehicle-category').value = vehicle.vehicleCategory || '';
        staffIdDropdown.value = vehicle.staffId || '';
        document.getElementById('remarks').value = vehicle.remarks || '';

        currentVehicleId = vehicle.vehicleCode; 
    };

    // Function to clear the form fields
    const clearForm = () => {
        vehicleForm.reset();
        currentVehicleId = null; 
    };

    // Function to delete vehicle with confirmation
    const deleteVehicle = async (vehicleCode) => {
        if (!isAuthenticated()) {
            alert('You must be logged in to delete a vehicle');
            return;
        }

        const isConfirmed = confirm('Are you sure you want to delete this vehicle?');

        if (isConfirmed) {
            const token = localStorage.getItem('jwtToken');
            try {
                const response = await fetch(`http://localhost:8080/api/v1/vehicles/${vehicleCode}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    alert('Vehicle deleted successfully');
                    await fetchVehicles(); 
                } else {
                    const errorText = await response.text();
                    console.error('Failed to delete vehicle:', errorText);
                    alert(`Failed to delete vehicle: ${errorText}`);
                }
            } catch (error) {
                console.error('Error deleting vehicle:', error);
                alert(`An error occurred: ${error.message}`);
            }
        } else {
            console.log('Vehicle deletion canceled');
        }
    };

    // Fetch vehicles and staff IDs on page load
    fetchVehicles();
    fetchStaffIds();
});
