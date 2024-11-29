document.addEventListener('DOMContentLoaded', () => {
    // Elements for the Equipment Registration Form
    const equipmentRegisterForm = document.getElementById('equipment-register-form');
    const addEquipmentButton = document.getElementById('add-equipment');
    const closeButton = document.getElementById('equipment-register-close');
    const equipmentForm = document.getElementById('equipment-form');
    const tableBody = document.querySelector('.equipment-table tbody');
    const formTitle = document.querySelector('.equipment-register-title');
    let currentEquipmentId = null;  // To store the ID of the equipment being updated

    // Function to open the registration form
    const openForm = () => {
        equipmentRegisterForm.classList.add('active');
    };

    // Function to close the registration form
    const closeForm = () => {
        equipmentRegisterForm.classList.remove('active');
    };

    // Add event listeners for opening and closing the form
    if (addEquipmentButton) {
        addEquipmentButton.addEventListener('click', () => {
            openForm();
            formTitle.textContent = 'Register Equipment'; // Reset title to "Register"
            clearForm(); // Clear the form for new registration
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeForm);
    }

    // Close the form when clicking outside it
    window.addEventListener('click', (event) => {
        if (event.target === equipmentRegisterForm) {
            closeForm();
        }
    });

    // Check if the user is authenticated
    const isAuthenticated = () => {
        const token = localStorage.getItem('jwtToken');
        return token && token !== null;
    };

    // Fetch and display equipment data from the backend
    const fetchEquipments = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('http://localhost:8080/api/v1/equipment', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const equipments = await response.json();
                tableBody.innerHTML = ''; // Clear the table
                equipments.forEach(addEquipmentToTable); // Add each equipment to the table
            } else if (response.status === 401) {
                alert('Authentication failed. Please log in again.');
            } else {
                const errorText = await response.text();
                console.error('Failed to fetch equipments:', errorText);
                alert('Failed to fetch equipments. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching equipments:', error);
            alert('An error occurred while fetching equipments.');
        }
    };

    // Save equipment data
    equipmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!isAuthenticated()) {
            alert('You must be logged in to register or update equipment');
            return;
        }

        // Get form data
        const name = document.getElementById('equipment-name').value.trim();
        const type = document.getElementById('equipment-type').value.trim();
        const status = document.getElementById('equipment-status').value.trim();
        const fieldCode = document.getElementById('equipment-field-code').value.trim();
        const staffId = document.getElementById('equipment-staff-id').value.trim();

        const equipmentData = {
            name,
            type,
            status,
            fieldCode,
            staffId,
        };

        try {
            const token = localStorage.getItem('jwtToken');
            let response;

            if (currentEquipmentId) {
                // Update equipment if an ID is present
                response = await fetch(`http://localhost:8080/api/v1/equipment/${currentEquipmentId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(equipmentData),
                });
            } else {
                // Register a new equipment
                response = await fetch('http://localhost:8080/api/v1/equipment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(equipmentData),
                });
            }

            if (response.ok || response.status === 201) {
                await fetchEquipments(); // Reload the equipment table
                clearForm();
                closeForm();
                currentEquipmentId = null;  // Reset the ID after submission
            } else {
                const errorText = await response.text();
                console.error('Failed to save equipment. Response text:', errorText);
                alert(`Failed to save equipment: ${errorText}`);
            }
        } catch (error) {
            console.error('Error saving equipment:', error);
            alert(`An error occurred: ${error.message}`);
        }
    });

    // Function to dynamically add equipment to the table
    const addEquipmentToTable = (equipment) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${equipment.id || 'N/A'}</td>
            <td>${equipment.fieldCode || 'N/A'}</td>
            <td>${equipment.name || 'N/A'}</td>
            <td>${equipment.staffId || 'N/A'}</td>
            <td>${equipment.status || 'N/A'}</td>
            <td>${equipment.type || 'N/A'}</td>
            <td><span class="update-button"><i class="fas fa-edit"></i></span></td>
            <td><span class="delete-button"><i class="fas fa-trash"></i></span></td>
        `;
        row.querySelector('.update-button').addEventListener('click', () => {
            openForm();
            formTitle.textContent = 'Update Equipment'; // Change title to "Update"
            populateUpdateForm(equipment);
        });
        row.querySelector('.delete-button').addEventListener('click', () => {
            deleteEquipment(equipment.id);
        });

        tableBody.appendChild(row);
    };

    // Populate the form with equipment data for update
    const populateUpdateForm = (equipment) => {
        document.getElementById('equipment-name').value = equipment.name || '';
        document.getElementById('equipment-type').value = equipment.type || '';
        document.getElementById('equipment-status').value = equipment.status || '';
        document.getElementById('equipment-field-code').value = equipment.fieldCode || '';
        document.getElementById('equipment-staff-id').value = equipment.staffId || '';

        currentEquipmentId = equipment.id;  // Set the ID of the equipment being updated
    };

    // Function to clear the form fields
    const clearForm = () => {
        equipmentForm.reset();
        currentEquipmentId = null;  // Reset the ID after submission
    };

    // Delete equipment
    const deleteEquipment = async (id) => {
        if (!isAuthenticated()) {
            alert('You must be logged in to delete equipment');
            return;
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`http://localhost:8080/api/v1/equipment/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                await fetchEquipments();
            } else {
                const errorText = await response.text();
                console.error('Failed to delete equipment. Response text:', errorText);
                alert(`Failed to delete equipment: ${errorText}`);
            }
        } catch (error) {
            console.error('Error deleting equipment:', error);
            alert(`An error occurred: ${error.message}`);
        }
    };

    // Fetch equipment on page load
    fetchEquipments();
});
