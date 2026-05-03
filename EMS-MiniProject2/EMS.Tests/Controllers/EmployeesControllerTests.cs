using NUnit.Framework;
using Moq;
using EMS.API.Controllers;
using EMS.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace EMS.Tests.Controllers;

[TestFixture]
public class EmployeesControllerTests
{
    private EmployeesController? _controller;

    [SetUp]
    public void Setup()
    {
        var mockRepository = new Mock<IEmployeeRepository>();
        var employeeService = new EmployeeService(mockRepository.Object);
        _controller = new EmployeesController(employeeService);
    }

    [Test]
    public void EmployeesController_IsInstantiable()
    {
        Assert.That(_controller, Is.Not.Null);
        Assert.That(_controller, Is.InstanceOf<ControllerBase>());
    }
}
