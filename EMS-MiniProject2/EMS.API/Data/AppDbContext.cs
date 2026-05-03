using Microsoft.EntityFrameworkCore;
using EMS.API.Models;

namespace EMS.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<AppUser> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Employee entity
            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.Email)
                .IsUnique();

            modelBuilder.Entity<Employee>()
                .Property(e => e.Salary)
                .HasPrecision(18, 2);

            // Seed Employee data
            var employees = GetSeedEmployees();
            modelBuilder.Entity<Employee>().HasData(employees);

            // Configure AppUser entity
            modelBuilder.Entity<AppUser>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // Seed User data
            var users = GetSeedUsers();
            modelBuilder.Entity<AppUser>().HasData(users);
        }

        private static List<Employee> GetSeedEmployees()
        {
            return new List<Employee>
            {
                new Employee { Id = 1, FirstName = "Amit", LastName = "Sharma", Email = "amit.sharma@example.com", Phone = "9876543210", Department = "Engineering", Designation = "Senior Developer", Salary = 95000, JoinDate = new DateTime(2021, 5, 10), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 2, FirstName = "Priya", LastName = "Patel", Email = "priya.patel@example.com", Phone = "9876543211", Department = "Marketing", Designation = "Marketing Manager", Salary = 75000, JoinDate = new DateTime(2020, 3, 15), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 3, FirstName = "Rahul", LastName = "Verma", Email = "rahul.verma@example.com", Phone = "9876543212", Department = "HR", Designation = "HR Specialist", Salary = 65000, JoinDate = new DateTime(2019, 8, 20), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 4, FirstName = "Sneha", LastName = "Kulkarni", Email = "sneha.kulkarni@example.com", Phone = "9876543213", Department = "Finance", Designation = "Finance Analyst", Salary = 70000, JoinDate = new DateTime(2021, 1, 25), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 5, FirstName = "Vikas", LastName = "Yadav", Email = "vikas.yadav@example.com", Phone = "9876543214", Department = "Operations", Designation = "Operations Manager", Salary = 80000, JoinDate = new DateTime(2020, 6, 10), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 6, FirstName = "Neha", LastName = "Gupta", Email = "neha.gupta@example.com", Phone = "9876543215", Department = "Engineering", Designation = "Software Developer", Salary = 85000, JoinDate = new DateTime(2022, 2, 15), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 7, FirstName = "Arjun", LastName = "Singh", Email = "arjun.singh@example.com", Phone = "9876543216", Department = "Marketing", Designation = "Content Specialist", Salary = 60000, JoinDate = new DateTime(2021, 9, 1), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 8, FirstName = "Pooja", LastName = "Joshi", Email = "pooja.joshi@example.com", Phone = "9876543217", Department = "HR", Designation = "Recruiter", Salary = 55000, JoinDate = new DateTime(2022, 4, 10), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 9, FirstName = "Karan", LastName = "Mehta", Email = "karan.mehta@example.com", Phone = "9876543218", Department = "Finance", Designation = "Accountant", Salary = 62000, JoinDate = new DateTime(2020, 11, 5), Status = "Inactive", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 10, FirstName = "Anjali", LastName = "Desai", Email = "anjali.desai@example.com", Phone = "9876543219", Department = "Operations", Designation = "Operations Specialist", Salary = 58000, JoinDate = new DateTime(2021, 7, 20), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 11, FirstName = "Rohit", LastName = "Nair", Email = "rohit.nair@example.com", Phone = "9876543220", Department = "Engineering", Designation = "DevOps Engineer", Salary = 92000, JoinDate = new DateTime(2020, 9, 15), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 12, FirstName = "Kavya", LastName = "Reddy", Email = "kavya.reddy@example.com", Phone = "9876543221", Department = "Marketing", Designation = "Social Media Manager", Salary = 52000, JoinDate = new DateTime(2022, 1, 10), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 13, FirstName = "Suresh", LastName = "Iyer", Email = "suresh.iyer@example.com", Phone = "9876543222", Department = "Finance", Designation = "Senior Accountant", Salary = 78000, JoinDate = new DateTime(2019, 3, 20), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 14, FirstName = "Meena", LastName = "Pillai", Email = "meena.pillai@example.com", Phone = "9876543223", Department = "HR", Designation = "HR Manager", Salary = 72000, JoinDate = new DateTime(2018, 5, 15), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Employee { Id = 15, FirstName = "Deepak", LastName = "Chauhan", Email = "deepak.chauhan@example.com", Phone = "9876543224", Department = "Operations", Designation = "Quality Assurance", Salary = 64000, JoinDate = new DateTime(2021, 12, 1), Status = "Active", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            };
        }

        private static List<AppUser> GetSeedUsers()
        {
            return new List<AppUser>
            {
                new AppUser { Id = 1, Username = "admin", PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"), Role = "Admin", CreatedAt = DateTime.UtcNow },
                new AppUser { Id = 2, Username = "viewer", PasswordHash = BCrypt.Net.BCrypt.HashPassword("viewer123"), Role = "Viewer", CreatedAt = DateTime.UtcNow }
            };
        }
    }
}