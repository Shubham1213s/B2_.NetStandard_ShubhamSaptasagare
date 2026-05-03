// dashboardService.js - Provides data for the dashboard view

if (typeof module !== "undefined" && module.exports) {
    var employeeService = require("./employeeService");
}

var dashboardService = {

    getSummary: function() {
        let employees = employeeService.getAll();
        let total = employees.length;
        let active = employees.filter(e => e.status === "Active").length;
        let inactive = employees.filter(e => e.status === "Inactive").length;
        let departments = new Set(employees.map(e => e.department)).size;
        return { total, active, inactive, departments };
    },

    getDepartmentBreakdown: function() {
        let employees = employeeService.getAll();
        let result = {};
        employees.forEach(emp => {
            if (result[emp.department]) {
                result[emp.department]++;
            } else {
                result[emp.department] = 1;
            }
        });
        return result;
    },

    getRecentEmployees: function(n) {
        let employees = employeeService.getAll();
        let sorted = [...employees].sort((a, b) => b.id - a.id);
        return sorted.slice(0, n);
    }

};

if (typeof module !== "undefined" && module.exports) {
    module.exports = dashboardService;
}

if (typeof window !== "undefined") {
    window.dashboardService = dashboardService;
}