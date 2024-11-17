document.addEventListener('DOMContentLoaded', () => {
    const addStaffButton = document.getElementById('add-staff');
    const staffRegisterForm = document.getElementById('staffRegisterForm');
    const closeButton = document.getElementById('staffRegisterForm-close');

    // Function to show and close registration form
    const openForm = () => {
        staffRegisterForm.style.display = 'flex'; 
    };

    const closeForm = () => {
        staffRegisterForm.style.display = 'none'; 
    };

    addStaffButton.addEventListener('click', openForm);

    closeButton.addEventListener('click', closeForm);

    window.addEventListener('click', (event) => {
        if (event.target === staffRegisterForm) {
            closeForm();
        }
    });

    closeForm();

    

});


