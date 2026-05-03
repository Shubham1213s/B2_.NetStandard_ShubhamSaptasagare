using EMS.API.Models;
using EMS.API.DTOs;

namespace EMS.API.Services
{
    /// <summary>
    /// Data access contract for employee operations.
    /// </summary>
    public interface IEmployeeRepository
    {
        /// <summary>
        /// Gets paged employees with filtering and sorting.
        /// </summary>
        Task<PagedResult<Employee>> GetAllAsync(EmployeeQueryParams query);

        /// <summary>
        /// Gets employee by id.
        /// </summary>
        Task<Employee> GetByIdAsync(int id);

        /// <summary>
        /// Creates employee record.
        /// </summary>
        Task<Employee> CreateAsync(Employee employee);

        /// <summary>
        /// Updates employee record.
        /// </summary>
        Task<Employee> UpdateAsync(int id, Employee employee);

        /// <summary>
        /// Deletes employee record.
        /// </summary>
        Task<bool> DeleteAsync(int id);

        /// <summary>
        /// Checks whether email already exists.
        /// </summary>
        Task<bool> EmailExistsAsync(string email, int excludeId = 0);

        /// <summary>
        /// Gets dashboard summary metrics.
        /// </summary>
        Task<DashboardSummaryDto> GetDashboardSummaryAsync();
    }
}
