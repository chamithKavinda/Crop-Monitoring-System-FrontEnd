document.addEventListener('DOMContentLoaded', () => {
    // Elements for the Field Registration Form
    const fieldRegisterForm = document.getElementById('field-register-form');
    const addFieldButton = document.getElementById('add-field');
    const closeButton = document.getElementById('field-register-close');

    // Image input and preview mapping
    const imageHandlers = [
        {
            input: document.getElementById('field-image1'),
            previewContainer: document.getElementById('field-image-preview-container1'),
            preview: document.getElementById('field-image-preview1'),
            removeButton: document.getElementById('field-remove-image1'),
        },
        {
            input: document.getElementById('field-image2'),
            previewContainer: document.getElementById('field-image-preview-container2'),
            preview: document.getElementById('field-image-preview2'),
            removeButton: document.getElementById('field-remove-image2'),
        },
    ];

    // Function to open the registration form
    const openForm = () => {
        console.log('Opening form...');
        fieldRegisterForm.classList.add('active');
    };

    // Function to close the registration form
    const closeForm = () => {
        console.log('Closing form...');
        fieldRegisterForm.classList.remove('active');
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
    if (addFieldButton) {
        addFieldButton.addEventListener('click', openForm);
    } else {
        console.error("Add Field button (id: 'add-field') not found!");
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeForm);
    } else {
        console.error("Close button (id: 'field-register-close') not found!");
    }

    // Close the form when clicking outside it
    window.addEventListener('click', (event) => {
        if (event.target === fieldRegisterForm) {
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
