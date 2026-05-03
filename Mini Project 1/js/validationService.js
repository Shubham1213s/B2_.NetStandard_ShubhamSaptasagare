// validationService.js - Handles validation logic for signup, login, and employee forms

if (typeof module !== "undefined" && module.exports) {
    var employeeService = require("./employeeService");
}

var validationService = {

    validateSignup: function(username, password, confirmPassword) {
        let errors = {};
        if (!username) errors.username = "Username required";
        if (!password) {
            errors.password = "Password required";
        } else if (password.length < 6) {
            errors.password = "Minimum 6 characters";
        }
        if (!confirmPassword) {
            errors.confirmPassword = "Confirm password required";
        } else if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }
        return errors;
    },

    validateLogin: function(username, password) {
        let errors = {};
        if (!username) errors.username = "Username required";
        if (!password) errors.password = "Password required";
        return errors;
    },

    validateEmployee: function(data) {
        let errors = {};
        if (!data.firstName) errors.firstName = "First name is required";
        if (!data.lastName) errors.lastName = "Last name is required";
        if (!data.email) {
            errors.email = "Email is required";
        } else {
            let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(data.email)) errors.email = "Invalid email format";
        }
        if (!data.phone) {
            errors.phone = "Phone is required";
        } else if (!/^\d{10}$/.test(data.phone)) {
            errors.phone = "Phone must be 10 digits";
        }
        if (!data.department) errors.department = "Select department";
        if (!data.designation) errors.designation = "Designation required";
        if (!data.salary || data.salary <= 0) errors.salary = "Salary must be positive";
        if (!data.joinDate) errors.joinDate = "Join date required";
        if (!data.status) errors.status = "Select status";

        let all = employeeService.getAll();
        let exists = all.find(e => e.email === data.email && e.id != data.id);
        if (exists) errors.email = "Email already exists";

        return errors;
    }

};

// For Node.js
if (typeof module !== "undefined" && module.exports) {
    module.exports = validationService;
}

// For browser
if (typeof window !== "undefined") {
    window.validationService = validationService;
}