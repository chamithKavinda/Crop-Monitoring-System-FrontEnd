document.addEventListener('DOMContentLoaded', () => {
    // Elements for the Equipment Registration Form
    const equipmentRegisterForm = document.getElementById('equipment-register-form');
    const addEquipmentButton = document.getElementById('add-equipment');
    const closeButton = document.getElementById('equipment-register-close');

    // Function to open the registration form
    const openForm = () => {
        console.log('Opening equipment registration form...');
        equipmentRegisterForm.classList.add('active');
    };

    // Function to close the registration form
    const closeForm = () => {
        console.log('Closing equipment registration form...');
        equipmentRegisterForm.classList.remove('active');
    };

    // Add event listeners for opening and closing the form
    if (addEquipmentButton) {
        addEquipmentButton.addEventListener('click', openForm);
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
});
