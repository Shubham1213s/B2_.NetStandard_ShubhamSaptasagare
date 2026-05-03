// validationService.js - Handles validation logic for signup, login, and employee forms

if (typeof module !== "undefined" && module.exports) {
    var employeeService = require("./employeeService");
}

var validationService = {

    /**
     * Validates signup form values.
     */
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

    /**
     * Validates login form values.
     */
    validateLogin: function(username, password) {
        let errors = {};
        if (!username) errors.username = "Username required";
        if (!password) errors.password = "Password required";
        return errors;
    },

    /**
     * Validates employee form values.
     */
    validateEmployee: async function(data) {
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

        // Check for duplicate email only if basic validations pass
        if (!errors.email) {
            try {
                let result = await employeeService.getAll(1, 1000);
                let employees = result.data || [];
                let exists = employees.find(e => e.email === data.email && e.id != data.id);
                if (exists) errors.email = "Email already exists";
            } catch (error) {
                console.error("Error checking for duplicate email:", error);
            }
        }

        return errors;
    },

    /**
     * Maps API error payload to field-level inline errors.
     */
    mapServerErrors: function(errorResponse) {
        let mapped = {};

        if (!errorResponse || !errorResponse.errors) {
            return mapped;
        }

        Object.keys(errorResponse.errors).forEach(function(key) {
            const value = errorResponse.errors[key];
            if (Array.isArray(value) && value.length > 0) {
                mapped[key] = value[0];
            } else if (typeof value === 'string') {
                mapped[key] = value;
            }
        });

        return mapped;
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