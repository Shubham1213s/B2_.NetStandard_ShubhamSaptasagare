// storageService.js - Manages employee data storage and retrieval

if (typeof module !== "undefined" && module.exports) {
    var data = require("./data");
    var employees = data.employees;
} else {
    var employees = window.employees;
}

var storageService = {

    getAll: function() {
        return [...employees];
    },

    getById: function(id) {
        return employees.find(emp => emp.id === id);
    },

    add: function(employee) {
        employees.push(employee);
    },

    update: function(id, data) {
        let emp = employees.find(e => e.id === id);
        if (emp) {
            Object.assign(emp, data);
        }
    },

    remove: function(id) {
        let index = employees.findIndex(e => e.id === id);
        if (index !== -1) {
            employees.splice(index, 1);
        }
    },

    nextId: function() {
        if (employees.length === 0) return 1;
        let maxId = Math.max(...employees.map(e => e.id));
        return maxId + 1;
    }

};

// For Node.js
if (typeof module !== "undefined" && module.exports) {
    module.exports = storageService;
}

// For browser
if (typeof window !== "undefined") {
    window.storageService = storageService;
}