
$(document).ready(function(){

   $("#signupSection").hide();
   $("#loginSection").show();
   $("#dashboardSection").hide();
   $("#employeeSection").hide();
   $("#mainNavbar").hide();


   $("#goToSignup").click(function(){
      // clear old errors
      $(".error").text("");
      // ADD THESE - clear login fields
      $("#loginUsername").val("");
      $("#loginPassword").val("");
      $("#loginSection").hide();
      $("#signupSection").show();
   });

   $("#goToLogin").click(function(){
      // clear old errors
      $(".error").text("");
      $("#signupUsername").val("");
      $("#signupPassword").val("");
      $("#confirmPassword").val("")
      $("#signupSection").hide();
      $("#loginSection").show();
   });


   $("#signupBtn").click(function(){

      // clear old errors
      $(".error").text("");
      
      let username = $("#signupUsername").val();
      let password = $("#signupPassword").val();
      let confirmPassword = $("#confirmPassword").val();

      let errors = validationService.validateSignup(username, password, confirmPassword);

      if(Object.keys(errors).length > 0){

        if(errors.username) $("#usernameError").text(errors.username);
        if(errors.password) $("#passwordError").text(errors.password);
        if(errors.confirmPassword) $("#confirmpasswordError").text(errors.confirmPassword);

        return;
      }

        authService.signup(username, password);
        showToast("Signup Successful! Please Login");
         // redirect to login
        setTimeout(() => {
            $("#signupSection").hide();
            $("#loginSection").show();
         }, 1500);
   });


/* =========================
   LOGIN
========================= */

   $("#loginBtn").click(function(){
      
      // clear old errors
      $(".error").text("");

      let username = $("#loginUsername").val().trim();
      let password = $("#loginPassword").val().trim();

      // Validate
      let errors = validationService.validateLogin(username, password);

      if (errors.username) {
         $("#loginUsernameError").text(errors.username);
      }

      if (errors.password) {
         $("#loginPasswordError").text(errors.password);
      }

      if (Object.keys(errors).length > 0){
         return;

      } 

      let result = authService.login(username,password);

      if(result){
         $("#loggedInUser").text(username);
         $("#loginSection").hide();
         $("#dashboardSection").show();
         $("#mainNavbar").show();
         loadDashboard();
      }else{
         alert("Invalid username or password");
      }
   });


/* =========================
   NAVIGATION
========================= */

   $("#navDashboard").click(function(){
      
      $("#employeeSection").hide();
      $("#dashboardSection").show();
      loadDashboard();
   });
   
   $("#navEmployees").click(function(){
      $("#dashboardSection").hide();
      $("#employeeSection").show();
      loadEmployees();
   });


/* =========================
   LOGOUT
========================= */

   $("#logoutBtn").click(function(){
      
      authService.logout();

      $("#loggedInUser").text("");   
    
      $("#loginUsername").val("");
      $("#loginPassword").val("");

      $("#mainNavbar").hide();
      $("#dashboardSection").hide();
      $("#employeeSection").hide();
      $("#loginSection").show();
   
   });


/* =========================
   LOAD EMPLOYEES
========================= */

function loadEmployees(){
   let employees = employeeService.getAll();
   uiService.renderEmployeeTable(employees);
}


/* =========================
   Load Dashboard with Services
========================= */
function loadDashboard(){
   let summary = dashboardService.getSummary();
   uiService.renderDashboardCards(summary);
   
   let breakdown = dashboardService.getDepartmentBreakdown();
   uiService.renderDepartmentBreakdown(breakdown);
   
   let recent = dashboardService.getRecentEmployees(5);
   uiService.renderRecentEmployees(recent);

}

/* =========================
   Departments in Filter
========================= */

loadDepartments();

function loadDepartments(){

   $("#departmentFilter")
      .empty()
      .append('<option value="">All Departments</option>');

   
   let departments = employeeService.getDepartments();
   departments.forEach(dept => {
      $("#departmentFilter").append(
         `<option value="${dept}">${dept}</option>`
      );
   });

}

/* =========================
   FILTER & SORTING
========================= */

$("#searchInput, #departmentFilter, input[name='statusFilter']").on("input change", function(){
   applyFilters();
});


function applyFilters(){

   let query = $("#searchInput").val();
   let department = $("#departmentFilter").val();
   let status = $("input[name='statusFilter']:checked").val();
   let results = employeeService.applyFilters(
      query,
      department,
      status,
      sortField,
      sortDirection
   );

   if(results.length === 0){
      $("#employeeTableBody")
         .html(`
            <tr>
            <td colspan="9" class="text-center text-muted">No employees found</td>
            </tr>
         `);   
         
      return;
   }
   
   uiService.renderEmployeeTable(results);
   

}

let sortField = "";
let sortDirection = "asc";

$("#sortName").click(function(){
   sortField = "name";
   sortDirection = sortDirection === "asc" ? "desc" : "asc";
   applyFilters();

});

$("#sortSalary").click(function(){
   sortField = "salary";
   sortDirection = sortDirection === "asc" ? "desc" : "asc";
   applyFilters();

});

$("#sortDate").click(function(){
   sortField = "date";
   sortDirection = sortDirection === "asc" ? "desc" : "asc";
   applyFilters();

});


/* =========================
   EMPLOYEE MODAL (ADD/EDIT)
========================= */

//add employee button
$("#addEmployeeBtn").click(function(){
   
   $("#employeeForm")[0].reset();
   $("#employeeId").val("");
   
   $(this).blur();
   
   setTimeout(() => {
      uiService.showModal("add");
   }, 10);
   

});   


// handle edit button click
$(document).on("click", ".editBtn", function(){

   document.querySelectorAll('.modal.show').forEach(modalEl => {
      let modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();
   });
   
   let id = Number($(this).data("id"));
   let emp = employeeService.getById(id);
   
   $(this).blur();

   // modal.show();

   setTimeout(() => {
      uiService.showModal("edit", emp);
   }, 10);

});


/* =========================
   SAVE EMPLOYEE 
========================= */

// save employee (add or update)

$("#saveEmployeeBtn").click(function(){
   
   let id = $("#employeeId").val();
   
   let data = {
      firstName:$("#firstName").val(),
      lastName:$("#lastName").val(),
      email:$("#email").val(),
      phone:$("#phone").val(),
      department:$("#department").val(),
      designation:$("#designation").val(),
      salary:Number($("#salary").val()),
      joinDate:$("#joinDate").val(),
      status:$("#status").val()
   };

   // VALIDATION
   let errors = validationService.validateEmployee(data);
   if(Object.keys(errors).length > 0){
      uiService.showInlineErrors(errors);
      return;
   }

   //clear error
   $(".error").remove();
   
   // CHECK: ADD OR UPDATE
   if(id){
      // UPDATE 
      employeeService.update(Number(id), data);
      showToast("Employee updated successfully!");
   }else{
      // ADD
      employeeService.add(data);
      showToast("Employee added successfully!");
   }

   $("#searchInput").val("");
   $("#departmentFilter").val("");
   $("#statusFilter").val("");

   // Refresh UI
   applyFilters();
   
   loadDashboard();

   //close modal
   bootstrap.Modal.getInstance(
   document.getElementById("employeeModal")
   ).hide();

});


//view employee details

$(document).on("click", ".viewBtn", function(){
   
   document.querySelectorAll('.modal.show').forEach(modalEl => {
    let modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
   });

   let id = Number($(this).data("id"));
   let emp = employeeService.getById(id);
   uiService.renderViewEmployee(emp);

   $(this).blur();

   setTimeout(() => {
      uiService.showModal("view", emp);
   }, 10);
   
});


// handle delete button click

let deleteId = null;

$(document).on("click", ".deleteBtn", function(){
      
   // close any open modal
   document.querySelectorAll('.modal.show').forEach(modalEl => {
      let instance = bootstrap.Modal.getInstance(modalEl);
      if(instance) instance.hide();
   });
   
   deleteId = Number($(this).data("id"));
   let emp = employeeService.getById(deleteId);
   // show name in message
   $("#deleteMessage").text(
   `Are you sure you want to delete ${emp.firstName} ${emp.lastName}?`
   );

   // open modal
   let modal = new bootstrap.Modal(
   document.getElementById("deleteModal")
   );

   modal.show();  

});

// handle confirm delete

$("#confirmDeleteBtn").click(function(){

if(deleteId !== null){
   employeeService.remove(deleteId);

   showToast("Employee Deleted Successfully");

   // reset filters
   $("#searchInput").val("");
   $("#departmentFilter").val("");
   $("#statusAll").prop("checked", true);
   

   // refresh UI
   applyFilters();
   loadDashboard();

   // close modal
   bootstrap.Modal.getInstance(
   document.getElementById("deleteModal")
   ).hide();

   deleteId = null;
   }

});

function showToast(message){
   
   $("#toastMessage").text(message);
   let toast = new bootstrap.Toast(
      document.getElementById("liveToast"), {
         delay: 1000
      });
      
   toast.show();

}


$(document).on("hidden.bs.modal", ".modal", function () {
   
   $('.modal-backdrop').remove();
   $('body').removeClass('modal-open');
   
   // Remove focus from any element inside the closed modal
   $(this).find(':focus').blur();
   
   // Return focus safely to body
   setTimeout(() => { $('body').trigger('focus'); }, 0);
});

})





