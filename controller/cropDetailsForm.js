document.addEventListener('DOMContentLoaded', () => {
    // Elements for the Crop Details Registration Form
    const cropDetailsRegisterForm = document.getElementById('crop-details-register-form');
    const addCropDetailsButton = document.getElementById('add-cropdetails');
    const closeButton = document.getElementById('crop-details-register-close');

    // Image input and preview mapping for crop details
    const imageHandlers = [
        {
            input: document.getElementById('crop-observed-image'),
            previewContainer: document.getElementById('crop-observed-image-preview-container'),
            preview: document.getElementById('crop-observed-image-preview'),
            removeButton: document.getElementById('crop-remove-observed-image'),
        }
    ];

    // Dropdown Elements
    const fieldCodesDropdown = document.getElementById('crop-field-codes');
    const cropCodesDropdown = document.getElementById('crop-codes');
    const staffIdsDropdown = document.getElementById('crop-staff-ids');

    // Fetch data for field codes, crop codes, and staff IDs
    const fetchData = async (endpoint, dropdownElement, placeholderText) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                populateDropdown(dropdownElement, data, placeholderText);
            } else {
                alert('Failed to fetch data.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const populateDropdown = (dropdownElement, data, placeholderText) => {
        dropdownElement.innerHTML = `<option value="">${placeholderText}</option>`;
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.code || item.staffId; // Adjust based on the object
            option.textContent = item.code || item.staffId; // Adjust based on the object
            dropdownElement.appendChild(option);
        });
    };

    // Event listeners
    addCropDetailsButton.addEventListener('click', () => {
        cropDetailsRegisterForm.style.display = 'flex';
        fetchData('http://localhost:8080/api/v1/field', fieldCodesDropdown, 'Select Field Codes');
        fetchData('http://localhost:8080/api/v1/crop', cropCodesDropdown, 'Select Crop Codes');
        fetchData('http://localhost:8080/api/v1/staff', staffIdsDropdown, 'Select Staff IDs');
    });

    closeButton.addEventListener('click', () => {
        cropDetailsRegisterForm.style.display = 'none';
    });

    imageHandlers.forEach(handler => {
        handler.input.addEventListener('change', () => {
            const file = handler.input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    handler.preview.src = reader.result;
                    handler.previewContainer.style.display = 'flex';
                };
                reader.readAsDataURL(file);
            }
        });

        handler.removeButton.addEventListener('click', () => {
            handler.input.value = '';
            handler.previewContainer.style.display = 'none';
        });
    });
});
