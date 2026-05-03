const dashboardService = require("../js/dashboardService");
const storageService = require("../js/storageService");

describe("dashboardService", () => {
    const payload = {
        totalEmployees: 5,
        activeCount: 3,
        inactiveCount: 2,
        averageSalary: 610000,
        departmentBreakdown: { Engineering: 2, HR: 1, Finance: 1, Marketing: 1 },
        recentEmployees: [{ id: 5 }, { id: 4 }, { id: 3 }, { id: 2 }, { id: 1 }]
    };

    beforeEach(() => {
        storageService.getDashboardSummary = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => payload
        });
    });

    test("getSummary returns dashboard payload", async () => {
        const result = await dashboardService.getSummary();

        expect(storageService.getDashboardSummary).toHaveBeenCalled();
        expect(result.totalEmployees).toBe(5);
        expect(result.activeCount).toBe(3);
    });

    test("getDepartmentBreakdown returns department map", async () => {
        const result = await dashboardService.getDepartmentBreakdown();
        expect(result.Engineering).toBe(2);
        expect(result.HR).toBe(1);
    });

    test("getRecentEmployees returns sliced items", async () => {
        const result = await dashboardService.getRecentEmployees(3);
        expect(result.length).toBe(3);
        expect(result[0].id).toBe(5);
    });

    test("getSummary throws when API returns failure", async () => {
        storageService.getDashboardSummary.mockResolvedValue({ ok: false, status: 500 });
        await expect(dashboardService.getSummary()).rejects.toThrow("Failed to fetch dashboard summary");
    });
});
