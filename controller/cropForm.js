document.addEventListener('DOMContentLoaded', () => {
    // Elements for the Crop Registration Form
    const cropRegisterForm = document.getElementById('crop-register-form');
    const addCropButton = document.getElementById('add-crop');
    const closeButton = document.getElementById('crop-register-close');

    // Image input and preview mapping for crops
    const imageHandlers = [
        {
            input: document.getElementById('crop-image1'),
            previewContainer: document.getElementById('crop-image-preview-container1'),
            preview: document.getElementById('crop-image-preview1'),
            removeButton: document.getElementById('crop-remove-image1'),
        },
        {
            input: document.getElementById('crop-image2'),
            previewContainer: document.getElementById('crop-image-preview-container2'),
            preview: document.getElementById('crop-image-preview2'),
            removeButton: document.getElementById('crop-remove-image2'),
        },
    ];

    // Function to open the registration form
    const openForm = () => {
        console.log('Opening form...');
        cropRegisterForm.classList.add('active');
    };

    // Function to close the registration form
    const closeForm = () => {
        console.log('Closing form...');
        cropRegisterForm.classList.remove('active');
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
                    previewContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });

        // Handle image removal
        removeButton.addEventListener('click', () => {
            console.log(`Removing image for ${input.id}`);
            input.value = '';
            preview.src = '';
            previewContainer.style.display = 'none';
        });
    };

    // Add event listeners for opening and closing the form
    if (addCropButton) {
        addCropButton.addEventListener('click', openForm);
    } else {
        console.error("Add Crop button (id: 'add-crop') not found!");
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeForm);
    } else {
        console.error("Close button (id: 'crop-register-close') not found!");
    }

    // Close the form when clicking outside it
    window.addEventListener('click', (event) => {
        if (event.target === cropRegisterForm) {
            closeForm();
        }
    });

    // Initialize all image handlers
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
