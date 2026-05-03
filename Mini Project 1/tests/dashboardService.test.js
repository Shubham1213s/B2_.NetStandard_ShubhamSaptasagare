const employeeService = require("../js/employeeService");
const dashboardService = require("../js/dashboardService");

// --- Mock employeeService with controlled test data ---
const mockEmployees = [
    { id: 1, firstName: "A", lastName: "B", email: "a@xyz.com", department: "Engineering", status: "Active",   salary: 700000, joinDate: "2022-01-01" },
    { id: 2, firstName: "C", lastName: "D", email: "c@xyz.com", department: "Engineering", status: "Active",   salary: 600000, joinDate: "2021-05-10" },
    { id: 3, firstName: "E", lastName: "F", email: "e@xyz.com", department: "HR",          status: "Inactive", salary: 500000, joinDate: "2020-03-15" },
    { id: 4, firstName: "G", lastName: "H", email: "g@xyz.com", department: "Finance",     status: "Active",   salary: 800000, joinDate: "2023-11-01" },
    { id: 5, firstName: "I", lastName: "J", email: "i@xyz.com", department: "Marketing",   status: "Inactive", salary: 450000, joinDate: "2019-07-20" },
];

beforeEach(() => {
    employeeService.getAll = jest.fn(() => [...mockEmployees]);
});

// --- getSummary ---
describe("getSummary", () => {
    test("should return correct total employee count", () => {
        let summary = dashboardService.getSummary();
        expect(summary.total).toBe(5);
    });

    test("should return correct active employee count", () => {
        let summary = dashboardService.getSummary();
        expect(summary.active).toBe(3);
    });

    test("should return correct inactive employee count", () => {
        let summary = dashboardService.getSummary();
        expect(summary.inactive).toBe(2);
    });

    test("should return correct number of unique departments", () => {
        let summary = dashboardService.getSummary();
        expect(summary.departments).toBe(4); // Engineering, HR, Finance, Marketing
    });

    test("active + inactive should equal total", () => {
        let summary = dashboardService.getSummary();
        expect(summary.active + summary.inactive).toBe(summary.total);
    });
});

// --- getDepartmentBreakdown ---
describe("getDepartmentBreakdown", () => {
    test("should return an object", () => {
        let breakdown = dashboardService.getDepartmentBreakdown();
        expect(typeof breakdown).toBe("object");
    });

    test("should correctly count Engineering employees", () => {
        let breakdown = dashboardService.getDepartmentBreakdown();
        expect(breakdown["Engineering"]).toBe(2);
    });

    test("should correctly count HR employees", () => {
        let breakdown = dashboardService.getDepartmentBreakdown();
        expect(breakdown["HR"]).toBe(1);
    });

    test("should correctly count Finance employees", () => {
        let breakdown = dashboardService.getDepartmentBreakdown();
        expect(breakdown["Finance"]).toBe(1);
    });

    test("total across all departments should equal total employees", () => {
        let breakdown = dashboardService.getDepartmentBreakdown();
        let total = Object.values(breakdown).reduce((a, b) => a + b, 0);
        expect(total).toBe(5);
    });
});

// --- getRecentEmployees ---
describe("getRecentEmployees", () => {
    test("should return at most n employees", () => {
        let recent = dashboardService.getRecentEmployees(3);
        expect(recent.length).toBeLessThanOrEqual(3);
        expect(recent.length).toBe(3);
    });

    test("should return employees sorted by id descending (most recent first)", () => {
        let recent = dashboardService.getRecentEmployees(5);
        expect(recent[0].id).toBe(5);
        expect(recent[1].id).toBe(4);
    });

    test("should return only 1 when n=1", () => {
        let recent = dashboardService.getRecentEmployees(1);
        expect(recent.length).toBe(1);
        expect(recent[0].id).toBe(5); // highest id
    });

    test("should handle n larger than total employees", () => {
        let recent = dashboardService.getRecentEmployees(100);
        expect(recent.length).toBe(5);
    });
});