const storageService = require("../js/storageService");
const employeeService = require("../js/employeeService");

// --- Mock storageService with controlled test data ---
let mockEmployees;

beforeEach(() => {
    mockEmployees = [
        { id: 1, firstName: "Shubham", lastName: "Saptasagare", email: "shubham@xyz.com", phone: "8010215831", department: "Engineering", designation: "Software Engineer", salary: 750000, joinDate: "2022-06-15", status: "Active" },
        { id: 2, firstName: "Priya",   lastName: "Menon",        email: "priya@xyz.com",   phone: "9876543210", department: "HR",          designation: "HR Executive",       salary: 500000, joinDate: "2021-09-12", status: "Inactive" },
        { id: 3, firstName: "Arjun",   lastName: "Kapoor",       email: "arjun@xyz.com",   phone: "7622321411", department: "Finance",      designation: "Accountant",         salary: 600000, joinDate: "2020-11-20", status: "Active" },
        { id: 4, firstName: "Sneha",   lastName: "Kulkarni",     email: "sneha@xyz.com",   phone: "9876543215", department: "Engineering", designation: "Frontend Developer",  salary: 720000, joinDate: "2023-02-14", status: "Active" },
    ];

    // Inject mock into storageService
    storageService.getAll  = jest.fn(() => [...mockEmployees]);
    storageService.getById = jest.fn((id) => mockEmployees.find(e => e.id === id));
    storageService.add     = jest.fn((emp) => mockEmployees.push(emp));
    storageService.update  = jest.fn((id, data) => {
        let emp = mockEmployees.find(e => e.id === id);
        if (emp) Object.assign(emp, data);
    });
    storageService.remove  = jest.fn((id) => {
        let i = mockEmployees.findIndex(e => e.id === id);
        if (i !== -1) mockEmployees.splice(i, 1);
    });
    storageService.nextId  = jest.fn(() => Math.max(...mockEmployees.map(e => e.id)) + 1);
});

// --- getAll ---
describe("getAll", () => {
    test("should return all employees", () => {
        expect(employeeService.getAll().length).toBe(4);
        expect(Array.isArray(employeeService.getAll())).toBe(true);
    });
});

// --- getById ---
describe("getById", () => {
    test("should return correct employee by id", () => {
        let emp = employeeService.getById(1);
        expect(emp.firstName).toBe("Shubham");
    });

    test("should return undefined for non-existent id", () => {
        expect(employeeService.getById(999)).toBeUndefined();
    });
});

// --- add ---
describe("add", () => {
    test("should add a new employee and increase count", () => {
        let before = mockEmployees.length;
        employeeService.add({
            firstName: "Test", lastName: "User", email: "test@xyz.com",
            phone: "9999999999", department: "HR", designation: "Tester",
            salary: 400000, joinDate: "2024-01-01", status: "Active"
        });
        expect(storageService.add).toHaveBeenCalled();
        expect(mockEmployees.length).toBe(before + 1);
    });

    test("new employee should have auto-incremented id", () => {
        employeeService.add({
            firstName: "Test", lastName: "User", email: "test@xyz.com",
            phone: "9999999999", department: "HR", designation: "Tester",
            salary: 400000, joinDate: "2024-01-01", status: "Active"
        });
        let added = mockEmployees[mockEmployees.length - 1];
        expect(added.id).toBe(5);
    });
});

// --- update ---
describe("update", () => {
    test("should update employee data", () => {
        employeeService.update(1, {
            firstName: "Updated", lastName: "Name", email: "shubham@xyz.com",
            phone: "8010215831", department: "Engineering", designation: "Senior Engineer",
            salary: 900000, joinDate: "2022-06-15", status: "Active"
        });
        expect(storageService.update).toHaveBeenCalledWith(1, expect.objectContaining({ firstName: "Updated" }));
    });
});

// --- remove ---
describe("remove", () => {
    test("should remove employee by id", () => {
        employeeService.remove(1);
        expect(storageService.remove).toHaveBeenCalledWith(1);
        expect(mockEmployees.find(e => e.id === 1)).toBeUndefined();
    });
});

// --- applyFilters: Search ---
describe("applyFilters - search", () => {
    test("should filter by name (case-insensitive)", () => {
        let result = employeeService.applyFilters("shubham", "", "", "", "");
        expect(result.length).toBe(1);
        expect(result[0].firstName).toBe("Shubham");
    });

    test("should filter by email", () => {
        let result = employeeService.applyFilters("priya@xyz.com", "", "", "", "");
        expect(result.length).toBe(1);
    });

    test("should return empty array when no match", () => {
        let result = employeeService.applyFilters("zzznomatch", "", "", "", "");
        expect(result.length).toBe(0);
    });
});

// --- applyFilters: Department ---
describe("applyFilters - department", () => {
    test("should filter by department", () => {
        let result = employeeService.applyFilters("", "Engineering", "", "", "");
        expect(result.length).toBe(2);
        expect(result.every(e => e.department === "Engineering")).toBe(true);
    });

    test("should return all when no department filter", () => {
        let result = employeeService.applyFilters("", "", "", "", "");
        expect(result.length).toBe(4);
    });
});

// --- applyFilters: Status ---
describe("applyFilters - status", () => {
    test("should filter Active employees", () => {
        let result = employeeService.applyFilters("", "", "Active", "", "");
        expect(result.every(e => e.status === "Active")).toBe(true);
        expect(result.length).toBe(3);
    });

    test("should filter Inactive employees", () => {
        let result = employeeService.applyFilters("", "", "Inactive", "", "");
        expect(result.every(e => e.status === "Inactive")).toBe(true);
        expect(result.length).toBe(1);
    });
});

// --- applyFilters: Combined ---
describe("applyFilters - combined", () => {
    test("should apply search + department + status together", () => {
        let result = employeeService.applyFilters("sneha", "Engineering", "Active", "", "");
        expect(result.length).toBe(1);
        expect(result[0].firstName).toBe("Sneha");
    });
});

// --- applyFilters: Sorting ---
describe("applyFilters - sorting", () => {
    test("should sort by salary ascending", () => {
        let result = employeeService.applyFilters("", "", "", "salary", "asc");
        expect(result[0].salary).toBeLessThanOrEqual(result[1].salary);
    });

    test("should sort by salary descending", () => {
        let result = employeeService.applyFilters("", "", "", "salary", "desc");
        expect(result[0].salary).toBeGreaterThanOrEqual(result[1].salary);
    });

    test("should sort by lastName ascending (A-Z)", () => {
        let result = employeeService.applyFilters("", "", "", "name", "asc");
        expect(result[0].lastName <= result[1].lastName).toBe(true);
    });

    test("should sort by joinDate ascending", () => {
        let result = employeeService.applyFilters("", "", "", "date", "asc");
        expect(new Date(result[0].joinDate) <= new Date(result[1].joinDate)).toBe(true);
    });

    test("should sort by joinDate descending", () => {
        let result = employeeService.applyFilters("", "", "", "date", "desc");
        expect(new Date(result[0].joinDate) >= new Date(result[1].joinDate)).toBe(true);
    });
});