using EMS.API.Data;
using EMS.API.Models;
using EMS.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace EMS.API.Services
{
    /// <summary>
    /// EF Core data access implementation for employee operations.
    /// </summary>
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly AppDbContext _context;

        public EmployeeRepository(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets paged employees with server-side filtering and sorting.
        /// </summary>
        public async Task<PagedResult<Employee>> GetAllAsync(EmployeeQueryParams query)
        {
            IQueryable<Employee> queryable = _context.Employees;

            int page = Math.Max(query.Page, 1);
            int pageSize = Math.Clamp(query.PageSize, 1, 100);

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                string searchLower = query.Search.ToLower();
                queryable = queryable.Where(e =>
                    (e.FirstName + " " + e.LastName).ToLower().Contains(searchLower) ||
                    e.Email.ToLower().Contains(searchLower));
            }

            // Apply department filter
            if (!string.IsNullOrWhiteSpace(query.Department))
            {
                queryable = queryable.Where(e => e.Department == query.Department);
            }

            // Apply status filter
            if (!string.IsNullOrWhiteSpace(query.Status))
            {
                queryable = queryable.Where(e => e.Status == query.Status);
            }

            // Get total count before pagination
            int totalCount = await queryable.CountAsync();

            // Apply sorting
            if (query.SortBy.ToLower() == "salary")
            {
                queryable = query.SortDir.ToLower() == "asc"
                    ? queryable.OrderBy(e => e.Salary)
                    : queryable.OrderByDescending(e => e.Salary);
            }
            else if (query.SortBy.ToLower() == "joindate")
            {
                queryable = query.SortDir.ToLower() == "asc"
                    ? queryable.OrderBy(e => e.JoinDate)
                    : queryable.OrderByDescending(e => e.JoinDate);
            }
            else // default to name
            {
                queryable = query.SortDir.ToLower() == "asc"
                    ? queryable.OrderBy(e => e.FirstName).ThenBy(e => e.LastName)
                    : queryable.OrderByDescending(e => e.FirstName).ThenByDescending(e => e.LastName);
            }

            // Calculate pagination
            int totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
            int skip = (page - 1) * pageSize;

            // Apply pagination
            var employees = await queryable
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<Employee>
            {
                Data = employees,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                HasNextPage = page < totalPages,
                HasPrevPage = page > 1
            };
        }

        /// <summary>
        /// Gets employee by id.
        /// </summary>
        public async Task<Employee> GetByIdAsync(int id)
        {
            return await _context.Employees.FirstOrDefaultAsync(e => e.Id == id);
        }

        /// <summary>
        /// Creates employee record.
        /// </summary>
        public async Task<Employee> CreateAsync(Employee employee)
        {
            employee.CreatedAt = DateTime.UtcNow;
            employee.UpdatedAt = DateTime.UtcNow;

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return employee;
        }

        /// <summary>
        /// Updates employee record.
        /// </summary>
        public async Task<Employee> UpdateAsync(int id, Employee updatedEmployee)
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == id);
            if (employee == null)
                return null;

            employee.FirstName = updatedEmployee.FirstName;
            employee.LastName = updatedEmployee.LastName;
            employee.Email = updatedEmployee.Email;
            employee.Phone = updatedEmployee.Phone;
            employee.Department = updatedEmployee.Department;
            employee.Designation = updatedEmployee.Designation;
            employee.Salary = updatedEmployee.Salary;
            employee.JoinDate = updatedEmployee.JoinDate;
            employee.Status = updatedEmployee.Status;
            employee.UpdatedAt = DateTime.UtcNow;

            _context.Employees.Update(employee);
            await _context.SaveChangesAsync();
            return employee;
        }

        /// <summary>
        /// Deletes employee record.
        /// </summary>
        public async Task<bool> DeleteAsync(int id)
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == id);
            if (employee == null)
                return false;

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Checks whether email exists, excluding optional id.
        /// </summary>
        public async Task<bool> EmailExistsAsync(string email, int excludeId = 0)
        {
            return await _context.Employees
                .AnyAsync(e => e.Email == email && e.Id != excludeId);
        }

        /// <summary>
        /// Calculates dashboard summary data.
        /// </summary>
        public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
        {
            var employees = await _context.Employees.ToListAsync();

            return new DashboardSummaryDto
            {
                TotalEmployees = employees.Count,
                ActiveCount = employees.Count(e => e.Status == "Active"),
                InactiveCount = employees.Count(e => e.Status == "Inactive"),
                AverageSalary = employees.Any() ? employees.Average(e => e.Salary) : 0,
                DepartmentBreakdown = employees
                    .GroupBy(e => e.Department)
                    .ToDictionary(g => g.Key, g => g.Count()),
                RecentEmployees = employees
                    .OrderByDescending(e => e.CreatedAt)
                    .Take(5)
                    .ToList()
            };
        }
    }
}
