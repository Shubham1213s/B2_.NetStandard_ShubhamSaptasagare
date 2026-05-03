using NUnit.Framework;
using Moq;
using EMS.API.Services;
using EMS.API.Models;
using EMS.API.DTOs;

namespace EMS.Tests.Services;

[TestFixture]
public class EmployeeServiceTests
{
    private EmployeeService? _employeeService;
    private Mock<IEmployeeRepository>? _mockRepository;

    [SetUp]
    public void Setup()
    {
        _mockRepository = new Mock<IEmployeeRepository>(MockBehavior.Strict);
        _employeeService = new EmployeeService(_mockRepository.Object);
    }

    [Test]
    public async Task GetByIdAsync_WithValidId_ReturnsMappedEmployeeData()
    {
        var id = 10;
        var employee = new Employee
        {
            Id = id,
            FirstName = "John",
            LastName = "Doe",
            Email = "john@test.com",
            Department = "Engineering",
            Status = "Active"
        };

        _mockRepository!
            .Setup(r => r.GetByIdAsync(id))
            .ReturnsAsync(employee)
            .Verifiable();

        var result = await _employeeService!.GetByIdAsync(id);

        Assert.That(result, Is.Not.Null);
        Assert.That(result.Id, Is.EqualTo(id));
        Assert.That(result.FirstName, Is.EqualTo("John"));
        Assert.That(result.Email, Is.EqualTo("john@test.com"));

        _mockRepository.Verify();
        _mockRepository.VerifyNoOtherCalls();
    }

    [Test]
    public async Task GetByIdAsync_WithInvalidId_ReturnsNull()
    {
        var id = 9999;

        _mockRepository!
            .Setup(r => r.GetByIdAsync(id))
            .ReturnsAsync((Employee)null!)
            .Verifiable();

        var result = await _employeeService!.GetByIdAsync(id);

        Assert.That(result, Is.Null);

        _mockRepository.Verify();
        _mockRepository.VerifyNoOtherCalls();
    }

    [Test]
    public async Task CreateAsync_CallsCreateAsyncOnRepository_AndVerifiesInteractions()
    {
        var dto = new EmployeeRequestDto
        {
            FirstName = "Jane",
            LastName = "Smith",
            Email = "jane@test.com",
            Phone = "9876543210",
            Department = "Engineering",
            Designation = "Developer",
            Salary = 80000,
            JoinDate = DateTime.UtcNow.Date,
            Status = "Active"
        };

        _mockRepository!
            .Setup(r => r.EmailExistsAsync(dto.Email, 0))
            .ReturnsAsync(false)
            .Verifiable();

        _mockRepository!
            .Setup(r => r.CreateAsync(It.Is<Employee>(e =>
                e.FirstName == dto.FirstName &&
                e.LastName == dto.LastName &&
                e.Email == dto.Email &&
                e.Department == dto.Department)))
            .ReturnsAsync((Employee e) => e)
            .Verifiable();

        var result = await _employeeService!.CreateAsync(dto);

        Assert.That(result.success, Is.True);
        Assert.That(result.employee, Is.Not.Null);
        Assert.That(result.employee!.Email, Is.EqualTo(dto.Email));

        _mockRepository.Verify();
        _mockRepository.VerifyNoOtherCalls();
    }

    [Test]
    public void ValidateEmployee_WithInvalidEmail_ReturnsErrors()
    {
        var dto = new EmployeeRequestDto
        {
            FirstName = "",
            LastName = "Test",
            Email = "invalid",
            Phone = "123",
            Department = "InvalidDept",
            Designation = "",
            Salary = -100,
            JoinDate = default,
            Status = "Unknown"
        };

        var errors = _employeeService!.ValidateEmployee(dto);

        Assert.That(errors.Count, Is.GreaterThan(0));
        Assert.That(errors, Contains.Key("email"));
    }

    [Test]
    public void ValidateEmployee_WithValidData_ReturnsNoErrors()
    {
        var dto = new EmployeeRequestDto
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john@test.com",
            Phone = "1234567890",
            Department = "Engineering",
            Designation = "Developer",
            Salary = 60000,
            JoinDate = DateTime.Now,
            Status = "Active"
        };

        var errors = _employeeService!.ValidateEmployee(dto);

        Assert.That(errors, Is.Empty);
    }
}