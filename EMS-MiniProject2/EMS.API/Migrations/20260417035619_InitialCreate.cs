using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EMS.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Department = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Salary = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    JoinDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "Id", "CreatedAt", "Department", "Designation", "Email", "FirstName", "JoinDate", "LastName", "Phone", "Salary", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1266), "Engineering", "Senior Developer", "john.doe@example.com", "John", new DateTime(2021, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Doe", "9876543210", 95000m, "Active", new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1347) },
                    { 2, new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1372), "Marketing", "Marketing Manager", "jane.smith@example.com", "Jane", new DateTime(2020, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Smith", "9876543211", 75000m, "Active", new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1373) },
                    { 3, new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1390), "HR", "HR Specialist", "michael.johnson@example.com", "Michael", new DateTime(2019, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Johnson", "9876543212", 65000m, "Active", new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1391) },
                    { 4, new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1399), "Finance", "Finance Analyst", "sarah.williams@example.com", "Sarah", new DateTime(2021, 1, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Williams", "9876543213", 70000m, "Active", new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1401) },
                    { 5, new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1409), "Operations", "Operations Manager", "david.brown@example.com", "David", new DateTime(2020, 6, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Brown", "9876543214", 80000m, "Active", new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1410) },
                    { 6, new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1425), "Engineering", "Software Developer", "emily.davis@example.com", "Emily", new DateTime(2022, 2, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Davis", "9876543215", 85000m, "Active", new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1426) },
                    { 7, new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1433), "Marketing", "Content Specialist", "robert.miller@example.com", "Robert", new DateTime(2021, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Miller", "9876543216", 60000m, "Active", new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1435) },
                    { 8, new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1442), "HR", "Recruiter", "jessica.taylor@example.com", "Jessica", new DateTime(2022, 4, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Taylor", "9876543217", 55000m, "Active", new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1443) },
                    { 9, new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1451), "Finance", "Accountant", "christopher.anderson@example.com", "Christopher", new DateTime(2020, 11, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Anderson", "9876543218", 62000m, "Inactive", new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1452) },
                    { 10, new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1463), "Operations", "Operations Specialist", "jennifer.thomas@example.com", "Jennifer", new DateTime(2021, 7, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Thomas", "9876543219", 58000m, "Active", new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1465) },
                    { 11, new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1473), "Engineering", "DevOps Engineer", "daniel.jackson@example.com", "Daniel", new DateTime(2020, 9, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Jackson", "9876543220", 92000m, "Active", new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1474) },
                    { 12, new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1482), "Marketing", "Social Media Manager", "lisa.white@example.com", "Lisa", new DateTime(2022, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "White", "9876543221", 52000m, "Active", new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1484) },
                    { 13, new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1511), "Finance", "Senior Accountant", "mark.harris@example.com", "Mark", new DateTime(2019, 3, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Harris", "9876543222", 78000m, "Active", new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1513) },
                    { 14, new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1521), "HR", "HR Manager", "amanda.martin@example.com", "Amanda", new DateTime(2018, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Martin", "9876543223", 72000m, "Active", new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1523) },
                    { 15, new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1531), "Operations", "Quality Assurance", "steven.thompson@example.com", "Steven", new DateTime(2021, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Thompson", "9876543224", 64000m, "Active", new DateTime(2026, 4, 17, 3, 56, 17, 616, DateTimeKind.Utc).AddTicks(1533) }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "PasswordHash", "Role", "Username" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 17, 3, 56, 17, 885, DateTimeKind.Utc).AddTicks(2031), "$2a$11$ww6BxxZbpUtwDS8r9pdI5OSyud08jUB26HL1TvPaXp3cSgWdUVxVm", "Admin", "admin" },
                    { 2, new DateTime(2026, 4, 17, 3, 56, 18, 83, DateTimeKind.Utc).AddTicks(6066), "$2a$11$o3hynhG9XurO/yYvSIg6NOzk11wsQmw6vRy7PVWy1gQeUEInHkxpK", "Viewer", "viewer" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Employees_Email",
                table: "Employees",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
