//================
//  UI Service
//================

const uiService = {

/**
 * Formats salary value for display.
 */
formatSalary: function(salary) {
    if (!salary && salary !== 0) return '0.00';
    return parseFloat(salary).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
},

/**
 * Renders employee table and pagination details.
 */
renderEmployeeTable: function(pagedResult) {
    // Extract data from paged result
    const employees = pagedResult.data || [];
    const page = pagedResult.page || 1;
    const pageSize = pagedResult.pageSize || employees.length || 0;
    const totalCount = pagedResult.totalCount || 0;
    const totalPages = pagedResult.totalPages || 1;
    const hasNextPage = pagedResult.hasNextPage || false;
    const hasPrevPage = pagedResult.hasPrevPage || false;

    const start = totalCount === 0 ? 0 : ((page - 1) * pageSize) + 1;
    const end = totalCount === 0 ? 0 : Math.min(page * pageSize, totalCount);
    $("#employeeCountLabel").text(`Showing ${start}-${end} of ${totalCount} records`);

    let rows = "";
    employees.forEach(emp => {
        const editDeleteButtons = authService.getCurrentRole() === 'Admin' ? `
            <button class="btn btn-sm btn-warning editBtn" data-id="${emp.id}">
                <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger deleteBtn" data-id="${emp.id}">
                <i class="bi bi-trash"></i>
            </button>
        ` : '';

        rows += 
        `<tr>
        <td>${emp.id}</td>
        <td>${emp.firstName} ${emp.lastName}</td>
        <td>${emp.email}</td>
        <td>${emp.department}</td>
        <td>${emp.designation}</td>
        <td>₹${emp.salary.toLocaleString()}</td>
        <td>${new Date(emp.joinDate).toLocaleDateString()}</td>
        <td>
           <span class="badge ${emp.status === "Active" ? "bg-success" : "bg-danger"}"> ${emp.status}</span>
        </td>
        <td>
            <button class="btn btn-sm btn-info viewBtn" data-id="${emp.id}">
                <i class="bi bi-eye"></i>
            </button>
            ${editDeleteButtons}
        </td>
        </tr>`;
    });

    $("#employeeTableBody").html(rows);

    // Render pagination
    this.renderPagination(page, totalPages, hasNextPage, hasPrevPage);
},

/**
 * Renders pagination bar.
 */
renderPagination: function(page, totalPages, hasNextPage, hasPrevPage) {
    let paginationHtml = `<nav aria-label="Page navigation"><ul class="pagination justify-content-center">`;

    // Previous button
    if (hasPrevPage) {
        paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${page - 1}">Previous</a></li>`;
    } else {
        paginationHtml += `<li class="page-item disabled"><span class="page-link">Previous</span></li>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === page) {
            paginationHtml += `<li class="page-item active"><span class="page-link">${i}</span></li>`;
        } else {
            paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
    }

    // Next button
    if (hasNextPage) {
        paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${page + 1}">Next</a></li>`;
    } else {
        paginationHtml += `<li class="page-item disabled"><span class="page-link">Next</span></li>`;
    }

    paginationHtml += `</ul></nav>`;

    $("#paginationContainer").html(paginationHtml);
},


/**
 * Applies role-based UI visibility and labels.
 */
applyRoleUI: function(role) {
    // Update role badge
    if (role === 'Admin') {
        $("#roleBadge").removeClass('bg-secondary').addClass('bg-danger').text('Admin');
        $("#employeeSectionSubtitle").text('Manage your workforce — view, search, filter, and review employee records.');
        $("#addEmployeeBtn").show();
        $("#employeeSectionSubtitle").show();
        $("#readOnlyNotice").hide();
    } else {
        $("#roleBadge").removeClass('bg-danger').addClass('bg-secondary').text('Viewer');
        $("#employeeSectionSubtitle").text('You have view-only access. You can view employee records but cannot add, edit, or delete employees.');
        $("#addEmployeeBtn").hide();
        $("#employeeSectionSubtitle").show();
        $("#readOnlyNotice").show();
    }
},


/**
 * Renders employee details view modal content.
 */
renderViewEmployee: function(emp) {

    let statusBadge = emp.status === "Active" 
        ? `<span class="badge bg-success px-3 py-2"><i class="bi bi-check-circle me-1"></i>Active</span>` 
        : `<span class="badge bg-danger px-3 py-2"><i class="bi bi-x-circle me-1"></i>Inactive</span>`;

    let departmentIcon = this.getDepartmentIcon(emp.department);
    let departmentBadgeClass = this.getDepartmentBadgeClass(emp.department);

    let html = `
        <div class="employee-details-container">

            <!-- Employee Header Section -->
            <div class="employee-header-section mb-4">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="employee-avatar bg-info text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                            <i class="bi bi-person-fill fs-4"></i>
                        </div>
                        <div>
                            <h5 class="mb-0 fw-bold">${emp.firstName} ${emp.lastName}</h5>
                            <small class="text-muted"><i class="bi bi-briefcase me-1"></i>${emp.designation}</small>
                        </div>
                    </div>
                    <div>${statusBadge}</div>
                </div>
            </div>

            <hr class="my-3">

            <!-- Details Grid - Professional Layout -->
            <div class="details-grid">

                <!-- Row 1: Email & Phone -->
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <div class="detail-field">
                            <label class="detail-label"><i class="bi bi-envelope-fill text-primary me-2"></i>Email</label>
                            <div class="detail-value">${emp.email}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="detail-field">
                            <label class="detail-label"><i class="bi bi-telephone-fill text-primary me-2"></i>Phone</label>
                            <div class="detail-value">${emp.phone}</div>
                        </div>
                    </div>
                </div>

                <!-- Row 2: Department & Designation -->
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <div class="detail-field">
                            <label class="detail-label"><i class="bi bi-building text-primary me-2"></i>Department</label>
                            <div class="detail-value">
                                <span class="badge ${departmentBadgeClass}" style="font-size: 0.85rem; padding: 0.4rem 0.8rem;">
                                    ${departmentIcon} ${emp.department}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="detail-field">
                            <label class="detail-label"><i class="bi bi-star-fill text-primary me-2"></i>Designation</label>
                            <div class="detail-value">${emp.designation}</div>
                        </div>
                    </div>
                </div>

                <!-- Row 3: Salary & Join Date -->
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="detail-field">
                            <label class="detail-label"><i class="bi bi-cash-coin text-primary me-2"></i>Salary</label>
                            <div class="detail-value salary-highlight">₹${emp.salary.toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="detail-field">
                            <label class="detail-label"><i class="bi bi-calendar3 text-primary me-2"></i>Join Date</label>
                            <div class="detail-value">${new Date(emp.joinDate).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    `;

    $("#viewEmployeeBody").html(html);
},

getDepartmentIcon: function(dept) {
    const icons = {
        'Engineering': '<i class="bi bi-gear"></i>',
        'Marketing': '<i class="bi bi-megaphone"></i>',
        'HR': '<i class="bi bi-people"></i>',
        'Finance': '<i class="bi bi-graph-up"></i>',
        'Operations': '<i class="bi bi-arrow-repeat"></i>'
    };
    return icons[dept] || '<i class="bi bi-building"></i>';
},

getDepartmentBadgeClass: function(dept) {
    const classes = {
        'Engineering': 'bg-info',
        'Marketing': 'bg-warning text-dark',
        'HR': 'bg-success',
        'Finance': 'bg-primary',
        'Operations': 'bg-secondary'
    };
    return classes[dept] || 'bg-secondary';
},

//================
//  Dashboard Rendering
//================

renderDashboardCards: function(data) {
    let html = 
    `<div class="col-lg-3 col-md-6 col-sm-12">
        <div class="card kpi-card kpi-border-blue mb-3 border-0 rounded-4" id="totalEmployeesCard">
            <div class="card-body d-flex align-items-center gap-3 ps-3">
                <div class="kpi-icon-box kpi-icon-blue">
                    <i class="bi bi-people-fill"></i>
                </div>
                <div class="d-flex flex-column text-start">
                    <span class="kpi-label">Total Employees</span>
                    <span class="kpi-value">${data.totalEmployees}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="card kpi-card kpi-border-green mb-3 border-0 rounded-4" id="activeEmployeesCard">
            <div class="card-body d-flex align-items-center gap-3 ps-3">
                <div class="kpi-icon-box kpi-icon-green">
                    <i class="bi bi-person-check-fill"></i>
                </div>
                <div class="d-flex flex-column text-start">
                    <span class="kpi-label">Active Employees</span>
                    <span class="kpi-value">${data.activeCount}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="card kpi-card kpi-border-red mb-3 border-0 rounded-4" id="inactiveEmployeesCard">
            <div class="card-body d-flex align-items-center gap-3 ps-3">
                <div class="kpi-icon-box kpi-icon-red">
                    <i class="bi bi-person-x-fill"></i>
                </div>
                <div class="d-flex flex-column text-start">
                    <span class="kpi-label">Inactive Employees</span>
                    <span class="kpi-value">${data.inactiveCount}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="card kpi-card kpi-border-violet mb-3 border-0 rounded-4" id="averageSalaryCard">
            <div class="card-body d-flex align-items-center gap-3 ps-3">
                <div class="kpi-icon-box kpi-icon-violet">
                    <i class="bi bi-cash-coin"></i>
                </div>
                <div class="d-flex flex-column text-start">
                    <span class="kpi-label">Avg Salary</span>
                    <span class="kpi-value kpi-salary">₹${this.formatSalary(data.averageSalary)}</span>
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

    let icons = {
        Engineering: "bi-gear",
        Marketing: "bi-megaphone",
        HR: "bi-people",
        Finance: "bi-graph-up",
        Operations: "bi-arrow-repeat"
    };

    let rows = "";

    for(let dept in data){

        let count = data[dept];
        let percent = Math.round((count / total) * 100);
        let icon = icons[dept] || "bi-building";

        rows += `
        <tr class="dept-row-hover">
            <td>
                <span class="badge ${colors[dept] || "bg-dark"} px-3 py-2">
                    <i class="bi ${icon} me-1"></i>${dept}
                </span>
            </td>

            <td><strong>${count}</strong></td>

            <td style="width: 50%;">
                <div class="progress dept-progress" style="height: 10px;">
                    <div class="progress-bar progress-bar-animated ${colors[dept] || "bg-dark"}"
                         style="width: ${percent}%; transition: width 0.6s ease;">
                    </div>
                </div>
            </td>

            <td><strong>${percent}%</strong></td>
        </tr>`;
    }

    $("#deptTableBody").html(rows);
},

renderRecentEmployees:function(employees){

    // Department color mapping - same as department breakdown
    let colors = {
        Engineering: "bg-primary",
        Marketing: "bg-dept-marketing",
        HR: "bg-info",
        Finance: "bg-success",
        Operations: "bg-secondary"
    };

    let icons = {
        Engineering: "bi-gear",
        Marketing: "bi-megaphone",
        HR: "bi-people",
        Finance: "bi-graph-up",
        Operations: "bi-arrow-repeat"
    };

    let avatarColors = [
        "recent-avatar-blue",
        "recent-avatar-green",
        "recent-avatar-teal",
        "recent-avatar-purple",
        "recent-avatar-orange"
    ];

    let html = `<div class="recent-emp-list">`;

    employees.forEach((emp, index) => {
        let deptIcon = icons[emp.department] || "bi-building";
        let joinDate = new Date(emp.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        let avatarColor = avatarColors[index % avatarColors.length];
        let initials = emp.firstName.charAt(0).toUpperCase() + emp.lastName.charAt(0).toUpperCase();
        let isActive = emp.status === "Active";

        html += `
        <div class="recent-emp-item" style="animation-delay: ${index * 80}ms;">
            <div class="recent-emp-avatar ${avatarColor}">${initials}</div>
            <div class="recent-emp-info">
                <div class="recent-emp-name">${emp.firstName} ${emp.lastName}</div>
                <div class="recent-emp-role">${emp.designation}</div>
                <div class="recent-emp-meta">
                    <span class="recent-dept-badge ${colors[emp.department] || 'bg-secondary'}">
                        <i class="bi ${deptIcon}"></i> ${emp.department}
                    </span>
                </div>
            </div>
            <div class="recent-emp-status">
                <span class="recent-join-badge">
                    <i class="bi bi-calendar2-check"></i> ${joinDate}
                </span>
                <span class="recent-status-badge ${isActive ? 'status-badge-active' : 'status-badge-inactive'}">
                    <span class="recent-status-dot ${isActive ? 'status-active' : 'status-inactive'}"></span>
                    ${emp.status}
                </span>
            </div>
        </div>`;
    });

    html += `</div>`;

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


/**
 * Displays inline form validation errors.
 */
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