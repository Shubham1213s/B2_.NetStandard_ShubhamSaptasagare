# Employee Management System - Mini Project 2

**Full-Stack HR Application with .NET 8 Web API, SQL Server 2022, and JWT Authentication**

## Candidate Details

- **Name:** Shubham Santram Saptasagare
- **Batch:** B2 .NET with Python

---



## **Project Structure**

```
EMS-MiniProject2/
├── EMS.API/                          ← .NET 8 Web API
│   ├── Controllers/
│   │   ├── EmployeesController.cs   ← CRUD + Dashboard endpoints
│   │   └── AuthController.cs        ← Register/Login endpoints
│   ├── Data/
│   │   └── AppDbContext.cs          ← EF Core DbContext + Seed Data
│   ├── DTOs/
│   │   └── EmployeeDtos.cs          ← Request/Response DTOs
│   ├── Models/
│   │   ├── Employee.cs              ← Employee entity (11 properties)
│   │   └── AppUser.cs               ← User entity (Admin/Viewer roles)
│   ├── Services/
│   │   ├── EmployeeService.cs       ← Business logic
│   │   ├── EmployeeRepository.cs    ← Data access (EF Core)
│   │   ├── IEmployeeRepository.cs   ← Repository interface
│   │   └── AuthService.cs           ← Auth + JWT + BCrypt
│   ├── Migrations/
│   │   └── 20260417035619_InitialCreate.cs  ← Database schema
│   ├── appsettings.json             ← Connection string + JWT config
│   ├── Program.cs                   ← DI Container + Middleware
│   └── EMS.API.csproj
│
├── EMS.Tests/                       ← NUnit Test Project
│   ├── AuthServiceTests.cs
│   ├── AuthControllerTests.cs
│   ├── EmployeeServiceTests.cs
│   └── EMS.Tests.csproj
│
├── Frontend/                    ← Updated Frontend from MP1
│   ├── index.html                   ← Login/Signup/Dashboard/Employee List
│   ├── css/
│   │   └── styles.css               ← Custom styles + pagination
│   └── js/
│       ├── config.js                ← API_BASE_URL + PAGE_SIZE (NEW)
│       ├── storageService.js        ← API calls + Bearer token (REPLACED)
│       ├── authService.js           ← JWT + /auth/* endpoints (UPDATED)
│       ├── employeeService.js       ← Async delegates (UPDATED)
│       ├── dashboardService.js      ← Single /dashboard API call (UPDATED)
│       ├── uiService.js             ← Pagination + Role-based UI (UPDATED)
│       ├── validationService.js     ← Field validation (UPDATED)
│       └── app.js                   ← Event handlers + Pagination state (UPDATED)
│
├── README.md                        ← This file
└── .gitignore
```

---

## Quick Start Guide (From Fresh Machine Setup)

Follow the steps in this order.

### 1) Install Required Software

- .NET 8 SDK: https://dotnet.microsoft.com/download
- SQL Server 2022 (or SQL Server Express)
- Visual Studio Community 2026 (with ASP.NET and web workload) or VS Code
- Node.js LTS (includes `npm`): https://nodejs.org/
- EF Core CLI tool:

```powershell
dotnet tool install --global dotnet-ef
```

If already installed, update it:

```powershell
dotnet tool update --global dotnet-ef
```

### 2) Clone/Open Project

Open the workspace:

```powershell
C:\Users\DELL\source\repos\EMS-MiniProject2
```

### 3) Configure Database Connection

Edit `EMS.API/appsettings.json` and set your SQL Server instance in `DefaultConnection`.

### 4) Restore Dependencies

From solution root:

```powershell
dotnet restore
```

For frontend dependencies:

```powershell
cd EMS.Frontend
npm install
cd ..
```

### 5) Create/Update Database (Important)

Before first API run, apply migrations.

**Option A (Visual Studio Package Manager Console):**
- Set default project to `EMS.API`
- Run:

```powershell
Update-Database
```

**Option B (CLI from `EMS.API` folder):**

```powershell
cd EMS.API
dotnet ef database update
cd ..
```

Both `Update-Database` and `dotnet ef database update` should work without errors.

### 6) Run Backend API

```powershell
cd EMS.API
dotnet run
```

API URLs:
- `http://localhost:5006`
- `https://localhost:7000`
- Swagger: `http://localhost:5006/swagger`

### 7) Run Frontend

**Option A: Live Server (Recommended for exam/demo)**
- Open `EMS.Frontend/index.html` in VS Code
- Right click → **Open with Live Server**

**Option B: `http-server`**

```powershell
cd EMS.Frontend
npx http-server -p 5500
```

Frontend URL:
- `http://localhost:5500`

### 8) Verification

- Run DB migration using `Update-Database`
- Start API using F5 or `dotnet run`
- Open frontend with Live Server
- Confirm login and employee APIs work

---

##  **Default Test Credentials**

| Username | Password | Role | Access Level |
|----------|----------|------|--------------|
| admin | admin123 | Admin | Full CRUD access |
| viewer | viewer123 | Viewer | Read-only access |


---

## **API Endpoints**

### **Authentication**
```
POST /api/auth/register       Register new user (defaults to Viewer role)
POST /api/auth/login          Authenticate user, returns JWT token
```

### **Employees (All require Authorization)**
```
GET    /api/employees                    Get paginated employee list with filters
GET    /api/employees/{id}               Get single employee by ID
GET    /api/employees/dashboard          Get dashboard KPIs (one API call)
POST   /api/employees                    Create employee (Admin only) — 201 Created
PUT    /api/employees/{id}               Update employee (Admin only) — 200 OK
DELETE /api/employees/{id}               Delete employee (Admin only) — 200 OK
```



---


---

## **Running Tests**

### **Backend Tests (NUnit + Moq)**

```powershell
# From workspace root
dotnet test EMS.Tests

# Or from EMS.Tests directory
cd EMS.Tests
dotnet test
```

**Test Coverage:**
- AuthServiceTests — Login, Register, BCrypt, JWT
- AuthControllerTests — HTTP status codes, error handling
- EmployeeServiceTests — CRUD, validation, filtering (with Moq)

### **Frontend Tests (Jest from MP1)**

MP1 Jest tests continue to pass because storageService interface is unchanged. Tests mock the storage layer, not the data source.

```bash
npm test
```

---

## **Configuration**

### **appsettings.json** (Backend)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=DESKTOP-CFNVE04\\SQLEXPRESS;Database=EMSDashboard;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKey_Min32Chars_ChangeThis!",
    "Issuer": "EMS.API",
    "Audience": "EMS.Client",
    "ExpiryHours": 8
  }
}
```

**Modify for your SQL Server instance:**
- Change `DESKTOP-CFNVE04\SQLEXPRESS` to your server name
- Optionally change the JWT Key (minimum 32 characters)

### **config.js** (Frontend)

```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:5006/api',    // .NET API endpoint
    PAGE_SIZE: 10,                                 // Employees per page
    TIMEOUT: 30000                                 // 30 seconds
};
```

Change `API_BASE_URL` if your backend runs on a different port.

---






