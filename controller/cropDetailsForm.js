document.addEventListener('DOMContentLoaded', () => {
    // Elements for the Crop Details Registration Form
    const cropDetailsRegisterForm = document.getElementById('crop-details-register-form');
    const addCropDetailsButton = document.getElementById('add-cropdetails'); // Ensure this button exists in the HTML
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

    // Function to open the registration form
    const openForm = () => {
        console.log('Opening crop details form...');
        cropDetailsRegisterForm.style.display = 'flex'; // Make form visible
    };

    // Function to close the registration form
    const closeForm = () => {
        console.log('Closing crop details form...');
        cropDetailsRegisterForm.style.display = 'none'; // Hide form
    };

    // Initialize image preview and removal functionality
    const initializeImageHandlers = ({ input, previewContainer, preview, removeButton }) => {
        // Handle image preview
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                console.log(`Selected file for ${input.id}:`, file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                    previewContainer.style.display = 'flex'; // Show the preview
                };
                reader.readAsDataURL(file);
            }
        });

        // Handle image removal
        removeButton.addEventListener('click', () => {
            console.log(`Removing image for ${input.id}`);
            input.value = ''; // Clear the file input
            preview.src = ''; // Clear the image preview
            previewContainer.style.display = 'none'; // Hide the preview
        });
    };

    // Add event listeners for opening and closing the form
    if (addCropDetailsButton) {
        addCropDetailsButton.addEventListener('click', openForm);
    } else {
        console.error("Add Crop Details button (id: 'add-cropdetails') not found!");
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeForm);
    } else {
        console.error("Close button (id: 'crop-details-register-close') not found!");
    }

    // Close the form when clicking outside it
    window.addEventListener('click', (event) => {
        if (event.target === cropDetailsRegisterForm) {
            closeForm();
        }
    });

    // Initialize image handlers
    imageHandlers.forEach(handler => {
        if (
            handler.input &&
            handler.previewContainer &&
            handler.preview &&
            handler.removeButton
        ) {
            initializeImageHandlers(handler);
        } else {
            console.error('Missing one or more elements in an image handler:', handler);
        }
    });
});
