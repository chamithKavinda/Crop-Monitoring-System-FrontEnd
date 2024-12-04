document.addEventListener('DOMContentLoaded', () => {
    const fieldRegisterForm = document.getElementById('field-register-form');
    const addFieldButton = document.getElementById('add-field');
    const closeFieldButton = document.getElementById('field-register-close');
    const fieldForm = document.getElementById('field-form');
    const tableBody = document.querySelector('.field-table tbody');
    const formTitle = document.querySelector('.field-register-title');
    const staffDropdown = document.getElementById('staff-codes');
    let currentFieldId = null; 

    //selected staff Ids
    const tags = document.querySelectorAll(".tag");
    const selectedIdsInput = document.getElementById("selected-staff-ids");

    tags.forEach(tag => {
        tag.addEventListener("click", function () {
            this.classList.toggle("selected");

            const selectedTags = document.querySelectorAll(".tag.selected");
            const selectedIds = Array.from(selectedTags).map(tag => tag.dataset.id);
            selectedIdsInput.value = selectedIds.join(","); 
        });
    });

    // Initialize image preview and removal functionality
    const initializeImageHandlers = (inputId, previewContainerId, previewId, removeButtonId) => {
        const input = document.getElementById(inputId);
        const previewContainer = document.getElementById(previewContainerId);
        const preview = document.getElementById(previewId);
        const removeButton = document.getElementById(removeButtonId);

        if (!input || !previewContainer || !preview || !removeButton) {
            console.error(`Missing elements for ${inputId} preview functionality.`);
            return;
        }

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

        removeButton.addEventListener('click', () => {
            input.value = '';
            preview.src = ''; 
            previewContainer.style.display = 'none';
        });
    };

    initializeImageHandlers('field-image1', 'field-image-preview-container1', 'field-image-preview1', 'field-remove-image1');
    initializeImageHandlers('field-image2', 'field-image-preview-container2', 'field-image-preview2', 'field-remove-image2');

    const openForm = () => {
        fieldRegisterForm.classList.add('active');
    };

    const closeForm = () => {
        fieldRegisterForm.classList.remove('active');
    };

    if (addFieldButton) {
        addFieldButton.addEventListener('click', () => {
            openForm();
            formTitle.textContent = 'Register Field';
            clearForm();
        });
    }

    if (closeFieldButton) {
        closeFieldButton.addEventListener('click', closeForm);
    }

    window.addEventListener('click', (event) => {
        if (event.target === fieldRegisterForm) {
            closeForm();
        }
    });

    const isAuthenticated = () => {
        const token = localStorage.getItem('jwtToken');
        return token && token !== null;
    };

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

    // Fetch staff members and populate the dropdown
    (async () => {
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
    })();

    const populateStaffDropdown = (staff) => {
        staffDropdown.innerHTML = '<option value="">Select Staff ID</option>';
        staff.forEach(staffMember => {
            const option = document.createElement('option');
            option.value = staffMember.staffId;
            option.textContent = staffMember.staffId;
            staffDropdown.appendChild(option);
        });
    };

    fieldForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!isAuthenticated()) {
            alert('You must be logged in to save or update a field.');
            return;
        }

        const fieldName = document.getElementById('field-name').value;
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;
        const extendSize = document.getElementById('field-extent-size').value;
        const fieldImage1 = document.getElementById('field-image1');
        const fieldImage2 = document.getElementById('field-image2');
        const staffIds = document.getElementById('staff-codes');

        const selectedIds = Array.from(staffIds.selectedOptions)
        .map(option => option.value)
        .join(',');

        const formData = new FormData();
        formData.append("fieldName", fieldName);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("extentSize", extendSize);
        formData.append("fieldImage1", fieldImage1.files[0], fieldImage1.files[0].name);
        formData.append("fieldImage2", fieldImage2.files[0], fieldImage2.files[0].name);
        formData.append("staffIds", selectedIds);

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

    const addFieldToTable = (field) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${field.fieldCode || 'N/A'}</td>
            <td>${field.fieldName || 'N/A'}</td>
            <td>${field.extendSize || 'N/A'}</td>
            <td><img src="data:image/png;base64,${field.fieldImage1 || ''}" alt="Image 1" class="field-image-table" /></td>
            <td><img src="data:image/png;base64,${field.fieldImage2 || ''}" alt="Image 2" class="field-image-table" /></td>
            <td>${field.fieldLocation.x !== undefined && field.fieldLocation.y !== undefined ? `(${field.fieldLocation.x}, ${field.fieldLocation.y})` : 'N/A'}</td>
            <td><span class="update-button"><i class="fas fa-edit"></i></span></td>
            <td><span class="delete-button"><i class="fas fa-trash"></i></span></td>
        `;
        row.querySelector('.update-button').addEventListener('click', () => openUpdateForm(field));
        row.querySelector('.delete-button').addEventListener('click', () => deleteField(field.fieldCode));

        tableBody.appendChild(row);
    };

    const clearForm = () => {
        fieldForm.reset();
        currentFieldId = null;
    };

    const openUpdateForm = (field) => {
        openForm();
        formTitle.textContent = 'Update Field';
        populateFieldForm(field);
        currentFieldId = field.fieldCode;
    };

    const populateFieldForm = (field) => {
        document.getElementById('field-name').value = field.fieldName;
        document.getElementById('latitude').value = field.fieldLocation.x;
        document.getElementById('longitude').value = field.fieldLocation.y;
        document.getElementById('field-extent-size').value = field.extendSize;


        const staffDropdown = document.getElementById('staff-codes');
        if (field.staff && Array.isArray(field.staff)) {
            field.staff.forEach(staff => {
                console.log(staff.staffId);
                const option = staffDropdown.querySelector(`option[value="${staff.staffId}"]`);
                if (option) {
                    option.selected = true;
                }
            });
        }

        if (field.fieldImage1) {
            const previewContainer1 = document.getElementById('field-image-preview-container1');
            const preview1 = document.getElementById('field-image-preview1');
            preview1.src = `data:image/png;base64,${field.fieldImage1}`;
            previewContainer1.style.display = 'block';
        }

        if (field.fieldImage2) {
            const previewContainer2 = document.getElementById('field-image-preview-container2');
            const preview2 = document.getElementById('field-image-preview2');
            preview2.src = `data:image/png;base64,${field.fieldImage2}`;
            previewContainer2.style.display = 'block';
        }
    };

    const deleteField = async (fieldCode) => {
        if (!isAuthenticated()) {
            alert('You must be logged in to delete a field.');
            return;
        }

        const confirmDelete = confirm('Are you sure you want to delete this field?');
        if (!confirmDelete) return;

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
    };

    fetchFields();
});
