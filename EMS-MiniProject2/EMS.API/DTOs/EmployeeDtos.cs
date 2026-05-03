namespace EMS.API.DTOs
{
    // Request DTO for creating/updating employees
    public class EmployeeRequestDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public decimal Salary { get; set; }
        public DateTime JoinDate { get; set; }
        public string Status { get; set; } // "Active" or "Inactive"
    }

    // Response DTO for serializing employees
    public class EmployeeResponseDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public decimal Salary { get; set; }
        public DateTime JoinDate { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    // Pagination response envelope
    public class PagedResult<T>
    {
        public List<T> Data { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPrevPage { get; set; }
    }

    // Query parameters for filtering and pagination
    public class EmployeeQueryParams
    {
        public string Search { get; set; } = "";
        public string Department { get; set; } = "";
        public string Status { get; set; } = "";
        public string SortBy { get; set; } = "name";
        public string SortDir { get; set; } = "asc";
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    // Dashboard summary DTO
    public class DashboardSummaryDto
    {
        public int TotalEmployees { get; set; }
        public int ActiveCount { get; set; }
        public int InactiveCount { get; set; }
        public decimal AverageSalary { get; set; }
        public Dictionary<string, int> DepartmentBreakdown { get; set; } = new();
        public List<Models.Employee> RecentEmployees { get; set; } = new();
    }

    // Authentication Request DTO
    public class AuthRequestDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    // Authentication Response DTO
    public class AuthResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
    }

    // Error Response DTO
    public class ErrorResponseDto
    {
        public bool Success { get; set; } = false;
        public string Message { get; set; }
        public Dictionary<string, string[]> Errors { get; set; } = new();
    }
}
