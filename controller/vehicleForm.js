document.addEventListener('DOMContentLoaded', () => {
    // Elements for the Vehicle Registration Form
    const vehicleRegisterForm = document.getElementById('vehicle-register-form');
    const addVehicleButton = document.getElementById('add-vehicle');
    const closeButton = document.getElementById('vehicle-register-close');

    // Function to open the registration form
    const openForm = () => {
        console.log('Opening vehicle registration form...');
        vehicleRegisterForm.classList.add('active');
    };

    // Function to close the registration form
    const closeForm = () => {
        console.log('Closing vehicle registration form...');
        vehicleRegisterForm.classList.remove('active');
    };

    // Add event listeners for opening and closing the form
    if (addVehicleButton) {
        addVehicleButton.addEventListener('click', openForm);
    } else {
        console.error("Add Vehicle button (id: 'add-vehicle') not found!");
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeForm);
    } else {
        console.error("Close button (id: 'vehicle-register-close') not found!");
    }

    // Close the form when clicking outside it
    window.addEventListener('click', (event) => {
        if (event.target === vehicleRegisterForm) {
            closeForm();
        }
    });

    // Handle form submission
    const vehicleForm = document.getElementById('vehicle-form');
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log('Submitting vehicle registration form...');

            // Collect form data
            const formData = {
                licensePlateNumber: document.getElementById('license-plate-number').value,
                fuelType: document.getElementById('fuel-type').value,
                status: document.getElementById('status').value,
                vehicleCategory: document.getElementById('vehicle-category').value,
                staffId: document.getElementById('staff-id').value,
                remarks: document.getElementById('remarks').value,
            };

            console.log('Form data:', formData);

            // Simulate form submission (replace this with your actual API call)
            alert('Vehicle registered successfully!');
            closeForm();
        });
    } else {
        console.error("Vehicle form (id: 'vehicle-form') not found!");
    }
});
