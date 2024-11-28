document.getElementById("DashboardForm").style.display = "block"; 
document.getElementById("StaffForm").style.display = "none";
document.getElementById("FieldsForm").style.display = "none";
document.getElementById("CropsForm").style.display = "none";
document.getElementById("CropDetailsForm").style.display = "none";
document.getElementById("VehiclesForm").style.display = "none";
document.getElementById("EquipmentsForm").style.display = "none";
document.getElementById("UserForm").style.display = "none";


document.getElementById("Dashboard-button").addEventListener("click", function() {
    document.getElementById("DashboardForm").style.display = "block";
    document.getElementById("StaffForm").style.display = "none";
    document.getElementById("FieldsForm").style.display = "none";
    document.getElementById("CropsForm").style.display = "none";
    document.getElementById("CropDetailsForm").style.display = "none";
    document.getElementById("VehiclesForm").style.display = "none";
    document.getElementById("EquipmentsForm").style.display = "none";
    document.getElementById("UserForm").style.display = "none";
});

document.getElementById("StaffForm-button").addEventListener("click", function() {
    document.getElementById("StaffForm").style.display = "block";
    document.getElementById("DashboardForm").style.display = "none";
    document.getElementById("FieldsForm").style.display = "none";
    document.getElementById("CropsForm").style.display = "none";
    document.getElementById("CropDetailsForm").style.display = "none";
    document.getElementById("VehiclesForm").style.display = "none";
    document.getElementById("EquipmentsForm").style.display = "none";
    document.getElementById("UserForm").style.display = "none";
});

document.getElementById("FieldsForm-button").addEventListener("click", function() {
    document.getElementById("FieldsForm").style.display = "block";
    document.getElementById("DashboardForm").style.display = "none";
    document.getElementById("StaffForm").style.display = "none";
    document.getElementById("CropsForm").style.display = "none";
    document.getElementById("CropDetailsForm").style.display = "none";
    document.getElementById("VehiclesForm").style.display = "none";
    document.getElementById("EquipmentsForm").style.display = "none";
    document.getElementById("UserForm").style.display = "none";
});

document.getElementById("CropsForm-button").addEventListener("click", function() {
    document.getElementById("CropsForm").style.display = "block";
    document.getElementById("DashboardForm").style.display = "none";
    document.getElementById("StaffForm").style.display = "none";
    document.getElementById("FieldsForm").style.display = "none";
    document.getElementById("CropDetailsForm").style.display = "none";
    document.getElementById("VehiclesForm").style.display = "none";
    document.getElementById("EquipmentsForm").style.display = "none";
    document.getElementById("UserForm").style.display = "none";
});

document.getElementById("MonitoringForm-button").addEventListener("click", function() {
    document.getElementById("CropDetailsForm").style.display = "block";
    document.getElementById("DashboardForm").style.display = "none";
    document.getElementById("StaffForm").style.display = "none";
    document.getElementById("FieldsForm").style.display = "none";
    document.getElementById("CropsForm").style.display = "none";
    document.getElementById("VehiclesForm").style.display = "none";
    document.getElementById("EquipmentsForm").style.display = "none";
    document.getElementById("UserForm").style.display = "none";
});

document.getElementById("VehiclesForm-button").addEventListener("click", function() {
    document.getElementById("VehiclesForm").style.display = "block";
    document.getElementById("DashboardForm").style.display = "none";
    document.getElementById("StaffForm").style.display = "none";
    document.getElementById("FieldsForm").style.display = "none";
    document.getElementById("CropsForm").style.display = "none";
    document.getElementById("CropDetailsForm").style.display = "none";
    document.getElementById("EquipmentsForm").style.display = "none";
    document.getElementById("UserForm").style.display = "none";
});

document.getElementById("EquipmentsForm-button").addEventListener("click", function() {
    document.getElementById("EquipmentsForm").style.display = "block";
    document.getElementById("DashboardForm").style.display = "none";
    document.getElementById("StaffForm").style.display = "none";
    document.getElementById("FieldsForm").style.display = "none";
    document.getElementById("CropsForm").style.display = "none";
    document.getElementById("CropDetailsForm").style.display = "none";
    document.getElementById("VehiclesForm").style.display = "none";
    document.getElementById("UserForm").style.display = "none";
});

document.getElementById("UserForm-button").addEventListener("click", function() {
    document.getElementById("UserForm").style.display = "block";
    document.getElementById("DashboardForm").style.display = "none";
    document.getElementById("StaffForm").style.display = "none";
    document.getElementById("FieldsForm").style.display = "none";
    document.getElementById("CropsForm").style.display = "none";
    document.getElementById("CropDetailsForm").style.display = "none";
    document.getElementById("VehiclesForm").style.display = "none";
    document.getElementById("EquipmentsForm").style.display = "none";
});

document.getElementById("SignOutForm-button").addEventListener("click", function () {
    const confirmLogout = confirm("Are you sure you want to log out?");

    if (confirmLogout) {
        // Clear JWT token from localStorage
        localStorage.removeItem("jwtToken");

        // Hide all forms or sections
        document.getElementById("DashboardForm").style.display = "none";
        document.getElementById("StaffForm").style.display = "none";
        document.getElementById("CropsForm").style.display = "none";
        document.getElementById("CropDetailsForm").style.display = "none";
        document.getElementById("VehiclesForm").style.display = "none";
        document.getElementById("EquipmentsForm").style.display = "none";
        document.getElementById("UserForm").style.display = "none";

        // Redirect to Sign-In page
        window.location.href = "/signInForm.html";
    } else {
        // Optionally handle if the user cancels the logout
        console.log("Logout canceled.");
    }
});
