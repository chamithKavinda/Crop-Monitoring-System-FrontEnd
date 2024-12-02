document.addEventListener('DOMContentLoaded', () => {
    const cropRegisterForm = document.getElementById('crop-register-form');
    const addCropButton = document.getElementById('add-crop');
    const closeButton = document.getElementById('crop-register-close');
    const cropForm = document.getElementById('crop-form');
    const tableBody = document.querySelector('.crop-table tbody');
    const formTitle = document.querySelector('.crop-register-title');
    const fieldDropdown = document.getElementById('crop-field-code-1'); // Field dropdown
    let currentCropId = null; // To store the ID of the crop being updated

    // Image input and preview mapping
    const imageHandlers = [
        {
            input: document.getElementById('crop-image1'),
            previewContainer: document.getElementById('crop-image-preview-container1'),
            preview: document.getElementById('crop-image-preview1'),
            removeButton: document.getElementById('crop-remove-image1'),
        },
    ];

    // Open the registration form
    const openForm = () => {
        cropRegisterForm?.classList.add('active');
        formTitle.textContent = currentCropId ? 'Update Crop' : 'Register Crop';
        fetchFieldCodes(); // Fetch field codes when opening the form
    };

    // Close the registration form
    const closeForm = () => {
        cropRegisterForm?.classList.remove('active');
        clearForm();
    };

    // Initialize image preview and removal functionality
    const initializeImageHandlers = ({ input, previewContainer, preview, removeButton }) => {
        if (!input || !previewContainer || !preview || !removeButton) {
            console.error('Missing elements for image handling.');
            return;
        }

        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                    previewContainer.style.display = 'flex'; // Show the preview container
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

    // Add event listeners for opening and closing the form
    addCropButton?.addEventListener('click', openForm);
    closeButton?.addEventListener('click', closeForm);

    // Close the form when clicking outside it
    window.addEventListener('click', (event) => {
        if (event.target === cropRegisterForm) {
            closeForm();
        }
    });

    // Initialize all image handlers
    imageHandlers.forEach(handler => initializeImageHandlers(handler));

    // Check if the user is authenticated
    const isAuthenticated = () => {
        const token = localStorage.getItem('jwtToken');
        return token && token !== null;
    };

    // Fetch crops and display in the table
    const fetchCrops = async () => {
        if (!isAuthenticated()) {
            alert('You must be logged in to view crops.');
            return;
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('http://localhost:8080/api/v1/crop', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const crops = await response.json();
                tableBody.innerHTML = '';
                crops.forEach(addCropToTable);
            } else {
                const errorText = await response.text();
                console.error('Failed to fetch crops:', errorText);
                alert('Failed to fetch crops. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching crops:', error);
            alert('An error occurred while fetching crops.');
        }
    };

    // Fetch field codes and populate dropdown
    console.log("hello");
    const fetchFieldCodes = async () => {
        if (!isAuthenticated()) {
            alert('You must be logged in to view field codes.');
            return;
        }

        console.log("hello 1");

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('http://localhost:8080/api/v1/field', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log("hello 2");
            if (!response.ok) {
                console.error('Failed to fetch field codes with status:', response.status);
                const errorText = await response.text();
                console.error('Error response:', errorText);
                alert('Failed to fetch field codes. Please try again later.');
                return;
            }

            console.log("hello 3");
            const fields = await response.json();
            

            if (fields.length === 0) {
                console.log('No field codes available.');
                return;
            }

            console.log(fields)
            fields.forEach((field) => {
                const option = document.createElement('option');
                option.value = field.fieldCode;
                option.textContent = field.fieldCode;
                fieldDropdown.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching field codes:', error);
            alert('An error occurred while fetching field codes.');
        }
    };

    // Save or update crop
    cropForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!isAuthenticated()) {
            alert('You must be logged in to save or update a crop.');
            return;
        }

        const formData = new FormData(cropForm);

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`http://localhost:8080/api/v1/crop${currentCropId ? `/${currentCropId}` : ''}`, {
                method: currentCropId ? 'PATCH' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                fetchCrops();
                closeForm();
            } else {
                const errorText = await response.text();
                console.error('Failed to save crop:', response.status, errorText);
                alert(`Failed to save crop: ${response.statusText} (${response.status})`);
            }
        } catch (error) {
            console.error('Error saving crop:', error);
            alert('An error occurred while saving the crop.');
        }
    });

    // Function to add a crop to the table
    const addCropToTable = (crop) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${crop.cropCode || 'N/A'}</td>
            <td>${crop.cropCommonName || 'N/A'}</td>
            <td>${crop.cropScientificName || 'N/A'}</td>
            <td><img src="data:image/png;base64,${crop.cropImage || ''}" alt="Image" class="crop-image-table" /></td>
            <td>${crop.category || 'N/A'}</td>
            <td>${crop.cropSeason || 'N/A'}</td>
            <td>${crop.fieldCode || 'N/A'}</td>
            <td><span class="update-button"><i class="fas fa-edit"></i></span></td>
            <td><span class="delete-button"><i class="fas fa-trash"></i></span></td>
        `;
        
        row.querySelector('.update-button').addEventListener('click', () => openUpdateForm(crop));
        row.querySelector('.delete-button').addEventListener('click', () => deleteCrop(crop.cropCode));

        tableBody.appendChild(row);
    };

    // Clear the form
    const clearForm = () => {
        cropForm.reset();
        currentCropId = null;
    };

    // Open the form to update a crop
    const openUpdateForm = (crop) => {
        openForm();
        populateCropForm(crop);
        currentCropId = crop.cropCode;
    };

    // Populate the crop form with the existing crop data
    const populateCropForm = (crop) => {
        document.getElementById('crop-common-name').value = crop.cropCommonName;
        document.getElementById('crop-scientific-name').value = crop.cropScientificName;
        document.getElementById('crop-category').value = crop.category;
        document.getElementById('crop-season').value = crop.cropSeason;
        fieldDropdown.value = crop.fieldCode || '';
    };

    // Delete a crop
    const deleteCrop = async (cropCode) => {
        if (!isAuthenticated()) {
            alert('You must be logged in to delete a crop.');
            return;
        }

        const confirmDelete = confirm('Are you sure you want to delete this crop?');
        if (confirmDelete) {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch(`http://localhost:8080/api/v1/crop/${cropCode}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    fetchCrops();
                } else {
                    const errorText = await response.text();
                    console.error('Failed to delete crop:', errorText);
                    alert('Failed to delete crop. Please try again later.');
                }
            } catch (error) {
                console.error('Error deleting crop:', error);
                alert('An error occurred while deleting the crop.');
            }
        }
    };

    fetchCrops(); // Initial fetch of crops on page load
});
