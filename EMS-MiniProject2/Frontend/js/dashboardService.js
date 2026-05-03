// dashboardService.js - Provides data for the dashboard view

if (typeof module !== "undefined" && module.exports) {
    var storageService = require("./storageService");
}

var dashboardService = {

    /**
     * Gets dashboard summary from API.
     */
    getSummary: async function() {
        try {
            const response = await storageService.getDashboardSummary();

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard summary');
            }

            const data = await response.json();
            return {
                totalEmployees: data.totalEmployees,
                activeCount: data.activeCount,
                inactiveCount: data.inactiveCount,
                averageSalary: data.averageSalary,
                departmentBreakdown: data.departmentBreakdown,
                recentEmployees: data.recentEmployees
            };
        } catch (error) {
            console.error('Dashboard error:', error);
            throw error;
        }
    },

    /**
     * Gets department breakdown derived from summary.
     */
    getDepartmentBreakdown: async function() {
        try {
            const summary = await this.getSummary();
            return summary.departmentBreakdown;
        } catch (error) {
            console.error('Department breakdown error:', error);
            throw error;
        }
    },

    /**
     * Gets top n recent employees derived from summary payload.
     * @param {number} n
     */
    getRecentEmployees: async function(n = 5) {
        try {
            const summary = await this.getSummary();
            return summary.recentEmployees.slice(0, n);
        } catch (error) {
            console.error('Recent employees error:', error);
            throw error;
        }
    }

};

if (typeof module !== "undefined" && module.exports) {
    module.exports = dashboardService;
}

if (typeof window !== "undefined") {
    window.dashboardService = dashboardService;
}