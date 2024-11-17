document.addEventListener('DOMContentLoaded', () => {
    // Elements for the Field Registration Form
    const fieldRegisterForm = document.getElementById('fieldRegisterForm');
    const addFieldButton = document.getElementById('add-field');
    const closeButton = document.getElementById('fieldRegisterForm-close');

    // Image 1 Elements
    const fieldImageInput1 = document.getElementById('field_image1');
    const imagePreviewContainer1 = document.getElementById('image-preview-container1');
    const imagePreview1 = document.getElementById('image-preview1');
    const removeImageButton1 = document.getElementById('remove-image1');

    // Image 2 Elements
    const fieldImageInput2 = document.getElementById('field_image2');
    const imagePreviewContainer2 = document.getElementById('image-preview-container2');
    const imagePreview2 = document.getElementById('image-preview2');
    const removeImageButton2 = document.getElementById('remove-image2');

    // Open the registration form
    const openForm = () => {
        fieldRegisterForm.classList.add('active');
    };

    // Close the registration form
    const closeForm = () => {
        fieldRegisterForm.classList.remove('active');
    };

    addFieldButton.addEventListener('click', openForm);

    closeButton.addEventListener('click', closeForm);

    window.addEventListener('click', (event) => {
        if (event.target === fieldRegisterForm) {
            closeForm();
        }
    });

    // Image Preview for Image 1
    fieldImageInput1.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview1.src = e.target.result;
                imagePreviewContainer1.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Image Preview for Image 2
    fieldImageInput2.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview2.src = e.target.result;
                imagePreviewContainer2.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Remove Image 1
    removeImageButton1.addEventListener('click', () => {
        fieldImageInput1.value = '';
        imagePreview1.src = '';
        imagePreviewContainer1.style.display = 'none';
    });

    // Remove Image 2
    removeImageButton2.addEventListener('click', () => {
        fieldImageInput2.value = '';
        imagePreview2.src = '';
        imagePreviewContainer2.style.display = 'none';
    });
});
