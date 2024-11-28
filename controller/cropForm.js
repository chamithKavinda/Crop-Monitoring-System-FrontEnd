document.addEventListener('DOMContentLoaded', () => {
    // Elements for the Crop Registration Form
    const cropRegisterForm = document.getElementById('crop-register-form');
    const addCropButton = document.getElementById('add-crop');
    const closeButton = document.getElementById('crop-register-close');

    // Image input and preview mapping
    const imageHandlers = [
        {
            input: document.getElementById('crop-image1'),
            previewContainer: document.getElementById('crop-image-preview-container1'),
            preview: document.getElementById('crop-image-preview1'),
            removeButton: document.getElementById('crop-remove-image1'),
        },
    ];

    // Function to open the registration form
    const openForm = () => {
        cropRegisterForm?.classList.add('active');
    };

    // Function to close the registration form
    const closeForm = () => {
        cropRegisterForm?.classList.remove('active');
    };

    // Initialize image preview and removal functionality
    const initializeImageHandlers = ({ input, previewContainer, preview, removeButton }) => {
        if (!input || !previewContainer || !preview || !removeButton) {
            console.error('Missing elements for image handling.');
            return;
        }

        // Handle image preview
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

        // Handle image removal
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
});
