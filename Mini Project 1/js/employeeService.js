
// Employee Service - Handles logic related to employees
if (typeof module !== "undefined" && module.exports) {
    var storageService = require("./storageService");
}


var employeeService = {

    getAll: function() {
        return storageService.getAll();
    },

    getDepartments: function() {
        let employees = [...storageService.getAll()];
        return [...new Set(employees.map(e => e.department))];
    },

    applyFilters: function(query, department, status, sortField, sortDirection) {
        let employees = [...storageService.getAll()];

        if (query) {
            query = query.toLowerCase();
            employees = employees.filter(emp => {
                let name = (emp.firstName + " " + emp.lastName).toLowerCase();
                let email = emp.email.toLowerCase();
                return name.includes(query) || email.includes(query);
            });
        }

        if (department) {
            employees = employees.filter(emp => emp.department === department);
        }

        if (status) {
            employees = employees.filter(emp => emp.status === status);
        }

        if (sortField) {
            if (sortField === "name") {
                employees.sort((a, b) =>
                    sortDirection === "asc"
                        ? a.lastName.localeCompare(b.lastName)
                        : b.lastName.localeCompare(a.lastName)
                );
            }
            if (sortField === "salary") {
                employees.sort((a, b) =>
                    sortDirection === "asc" ? a.salary - b.salary : b.salary - a.salary
                );
            }
            if (sortField === "date") {
                employees.sort((a, b) =>
                    sortDirection === "asc"
                        ? new Date(a.joinDate) - new Date(b.joinDate)
                        : new Date(b.joinDate) - new Date(a.joinDate)
                );
            }
        }

        return employees;
    },

    add: function(data) {
        let newEmployee = {
            id: storageService.nextId(),
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            department: data.department,
            designation: data.designation,
            salary: Number(data.salary),
            joinDate: data.joinDate,
            status: data.status
        };
        storageService.add(newEmployee);
    },

    getById: function(id) {
        return storageService.getById(id);
    },

    update: function(id, data) {
        let updatedData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            department: data.department,
            designation: data.designation,
            salary: Number(data.salary),
            joinDate: data.joinDate,
            status: data.status
        };
        storageService.update(id, updatedData);
    },

    remove: function(id) {
        storageService.remove(id);
    }

};

// For Node.js
if (typeof module !== "undefined" && module.exports) {
    module.exports = employeeService;
}

// For browser
if (typeof window !== "undefined") {
    window.employeeService = employeeService;
}