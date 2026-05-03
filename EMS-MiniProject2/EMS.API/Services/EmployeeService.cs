using EMS.API.Models;
using EMS.API.DTOs;

namespace EMS.API.Services
{
    /// <summary>
    /// Handles employee business logic and validation.
    /// </summary>
    public class EmployeeService
    {
        private readonly IEmployeeRepository _repository;

        public EmployeeService(IEmployeeRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Validates employee request payload.
        /// </summary>
        public Dictionary<string, string> ValidateEmployee(EmployeeRequestDto dto)
        {
            var errors = new Dictionary<string, string>();

            if (string.IsNullOrWhiteSpace(dto.FirstName))
                errors["firstName"] = "First Name is required";

            if (string.IsNullOrWhiteSpace(dto.LastName))
                errors["lastName"] = "Last Name is required";

            if (string.IsNullOrWhiteSpace(dto.Email))
                errors["email"] = "Email is required";
            else if (!IsValidEmail(dto.Email))
                errors["email"] = "Email format is invalid";

            if (string.IsNullOrWhiteSpace(dto.Phone))
                errors["phone"] = "Phone is required";
            else if (!IsValidPhone(dto.Phone))
                errors["phone"] = "Phone must be 10 digits";

            if (string.IsNullOrWhiteSpace(dto.Department))
                errors["department"] = "Department is required";
            else if (!IsValidDepartment(dto.Department))
                errors["department"] = "Invalid department selection";

            if (string.IsNullOrWhiteSpace(dto.Designation))
                errors["designation"] = "Designation is required";

            if (dto.Salary <= 0)
                errors["salary"] = "Salary must be greater than 0";

            if (dto.JoinDate == default)
                errors["joinDate"] = "Join Date is required";

            if (string.IsNullOrWhiteSpace(dto.Status) || (dto.Status != "Active" && dto.Status != "Inactive"))
                errors["status"] = "Status must be Active or Inactive";

            return errors;
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private bool IsValidPhone(string phone)
        {
            return System.Text.RegularExpressions.Regex.IsMatch(phone, @"^\d{10}$");
        }

        private bool IsValidDepartment(string department)
        {
            var validDepartments = new[] { "Engineering", "Marketing", "HR", "Finance", "Operations" };
            return validDepartments.Contains(department);
        }

        /// <summary>
        /// Gets paged employees for list view.
        /// </summary>
        public async Task<PagedResult<Employee>> GetAllAsync(EmployeeQueryParams query)
        {
            return await _repository.GetAllAsync(query);
        }

        /// <summary>
        /// Gets an employee by identifier.
        /// </summary>
        public async Task<Employee> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        /// <summary>
        /// Creates a new employee after validation.
        /// </summary>
        public async Task<(bool success, Employee employee, Dictionary<string, string> errors)> CreateAsync(EmployeeRequestDto dto)
        {
            // Validate input
            var errors = ValidateEmployee(dto);
            if (errors.Count > 0)
                return (false, null, errors);

            // Check email uniqueness
            if (await _repository.EmailExistsAsync(dto.Email))
            {
                errors["email"] = "Email already exists";
                return (false, null, errors);
            }

            // Create employee
            var employee = new Employee
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                Department = dto.Department,
                Designation = dto.Designation,
                Salary = dto.Salary,
                JoinDate = dto.JoinDate,
                Status = dto.Status
            };

            await _repository.CreateAsync(employee);
            return (true, employee, null);
        }

        /// <summary>
        /// Updates an existing employee after validation.
        /// </summary>
        public async Task<(bool success, Employee employee, Dictionary<string, string> errors)> UpdateAsync(int id, EmployeeRequestDto dto)
        {
            // Validate input
            var errors = ValidateEmployee(dto);
            if (errors.Count > 0)
                return (false, null, errors);

            // Check if employee exists
            var employee = await _repository.GetByIdAsync(id);
            if (employee == null)
                return (false, null, new() { { "id", "Employee not found" } });

            // Check email uniqueness (excluding current employee)
            if (employee.Email != dto.Email && await _repository.EmailExistsAsync(dto.Email, id))
            {
                errors["email"] = "Email already exists";
                return (false, null, errors);
            }

            // Update employee
            employee.FirstName = dto.FirstName;
            employee.LastName = dto.LastName;
            employee.Email = dto.Email;
            employee.Phone = dto.Phone;
            employee.Department = dto.Department;
            employee.Designation = dto.Designation;
            employee.Salary = dto.Salary;
            employee.JoinDate = dto.JoinDate;
            employee.Status = dto.Status;

            await _repository.UpdateAsync(id, employee);
            return (true, employee, null);
        }

        /// <summary>
        /// Deletes an employee by identifier.
        /// </summary>
        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        /// <summary>
        /// Gets dashboard summary metrics.
        /// </summary>
        public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
        {
            return await _repository.GetDashboardSummaryAsync();
        }
    }
}
