using NUnit.Framework;
using Microsoft.EntityFrameworkCore;
using EMS.API.Data;
using EMS.API.Models;
using EMS.API.Services;
using EMS.API.DTOs;

namespace EMS.Tests.Integration;

[TestFixture]
public class EmployeeIntegrationTests
{
    private AppDbContext? _context;
    private IEmployeeRepository? _repository;
    private EmployeeService? _service;

    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);
        _repository = new EmployeeRepository(_context);
        _service = new EmployeeService(_repository);
    }

    [TearDown]
    public void TearDown()
    {
        _context?.Dispose();
    }

    [Test]
    public async Task GetByIdAsync_WithValidId_ReturnsEmployee()
    {
        // Arrange
        var employee = new Employee
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john@example.com",
            Phone = "1234567890",
            Department = "Engineering",
            Designation = "Developer",
            Salary = 60000,
            JoinDate = DateTime.Now,
            Status = "Active"
        };

        _context!.Employees.Add(employee);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository!.GetByIdAsync(employee.Id);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.FirstName, Is.EqualTo("John"));
        Assert.That(result.Email, Is.EqualTo("john@example.com"));
    }

    [Test]
    public async Task GetByIdAsync_WithInvalidId_ReturnsNull()
    {
        // Act
        var result = await _repository!.GetByIdAsync(9999);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task CreateAsync_WithValidEmployee_SavesAndReturnsEmployee()
    {
        // Arrange
        var employee = new Employee
        {
            FirstName = "Jane",
            LastName = "Smith",
            Email = "jane@example.com",
            Phone = "9876543210",
            Department = "Marketing",
            Designation = "Manager",
            Salary = 75000,
            JoinDate = DateTime.Now,
            Status = "Active"
        };

        // Act
        var result = await _repository!.CreateAsync(employee);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Id, Is.GreaterThan(0));
        
        var savedEmployee = await _context!.Employees.FirstOrDefaultAsync(e => e.Email == "jane@example.com");
        Assert.That(savedEmployee, Is.Not.Null);
        Assert.That(savedEmployee!.FirstName, Is.EqualTo("Jane"));
    }

    [Test]
    public async Task UpdateAsync_WithValidData_UpdatesEmployee()
    {
        // Arrange
        var employee = new Employee
        {
            FirstName = "Mike",
            LastName = "Johnson",
            Email = "mike@example.com",
            Phone = "5555555555",
            Department = "HR",
            Designation = "Specialist",
            Salary = 65000,
            JoinDate = DateTime.Now,
            Status = "Active"
        };

        _context!.Employees.Add(employee);
        await _context.SaveChangesAsync();
        var employeeId = employee.Id;

        var updateData = new Employee
        {
            Id = employeeId,
            FirstName = "Michael",
            LastName = "Johnson",
            Email = "michael@example.com",
            Phone = "5555555555",
            Department = "Finance",
            Designation = "Analyst",
            Salary = 70000,
            JoinDate = DateTime.Now,
            Status = "Active"
        };

        // Act
        var result = await _repository!.UpdateAsync(employeeId, updateData);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.FirstName, Is.EqualTo("Michael"));
        Assert.That(result.Department, Is.EqualTo("Finance"));
        Assert.That(result.Salary, Is.EqualTo(70000));
    }

    [Test]
    public async Task DeleteAsync_WithValidId_RemovesEmployee()
    {
        // Arrange
        var employee = new Employee
        {
            FirstName = "Delete",
            LastName = "Test",
            Email = "delete@example.com",
            Phone = "1111111111",
            Department = "Testing",
            Designation = "Tester",
            Salary = 50000,
            JoinDate = DateTime.Now,
            Status = "Active"
        };

        _context!.Employees.Add(employee);
        await _context.SaveChangesAsync();
        var employeeId = employee.Id;

        // Act
        var result = await _repository!.DeleteAsync(employeeId);

        // Assert
        Assert.That(result, Is.True);
        
        var deletedEmployee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == employeeId);
        Assert.That(deletedEmployee, Is.Null);
    }

    [Test]
    public async Task EmailExistsAsync_WithExistingEmail_ReturnsTrue()
    {
        // Arrange
        var employee = new Employee
        {
            FirstName = "Existing",
            LastName = "Email",
            Email = "existing@example.com",
            Phone = "2222222222",
            Department = "Testing",
            Designation = "Tester",
            Salary = 55000,
            JoinDate = DateTime.Now,
            Status = "Active"
        };

        _context!.Employees.Add(employee);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository!.EmailExistsAsync("existing@example.com");

        // Assert
        Assert.That(result, Is.True);
    }

    [Test]
    public async Task EmailExistsAsync_WithNonExistingEmail_ReturnsFalse()
    {
        // Act
        var result = await _repository!.EmailExistsAsync("nonexistent@example.com");

        // Assert
        Assert.That(result, Is.False);
    }

    [Test]
    public async Task CreateAsync_WithDuplicateEmail_EnforcesEmailUniqueness()
    {
        var first = new EmployeeRequestDto
        {
            FirstName = "First",
            LastName = "User",
            Email = "same@example.com",
            Phone = "1234567890",
            Department = "Engineering",
            Designation = "Developer",
            Salary = 50000,
            JoinDate = DateTime.UtcNow.Date,
            Status = "Active"
        };

        var second = new EmployeeRequestDto
        {
            FirstName = "Second",
            LastName = "User",
            Email = "same@example.com",
            Phone = "0987654321",
            Department = "Engineering",
            Designation = "Developer",
            Salary = 55000,
            JoinDate = DateTime.UtcNow.Date,
            Status = "Active"
        };

        var firstResult = await _service!.CreateAsync(first);
        var secondResult = await _service.CreateAsync(second);

        Assert.That(firstResult.success, Is.True);
        Assert.That(secondResult.success, Is.False);
        Assert.That(secondResult.errors, Is.Not.Null);
        Assert.That(secondResult.errors, Contains.Key("email"));
    }

    [Test]
    public async Task GetAllAsync_WithValidQuery_ReturnsPagedResult()
    {
        // Arrange
        var employees = new List<Employee>
        {
            new Employee { FirstName = "John", LastName = "Doe", Email = "john1@example.com", Phone = "1111111111", Department = "Engineering", Designation = "Dev", Salary = 60000, JoinDate = DateTime.Now, Status = "Active" },
            new Employee { FirstName = "Jane", LastName = "Smith", Email = "jane1@example.com", Phone = "2222222222", Department = "Marketing", Designation = "Manager", Salary = 75000, JoinDate = DateTime.Now, Status = "Active" },
            new Employee { FirstName = "Mike", LastName = "Johnson", Email = "mike1@example.com", Phone = "3333333333", Department = "Engineering", Designation = "Lead", Salary = 80000, JoinDate = DateTime.Now, Status = "Active" }
        };

        _context!.Employees.AddRange(employees);
        await _context.SaveChangesAsync();

        var query = new EmployeeQueryParams { Page = 1, PageSize = 10, SortBy = "name", SortDir = "asc" };

        // Act
        var result = await _repository!.GetAllAsync(query);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.TotalCount, Is.EqualTo(3));
        Assert.That(result.Data.Count, Is.EqualTo(3));
        Assert.That(result.Page, Is.EqualTo(1));
    }

    [Test]
    public async Task GetAllAsync_WithDepartmentFilter_ReturnsFilteredResults()
    {
        // Arrange
        var employees = new List<Employee>
        {
            new Employee { FirstName = "John", LastName = "Doe", Email = "john2@example.com", Phone = "1111111111", Department = "Engineering", Designation = "Dev", Salary = 60000, JoinDate = DateTime.Now, Status = "Active" },
            new Employee { FirstName = "Jane", LastName = "Smith", Email = "jane2@example.com", Phone = "2222222222", Department = "Marketing", Designation = "Manager", Salary = 75000, JoinDate = DateTime.Now, Status = "Active" },
            new Employee { FirstName = "Mike", LastName = "Wilson", Email = "mike2@example.com", Phone = "3333333333", Department = "Engineering", Designation = "Lead", Salary = 80000, JoinDate = DateTime.Now, Status = "Active" }
        };

        _context!.Employees.AddRange(employees);
        await _context.SaveChangesAsync();

        var query = new EmployeeQueryParams { Page = 1, PageSize = 10, Department = "Engineering", SortBy = "name", SortDir = "asc" };

        // Act
        var result = await _repository!.GetAllAsync(query);

        // Assert
        Assert.That(result.TotalCount, Is.EqualTo(2));
        Assert.That(result.Data, Has.All.Matches<Employee>(e => e.Department == "Engineering"));
    }

    [Test]
    public async Task GetAllAsync_WithSearchFilter_ReturnsSearchResults()
    {
        // Arrange
        var employees = new List<Employee>
        {
            new Employee { FirstName = "John", LastName = "Doe", Email = "john3@example.com", Phone = "1111111111", Department = "Engineering", Designation = "Dev", Salary = 60000, JoinDate = DateTime.Now, Status = "Active" },
            new Employee { FirstName = "Jane", LastName = "Smith", Email = "jane3@example.com", Phone = "2222222222", Department = "Marketing", Designation = "Manager", Salary = 75000, JoinDate = DateTime.Now, Status = "Active" },
            new Employee { FirstName = "Johnny", LastName = "Cash", Email = "johnny3@example.com", Phone = "3333333333", Department = "Finance", Designation = "Analyst", Salary = 70000, JoinDate = DateTime.Now, Status = "Active" }
        };

        _context!.Employees.AddRange(employees);
        await _context.SaveChangesAsync();

        var query = new EmployeeQueryParams { Page = 1, PageSize = 10, Search = "John", SortBy = "name", SortDir = "asc" };

        // Act
        var result = await _repository!.GetAllAsync(query);

        // Assert
        Assert.That(result.TotalCount, Is.EqualTo(2));
        Assert.That(result.Data, Has.All.Matches<Employee>(e => e.FirstName.Contains("John")));
    }

    [Test]
    public async Task GetAllAsync_WithSortByName_ReturnsSortedResults()
    {
        // Arrange
        var employees = new List<Employee>
        {
            new Employee { FirstName = "Zack", LastName = "Adams", Email = "zack@example.com", Phone = "1111111111", Department = "Engineering", Designation = "Dev", Salary = 60000, JoinDate = DateTime.Now, Status = "Active" },
            new Employee { FirstName = "Alice", LastName = "Brown", Email = "alice@example.com", Phone = "2222222222", Department = "Marketing", Designation = "Manager", Salary = 75000, JoinDate = DateTime.Now, Status = "Active" },
            new Employee { FirstName = "Mike", LastName = "Chen", Email = "mike@example.com", Phone = "3333333333", Department = "Finance", Designation = "Analyst", Salary = 70000, JoinDate = DateTime.Now, Status = "Active" }
        };

        _context!.Employees.AddRange(employees);
        await _context.SaveChangesAsync();

        var query = new EmployeeQueryParams { Page = 1, PageSize = 10, SortBy = "name", SortDir = "asc" };

        // Act
        var result = await _repository!.GetAllAsync(query);

        // Assert
        Assert.That(result.Data[0].FirstName, Is.EqualTo("Alice"));
        Assert.That(result.Data[1].FirstName, Is.EqualTo("Mike"));
        Assert.That(result.Data[2].FirstName, Is.EqualTo("Zack"));
    }

    [Test]
    public async Task GetAllAsync_WithPagination_ReturnsCorrectPage()
    {
        // Arrange
        var employees = Enumerable.Range(1, 25)
            .Select(i => new Employee
            {
                FirstName = $"Employee{i}",
                LastName = "Test",
                Email = $"emp{i}@example.com",
                Phone = $"111111111{i}",
                Department = "Engineering",
                Designation = "Dev",
                Salary = 60000,
                JoinDate = DateTime.Now,
                Status = "Active"
            }).ToList();

        _context!.Employees.AddRange(employees);
        await _context.SaveChangesAsync();

        var query = new EmployeeQueryParams { Page = 2, PageSize = 10, SortBy = "name", SortDir = "asc" };

        // Act
        var result = await _repository!.GetAllAsync(query);

        // Assert
        Assert.That(result.TotalCount, Is.EqualTo(25));
        Assert.That(result.Data.Count, Is.EqualTo(10));
        Assert.That(result.Page, Is.EqualTo(2));
    }

    [Test]
    public async Task GetDashboardSummaryAsync_ReturnsSummaryData()
    {
        // Arrange
        var employees = new List<Employee>
        {
            new Employee { FirstName = "John", LastName = "Doe", Email = "john4@example.com", Phone = "1111111111", Department = "Engineering", Designation = "Dev", Salary = 60000, JoinDate = DateTime.Now, Status = "Active" },
            new Employee { FirstName = "Jane", LastName = "Smith", Email = "jane4@example.com", Phone = "2222222222", Department = "Marketing", Designation = "Manager", Salary = 75000, JoinDate = DateTime.Now, Status = "Active" },
            new Employee { FirstName = "Inactive", LastName = "User", Email = "inactive@example.com", Phone = "3333333333", Department = "HR", Designation = "Staff", Salary = 50000, JoinDate = DateTime.Now, Status = "Inactive" }
        };

        _context!.Employees.AddRange(employees);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository!.GetDashboardSummaryAsync();

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.TotalEmployees, Is.EqualTo(3));
        Assert.That(result.ActiveCount, Is.EqualTo(2));
        Assert.That(result.InactiveCount, Is.EqualTo(1));
    }
}
