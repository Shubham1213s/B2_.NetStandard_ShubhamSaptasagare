using EMS.API.Services;
using EMS.API.Models;
using EMS.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly EmployeeService _employeeService;

        public EmployeesController(EmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        /// <summary>
        /// Get all employees with pagination, filtering, and sorting
        /// </summary>
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllEmployees(
            [FromQuery] string search = "",
            [FromQuery] string department = "",
            [FromQuery] string status = "",
            [FromQuery] string sortBy = "name",
            [FromQuery] string sortDir = "asc",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new EmployeeQueryParams
            {
                Search = search,
                Department = department,
                Status = status,
                SortBy = sortBy,
                SortDir = sortDir,
                Page = page,
                PageSize = pageSize
            };

            var result = await _employeeService.GetAllAsync(query);

            // Map to DTO
            var mappedData = result.Data.Select(e => MapToDto(e)).ToList();
            var pagedResult = new PagedResult<EmployeeResponseDto>
            {
                Data = mappedData,
                TotalCount = result.TotalCount,
                Page = result.Page,
                PageSize = result.PageSize,
                TotalPages = result.TotalPages,
                HasNextPage = result.HasNextPage,
                HasPrevPage = result.HasPrevPage
            };

            return Ok(pagedResult);
        }

        /// <summary>
        /// Get employee by ID
        /// </summary>
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var employee = await _employeeService.GetByIdAsync(id);
            if (employee == null)
                return NotFound(new { message = "Employee not found" });

            return Ok(MapToDto(employee));
        }

        /// <summary>
        /// Get dashboard summary
        /// </summary>
        [Authorize]
        [HttpGet("dashboard")]
        [HttpGet("dashboard/summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var summary = await _employeeService.GetDashboardSummaryAsync();

            // Create a new object with mapped DTOs
            var result = new
            {
                totalEmployees = summary.TotalEmployees,
                activeCount = summary.ActiveCount,
                inactiveCount = summary.InactiveCount,
                averageSalary = summary.AverageSalary,
                departmentBreakdown = summary.DepartmentBreakdown,
                recentEmployees = summary.RecentEmployees.Select(e => MapToDto(e)).ToList()
            };

            return Ok(result);
        }

        /// <summary>
        /// Create new employee (Admin only)
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateEmployee([FromBody] EmployeeRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (success, employee, errors) = await _employeeService.CreateAsync(dto);

            if (!success)
            {
                var errorResponse = new ErrorResponseDto
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors.ToDictionary(kvp => kvp.Key, kvp => new[] { kvp.Value })
                };

                if (errors.ContainsKey("email") && errors["email"] == "Email already exists")
                    return Conflict(errorResponse);

                return BadRequest(errorResponse);
            }

            return CreatedAtAction(nameof(GetEmployeeById), new { id = employee.Id }, MapToDto(employee));
        }

        /// <summary>
        /// Update employee (Admin only)
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] EmployeeRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (success, employee, errors) = await _employeeService.UpdateAsync(id, dto);

            if (!success)
            {
                if (errors.ContainsKey("id"))
                    return NotFound(new { message = "Employee not found" });

                var errorResponse = new ErrorResponseDto
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors.ToDictionary(kvp => kvp.Key, kvp => new[] { kvp.Value })
                };

                if (errors.ContainsKey("email") && errors["email"] == "Email already exists")
                    return Conflict(errorResponse);

                return BadRequest(errorResponse);
            }

            return Ok(MapToDto(employee));
        }

        /// <summary>
        /// Delete employee (Admin only)
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var success = await _employeeService.DeleteAsync(id);

            if (!success)
                return NotFound(new { message = "Employee not found" });

            return Ok(new { message = "Employee deleted successfully" });
        }

        // Helper method to map Employee to EmployeeResponseDto
        private EmployeeResponseDto MapToDto(Employee employee)
        {
            return new EmployeeResponseDto
            {
                Id = employee.Id,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                Email = employee.Email,
                Phone = employee.Phone,
                Department = employee.Department,
                Designation = employee.Designation,
                Salary = employee.Salary,
                JoinDate = employee.JoinDate,
                Status = employee.Status,
                CreatedAt = employee.CreatedAt,
                UpdatedAt = employee.UpdatedAt
            };
        }
    }
}
