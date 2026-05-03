//================
//  UI Service
//================

const uiService = {

renderEmployeeTable:function(employees){
    let rows = "";
    employees.forEach(emp => {
        rows += 
        `<tr>
        <td>${emp.id}</td>
        <td>${emp.firstName} ${emp.lastName}</td>
        <td>${emp.email}</td>
        <td>${emp.department}</td>
        <td>${emp.designation}</td>
        <td>₹${emp.salary.toLocaleString()}</td>
        <td>${emp.joinDate}</td>
        <td>
           <span class="badge ${emp.status === "Active" ? "bg-success" : "bg-danger"}"> ${emp.status}</span>
        </td>
        
        <td>

        <button class="btn btn-sm btn-info viewBtn" data-id="${emp.id}">
        <i class="bi bi-eye"></i>
        </button>

        <button class="btn btn-sm btn-warning editBtn" data-id="${emp.id}">
        <i class="bi bi-pencil"></i>
        </button>

        <button class="btn btn-sm btn-danger deleteBtn" data-id="${emp.id}">
        <i class="bi bi-trash"></i>
        </button>

        </td>

        </tr>
    `;

});

$("#employeeTableBody").html(rows);

},


renderViewEmployee: function(emp) {

    let statusBadge = emp.status === "Active" 
        ? `<span class="badge bg-success px-3 py-2">Active</span>` 
        : `<span class="badge bg-danger px-3 py-2">Inactive</span>`;

    let html = `
        <div class="container-fluid">

            <!-- Name Header -->
            <div class="text-center mb-3">
                <h5 class="fw-bold mb-0">${emp.firstName} ${emp.lastName}</h5>
                <small class="text-muted">${emp.designation}</small>
            </div>

            <hr>

            <!-- Details -->
            <div class="row g-3">

                <div class="col-6">
                    <small class="text-muted">Email</small>
                    <div class="fw-semibold">${emp.email}</div>
                </div>

                <div class="col-6">
                    <small class="text-muted">Phone</small>
                    <div class="fw-semibold">${emp.phone}</div>
                </div>

                <div class="col-6">
                    <small class="text-muted">Department</small>
                    <div class="fw-semibold">${emp.department}</div>
                </div>

                <div class="col-6">
                    <small class="text-muted">Salary</small>
                    <div class="fw-semibold">₹${emp.salary.toLocaleString()}</div>
                </div>

                <div class="col-6">
                    <small class="text-muted">Join Date</small>
                    <div class="fw-semibold">${emp.joinDate}</div>
                </div>

                <div class="col-6">
                    <small class="text-muted">Status</small>
                    <div>${statusBadge}</div>
                </div>

            </div>

        </div>
    `;

    $("#viewEmployeeBody").html(html);
},

renderDashboardCards:function(data){

let html = 
    `<div class="col-lg-3 col-md-6 col-sm-12">
        <div class="card text-bg-primary mb-3 p-3 border-0 rounded-4" id="totalEmployeesCard">
            <div class="card-body d-flex align-items-center gap-3">
                <i class="bi bi-people-fill fs-1"></i>
                <div class="d-flex flex-column">
                    <span class="fs-5 fw-bold">Total Employees</span>
                    <span class="fs-4 fw-bold text-center">${data.total}</span>
                </div>
                
            </div>
        </div>
    </div>

    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="card text-bg-success mb-3 p-3 border-0 rounded-4" id="activeEmployeesCard">
            <div class="card-body d-flex align-items-center gap-3">
                <i class="bi bi-person-check-fill fs-1"></i>
                <div class="d-flex flex-column">
                    <span class="fs-5 fw-bold">Active Employees</span>
                    <span class="fs-4 fw-bold text-center">${data.active}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="card text-bg-danger mb-3 p-3 border-0 rounded-4" id="inactiveEmployeesCard">
            <div class="card-body d-flex align-items-center gap-3">
                <i class="bi bi-person-x-fill fs-1"></i>
                <div class="d-flex flex-column">
                    <span class="fs-5 fw-bold">Inactive Employees</span>
                    <span class="fs-4 fw-bold text-center">${data.inactive}</span>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="card text-bg-warning mb-3 p-3 border-0 rounded-4" id="departmentsCard">
            <div class="card-body d-flex align-items-center gap-3">
                <i class="bi bi-building fs-1"></i>
                <div class="d-flex flex-column">
                    <span class="fs-5 fw-bold">Departments</span>
                    <span class="fs-4 fw-bold text-center">${data.departments}</span>
                </div>
            </div>
        </div>
    </div>`;
    
    $("#dashboardCards").html(html);

},


renderDepartmentBreakdown:function(data){

    let total = Object.values(data).reduce((a,b)=> a+b, 0);

    let colors = {
        Engineering: "bg-primary",
        Marketing: "bg-dept-marketing",
        HR: "bg-info",
        Finance: "bg-success",
        Operations: "bg-secondary"
    };

    let rows = "";

    for(let dept in data){

        let count = data[dept];
        let percent = Math.round((count / total) * 100);

        rows += `
        <tr>
            <td>
                <span class="badge ${colors[dept] || "bg-dark"} px-3 py-2">
                    ${dept}
                </span>
            </td>

            <td><strong>${count}</strong></td>

            <td style="width: 50%;">
                <div class="progress" style="height: 8px;">
                    <div class="progress-bar ${colors[dept] || "bg-dark"}"
                         style="width: ${percent}%">
                    </div>
                </div>
            </td>

            <td><strong>${percent}%</strong></td>
        </tr>`;
    }

    $("#deptTableBody").html(rows);
},

renderRecentEmployees:function(employees){

    let html = `<ul class="list-group">`;

    employees.forEach(emp => {

        html += `
        <li class="list-group-item d-flex justify-content-between align-items-center">

            <div>
                <strong>${emp.firstName} ${emp.lastName}</strong><br>
                <small class="text-muted">${emp.designation}</small>
            </div>

            <div class="text-end">
                <span class="badge bg-info me-2">${emp.department}</span>
                <span class="badge ${emp.status === "Active" ? "bg-success" : "bg-danger"}">
                    ${emp.status}
                </span>
            </div>

        </li>`;
    });

    html += `</ul>`;

    $("#recentEmployees").html(html);
},

//===============
//  Model Related
//==================
showModal:function(type, data){

if(type === "add"){
    $("#modalTitle").text("Add Employee");
    $("#saveEmployeeBtn").text("Save Employee");
}

if(type === "edit"){
    $("#modalTitle").text("Edit Employee");
    $("#saveEmployeeBtn").text("Update Employee");
    this.populateForm(data);
}

if(type === "view"){
    this.renderViewEmployee(data);
    let modal = new bootstrap.Modal(document.getElementById("viewEmployeeModal"));
    modal.show();
    return;
}

// open add/edit modal
let modal = new bootstrap.Modal(document.getElementById("employeeModal"));
modal.show();

},

populateForm:function(emp){

    $("#employeeId").val(emp.id);
    $("#firstName").val(emp.firstName);
    $("#lastName").val(emp.lastName);
    $("#email").val(emp.email);
    $("#phone").val(emp.phone);
    $("#department").val(emp.department);
    $("#designation").val(emp.designation);
    $("#salary").val(emp.salary);
    $("#joinDate").val(emp.joinDate);
    $("#status").val(emp.status);

},


showInlineErrors:function(errors){
    
    $(".error").remove(); // clear old errors
    
    for(let key in errors){
        $(`#${key}`).after(`<div class="text-danger error">${errors[key]}</div>`);
    }

    },
};

// For Jest (Node)
if (typeof module !== "undefined" && module.exports) {
    module.exports = uiService;
}

// For Browser
if (typeof window !== "undefined") {
    window.uiService = uiService;
}