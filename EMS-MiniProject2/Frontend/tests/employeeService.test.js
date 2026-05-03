const storageService = require("../js/storageService");
const employeeService = require("../js/employeeService");

describe("employeeService", () => {
    beforeEach(() => {
        storageService.getAll = jest.fn();
        storageService.getById = jest.fn();
        storageService.add = jest.fn();
        storageService.update = jest.fn();
        storageService.remove = jest.fn();
    });

    test("getAll delegates to storageService and updates cache", async () => {
        const paged = { data: [{ id: 1, firstName: "John" }], totalCount: 1 };
        storageService.getAll.mockResolvedValue(paged);

        const result = await employeeService.getAll(2, 10, "jo", "Engineering", "Active", "name", "asc");

        expect(storageService.getAll).toHaveBeenCalledWith(2, 10, "jo", "Engineering", "Active", "name", "asc");
        expect(result).toEqual(paged);
        expect(employeeService._allEmployees).toEqual(paged.data);
    });

    test("getById delegates to storageService", async () => {
        storageService.getById.mockResolvedValue({ id: 5, firstName: "Jane" });

        const result = await employeeService.getById(5);

        expect(storageService.getById).toHaveBeenCalledWith(5);
        expect(result.id).toBe(5);
    });

    test("add delegates to storageService", async () => {
        const payload = { firstName: "A", lastName: "B" };
        storageService.add.mockResolvedValue({ id: 9, ...payload });

        const result = await employeeService.add(payload);

        expect(storageService.add).toHaveBeenCalledWith(payload);
        expect(result.id).toBe(9);
    });

    test("update delegates to storageService", async () => {
        const payload = { firstName: "Updated" };
        storageService.update.mockResolvedValue({ id: 1, ...payload });

        const result = await employeeService.update(1, payload);

        expect(storageService.update).toHaveBeenCalledWith(1, payload);
        expect(result.firstName).toBe("Updated");
    });

    test("remove delegates to storageService", async () => {
        storageService.remove.mockResolvedValue({ success: true });

        const result = await employeeService.remove(1);

        expect(storageService.remove).toHaveBeenCalledWith(1);
        expect(result.success).toBe(true);
    });

    test("applyFilters returns result data", async () => {
        storageService.getAll.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] });

        const result = await employeeService.applyFilters("john", "Engineering", "Active", "salary", "desc");

        expect(storageService.getAll).toHaveBeenCalledWith(1, 100, "john", "Engineering", "Active", "salary", "desc");
        expect(result.length).toBe(2);
    });

    test("applyFilters returns empty array when storage throws", async () => {
        storageService.getAll.mockRejectedValue(new Error("boom"));

        const result = await employeeService.applyFilters("", "", "", "name", "asc");

        expect(result).toEqual([]);
    });
});
