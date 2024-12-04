document.addEventListener('DOMContentLoaded', () => {
    // Elements for the Equipment Registration Form
    const equipmentRegisterForm = document.getElementById('equipment-register-form');
    const addEquipmentButton = document.getElementById('add-equipment');
    const closeButton = document.getElementById('equipment-register-close');
    const equipmentForm = document.getElementById('equipment-form');
    const tableBody = document.querySelector('.equipment-table tbody');
    const formTitle = document.querySelector('.equipment-register-title');
    const staffDropdown = document.getElementById('equipment-staff-id'); 
    const fieldDropdown = document.getElementById('equipment-field-code'); 

    let currentEquipmentId = null; 

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
            formTitle.textContent = 'Register Equipment'; 
            clearForm(); 
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
                tableBody.innerHTML = ''; 
                equipments.forEach(addEquipmentToTable);
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

    // Populate dropdowns for staff and field codes
    const populateDropdowns = async () => {
        try {
            const token = localStorage.getItem('jwtToken');

            // Fetch staff IDs
            const staffResponse = await fetch('http://localhost:8080/api/v1/staff', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (staffResponse.ok) {
                const staffList = await staffResponse.json();
                staffDropdown.innerHTML = `<option value="">Select Staff ID</option>`;
                staffList.forEach(staff => {
                    const option = document.createElement('option');
                    option.value = staff.staffId;
                    option.textContent = staff.staffId;
                    staffDropdown.appendChild(option);
                });
            }

            //Fetch field codes
            const fieldResponse = await fetch('http://localhost:8080/api/v1/field', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (fieldResponse.ok) {
                const fieldList = await fieldResponse.json();
                fieldDropdown.innerHTML = `<option value="">Select Field Code</option>`;
                fieldList.forEach(field => {
                    const option = document.createElement('option');
                    option.value = field.fieldCode;
                    option.textContent = field.fieldCode;
                    fieldDropdown.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error populating dropdowns:', error);
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
        const fieldCode = fieldDropdown.value.trim();
        const staffId = staffDropdown.value.trim();

        const equipmentData = { name, type, status, fieldCode, staffId };

        try {
            const token = localStorage.getItem('jwtToken');
            let response;

            if (currentEquipmentId) {
                // Update equipment
                response = await fetch(`http://localhost:8080/api/v1/equipment/${currentEquipmentId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(equipmentData),
                });
            } else {
                // Register new equipment
                response = await fetch('http://localhost:8080/api/v1/equipment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(equipmentData),
                });
            }

            if (response.ok) {
                await fetchEquipments(); // Reload equipment table
                clearForm();
                closeForm();
                currentEquipmentId = null; // Reset ID
            } else {
                const errorText = await response.text();
                console.error('Failed to save equipment:', errorText);
                alert(`Failed to save equipment: ${errorText}`);
            }
        } catch (error) {
            console.error('Error saving equipment:', error);
            alert(`An error occurred: ${error.message}`);
        }
    });

    // Function to dynamically add equipment to the table
    const addEquipmentToTable = (equipment) => {
        const existingRow = document.querySelector(`tr[data-id="${equipment.equipmentId}"]`);
        if (existingRow) existingRow.remove();

        const row = document.createElement('tr');
        row.setAttribute('data-id', equipment.equipmentId);
        row.innerHTML = `
            <td>${equipment.equipmentId}</td>
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
            formTitle.textContent = 'Update Equipment';
            populateUpdateForm(equipment);
        });
        row.querySelector('.delete-button').addEventListener('click', () => deleteEquipment(equipment.equipmentId));
        tableBody.appendChild(row);
    };

    // Populate form for updating equipment
    const populateUpdateForm = (equipment) => {
        document.getElementById('equipment-name').value = equipment.name || '';
        document.getElementById('equipment-type').value = equipment.type || '';
        document.getElementById('equipment-status').value = equipment.status || '';
        fieldDropdown.value = equipment.fieldCode || '';
        staffDropdown.value = equipment.staffId || '';
        currentEquipmentId = equipment.equipmentId;
    };

    // Clear the form
    const clearForm = () => {
        equipmentForm.reset();
        currentEquipmentId = null;
    };

    // Delete equipment
    const deleteEquipment = async (id) => {
        if (!isAuthenticated()) {
            alert('You must be logged in to delete equipment');
            return;
        }
        if (!confirm('Are you sure you want to delete this equipment?')) return;

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`http://localhost:8080/api/v1/equipment/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) document.querySelector(`tr[data-id="${id}"]`).remove();
            else alert(`Failed to delete equipment.`);
        } catch (error) {
            console.error('Error deleting equipment:', error);
        }
    };

    // Initial fetches
    fetchEquipments();
    populateDropdowns();
});
