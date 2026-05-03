
// Employee Service - Handles logic related to employees (delegates to storageService)

if (typeof module !== "undefined" && module.exports) {
    var storageService = require("./storageService");
}

var employeeService = {

    // Store all employees in memory for filtering
    _allEmployees: [],

    /**
     * Gets paged employees from storage service.
     */
    getAll: async function(page = 1, pageSize = 10, search = '', department = '', status = '', sortBy = 'name', sortDir = 'asc') {
        const result = await storageService.getAll(page, pageSize, search, department, status, sortBy, sortDir);
        // Store employees locally for filtering
        if (result.data) {
            this._allEmployees = result.data;
        }
        return result;
    },

    /**
     * Returns department list.
     */
    getDepartments: function() {
        return ["Engineering", "Marketing", "HR", "Finance", "Operations"];
    },

    /**
     * Gets employee by id.
     */
    getById: async function(id) {
        return await storageService.getById(id);
    },

    /**
     * Creates employee.
     */
    add: async function(data) {
        return await storageService.add(data);
    },

    /**
     * Updates employee.
     */
    update: async function(id, data) {
        return await storageService.update(id, data);
    },

    /**
     * Deletes employee.
     */
    remove: async function(id) {
        return await storageService.remove(id);
    },

    /**
     * Applies search/filter/sort through API and returns data rows.
     */
    applyFilters: async function(search = '', department = '', status = '', sortBy = 'name', sortDir = 'asc') {
        try {
            const result = await storageService.getAll(1, 100, search, department, status, sortBy, sortDir);
            return result.data || [];
        } catch (error) {
            console.error('Error applying filters:', error);
            return [];
        }
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