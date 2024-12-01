document.addEventListener('DOMContentLoaded', () => {
    const fieldRegisterForm = document.getElementById('field-register-form');
    const addFieldButton = document.getElementById('add-field');
    const closeFieldButton = document.getElementById('field-register-close');
    const fieldForm = document.getElementById('field-form');
    const tableBody = document.querySelector('.field-table tbody');
    const formTitle = document.querySelector('.field-register-title');
    const staffDropdown = document.getElementById('crop-field-code');  // Dropdown for staff IDs
    let currentFieldId = null; // To store the ID of the field being updated

    const tags = document.querySelectorAll(".tag");
    const selectedIdsInput = document.getElementById("selected-staff-ids");

    tags.forEach(tag => {
        tag.addEventListener("click", function () {
            // Toggle the 'selected' class on the clicked tag
            this.classList.toggle("selected");

            // Update the hidden input field with selected tag IDs
            const selectedTags = document.querySelectorAll(".tag.selected");
            const selectedIds = Array.from(selectedTags).map(tag => tag.dataset.id);
            selectedIdsInput.value = selectedIds.join(","); // Join selected IDs as a comma-separated string
        });
    });

    // Initialize image preview handlers
    const initializeImageHandlers = (inputId, previewContainerId, previewId, removeButtonId) => {
        const input = document.getElementById(inputId);
        const previewContainer = document.getElementById(previewContainerId);
        const preview = document.getElementById(previewId);
        const removeButton = document.getElementById(removeButtonId);

        if (!input || !previewContainer || !preview || !removeButton) {
            console.error(`Missing elements for ${inputId} preview functionality.`);
            return;
        }

        // Handle image preview
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                    previewContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });

        // Handle image removal
        removeButton.addEventListener('click', () => {
            input.value = ''; // Clear the file input
            preview.src = ''; // Clear the preview image
            previewContainer.style.display = 'none'; // Hide the preview container
        });
    };

    // Call the image handler initializer for both image fields
    initializeImageHandlers('field-image1', 'field-image-preview-container1', 'field-image-preview1', 'field-remove-image1');
    initializeImageHandlers('field-image2', 'field-image-preview-container2', 'field-image-preview2', 'field-remove-image2');

    // Function to open the registration form
    const openForm = () => {
        fieldRegisterForm.classList.add('active');
    };

    // Function to close the registration form
    const closeForm = () => {
        fieldRegisterForm.classList.remove('active');
    };

    // Add event listeners for opening and closing the form
    if (addFieldButton) {
        addFieldButton.addEventListener('click', () => {
            openForm();
            formTitle.textContent = 'Register Field';
            clearForm();
            fetchStaff(); // Ensure staff data is fetched when opening the form
        });
    }

    if (closeFieldButton) {
        closeFieldButton.addEventListener('click', closeForm);
    }

    // Close the form when clicking outside it
    window.addEventListener('click', (event) => {
        if (event.target === fieldRegisterForm) {
            closeForm();
        }
    });

    // Check if the user is authenticated
    const isAuthenticated = () => {
        const token = localStorage.getItem('jwtToken');
        return token && token !== null;
    };

    // Fetch fields and display in the table
    const fetchFields = async () => {
        if (!isAuthenticated()) {
            alert('You must be logged in to view fields.');
            return;
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('http://localhost:8080/api/v1/field', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const fields = await response.json();
                tableBody.innerHTML = '';
                fields.forEach(addFieldToTable);
            } else if (response.status === 401) {
                alert('Authentication failed. Please log in again.');
            } else {
                const errorText = await response.text();
                console.error('Failed to fetch fields:', errorText);
                alert('Failed to fetch fields. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching fields:', error);
            alert('An error occurred while fetching fields.');
        }
    };

    // Fetch staff data and populate the dropdown
    const fetchStaff = async () => {
        if (!isAuthenticated()) {
            alert('You must be logged in to view staff.');
            return;
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('http://localhost:8080/api/v1/staff', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const staff = await response.json();
                populateStaffDropdown(staff);
            } else if (response.status === 401) {
                alert('Authentication failed. Please log in again.');
            } else {
                const errorText = await response.text();
                console.error('Failed to fetch staff:', errorText);
                alert('Failed to fetch staff. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
            alert('An error occurred while fetching staff.');
        }
    };

    // Populate the staff dropdown with fetched staff data
    const populateStaffDropdown = (staff) => {
        // Clear the existing options
        staffDropdown.innerHTML = '<option value="">Select Staff ID</option>';

        // Add each staff as an option in the dropdown
        staff.forEach(staffMember => {
            const option = document.createElement('option');
            option.value = staffMember.staffId;  // Assuming staffId is the property holding the ID
            option.textContent = staffMember.staffId;  // Set the text content to show the staff ID
            staffDropdown.appendChild(option);
        });
    };

    // Save or update field
    fieldForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!isAuthenticated()) {
            alert('You must be logged in to save or update a field.');
            return;
        }

        const formData = new FormData(fieldForm);

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`http://localhost:8080/api/v1/field${currentFieldId ? `/${currentFieldId}` : ''}`, {
                method: currentFieldId ? 'PATCH' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                fetchFields();
                clearForm();
                closeForm();
                currentFieldId = null;
            } else {
                const errorText = await response.text();
                console.error('Failed to save field:', response.status, errorText);
                alert(`Failed to save field: ${response.statusText} (${response.status})`);
            }
        } catch (error) {
            console.error('Error saving field:', error);
            alert('An error occurred while saving the field.');
        }
    });

    // Function to add a field to the table
    const addFieldToTable = (field) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${field.fieldCode || 'N/A'}</td>
            <td>${field.fieldName || 'N/A'}</td>
            <td>${field.extentSize || 'N/A'}</td>
            <td><img src="data:image/png;base64,${field.fieldImage1 || ''}" alt="Image 1" class="field-image-table" /></td>
            <td><img src="data:image/png;base64,${field.fieldImage2 || ''}" alt="Image 2" class="field-image-table" /></td>
            <td>${field.latitude !== undefined && field.longitude !== undefined ? `(${field.latitude}, ${field.longitude})` : 'N/A'}</td>
            <td><span class="update-button"><i class="fas fa-edit"></i></span></td>
            <td><span class="delete-button"><i class="fas fa-trash"></i></span></td>
        `;
        row.querySelector('.update-button').addEventListener('click', () => openUpdateForm(field));
        row.querySelector('.delete-button').addEventListener('click', () => deleteField(field.fieldCode));

        tableBody.appendChild(row);
    };

    // Clear the form
    const clearForm = () => {
        fieldForm.reset();
        currentFieldId = null;
    };

    // Open the form to update a field
    const openUpdateForm = (field) => {
        openForm();
        formTitle.textContent = 'Update Field';
        populateFieldForm(field);
        currentFieldId = field.fieldCode;
    };

    // Populate the field form with the existing field data
    const populateFieldForm = (field) => {
        document.getElementById('field-name').value = field.fieldName;
        document.getElementById('latitude').value = field.latitude;
        document.getElementById('longitude').value = field.longitude;
        document.getElementById('extent-size').value = field.extentSize;
        document.getElementById('field-image1').value = '';
        document.getElementById('field-image2').value = '';
    };

    // Delete a field
    const deleteField = async (fieldCode) => {
        if (!isAuthenticated()) {
            alert('You must be logged in to delete a field.');
            return;
        }

        if (confirm('Are you sure you want to delete this field?')) {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch(`http://localhost:8080/api/v1/field/${fieldCode}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    fetchFields();
                } else {
                    const errorText = await response.text();
                    console.error('Failed to delete field:', response.status, errorText);
                    alert(`Failed to delete field: ${response.statusText} (${response.status})`);
                }
            } catch (error) {
                console.error('Error deleting field:', error);
                alert('An error occurred while deleting the field.');
            }
        }
    };

    // Initial fetch of fields and staff when the page loads
    fetchFields();
});
