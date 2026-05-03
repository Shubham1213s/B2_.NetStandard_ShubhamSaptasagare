
$(document).ready(function(){

   $("#signupSection").hide();
   $("#loginSection").show();
   $("#dashboardSection").hide();
   $("#employeeSection").hide();
   $("#mainNavbar").hide();

   // Apply role-based UI if user is already logged in (page refresh)
   if (authService.isLoggedIn()) {
      uiService.applyRoleUI(authService.getCurrentRole());
   }


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


   $("#signupBtn").click(async function(){

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

      // Show loading spinner
      spinnerService.show("Creating account...");

      try {
          // Call API
          const result = await authService.signup(username, password);
          spinnerService.hide();

          if (result.success) {
             showToast("Signup Successful! Welcome Admin", 'success', 'bottom-right');
             // redirect to dashboard
             setTimeout(async () => {
                 $("#signupSection").hide();
                 $("#employeeSection").hide();
                 $("#dashboardSection").show();
                 $("#mainNavbar").show();
                 $("#loggedInUser").text(username);

                 // Set Dashboard as active by default
                 $("#navDashboard").addClass("active");
                 $("#navEmployees").removeClass("active");

                 uiService.applyRoleUI(authService.getCurrentRole()); // Apply role-based UI
                 await loadDashboard();
              }, 1000);
          } else {
             showToast(result.error || "Signup failed", "error", 'top-right');
          }
      } catch (error) {
          spinnerService.hide();
          showToast("Signup error: " + error.message, "error", 'top-right');
      }
   });


/* =========================
   LOGIN
========================= */

   $("#loginBtn").click(async function(){

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

      // Show loading spinner
      spinnerService.show("Logging in...");

      try {
          // Call API
          const result = await authService.login(username, password);
          spinnerService.hide();

          if (result.success) {
             showToast("Login successful!", 'success', 'bottom-right');
             $("#loggedInUser").text(username);
             $("#loginSection").hide();
             $("#employeeSection").hide();
             $("#dashboardSection").show();
             $("#mainNavbar").show();

             // Set Dashboard as active by default
             $("#navDashboard").addClass("active");
             $("#navEmployees").removeClass("active");

             uiService.applyRoleUI(authService.getCurrentRole()); // Apply role-based UI
             await loadDashboard();
          } else {
             showToast(result.error || "Invalid username or password", "error", 'top-right');
          }
      } catch (error) {
          spinnerService.hide();
          showToast("Login error: " + error.message, "error", 'top-right');
      }
   });


/* =========================
    NAVIGATION
========================= */

    $("#navDashboard").click(async function(){
       // Update active state
       $("#navDashboard").addClass("active");
       $("#navEmployees").removeClass("active");

       $("#employeeSection").hide();
       $("#dashboardSection").show();
       await loadDashboard();
    });

    $("#navEmployees").click(async function(){
       // Update active state
       $("#navEmployees").addClass("active");
       $("#navDashboard").removeClass("active");

       $("#dashboardSection").hide();
       $("#employeeSection").show();
       await loadEmployees();
    });


/* =========================
   LOGOUT
========================= */

    $("#logoutBtn").click(function(){

       authService.logout();

       $("#loggedInUser").text("");
       $("#roleBadge").text("");   
       $("#readOnlyNotice").hide();  // Hide read-only notice on logout

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

    async function loadEmployees(){
       spinnerService.show("Loading employees...");
       try {
          let result = await employeeService.getAll(1, 10, '', '', '', 'name', 'asc');
          uiService.renderEmployeeTable(result);
       } catch (error) {
          showToast('Failed to load employees: ' + error.message, 'error');
       } finally {
          spinnerService.hide();
       }
    }


    /* =========================
        Load Dashboard with Services
    ========================= */
    async function loadDashboard(){
       spinnerService.show("Loading dashboard...");
       try {
          let summary = await dashboardService.getSummary();
          uiService.renderDashboardCards(summary);

          let breakdown = await dashboardService.getDepartmentBreakdown();
          uiService.renderDepartmentBreakdown(breakdown);

          let recent = await dashboardService.getRecentEmployees(5);
          uiService.renderRecentEmployees(recent);
       } catch (error) {
          showToast('Failed to load dashboard: ' + error.message, 'error');
       } finally {
          spinnerService.hide();
       }

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

$("#searchInput").on("input", function(){
   currentPage = 1;
   clearTimeout(searchDebounceTimer);
   searchDebounceTimer = setTimeout(function() {
      applyFilters();
   }, 300);
});

$("#departmentFilter, input[name='statusFilter']").on("change", function(){
   currentPage = 1;
   applyFilters();
});


async function applyFilters(){

   let query = $("#searchInput").val();
   let department = $("#departmentFilter").val();
   let status = $("input[name='statusFilter']:checked").val();

   // Store current filters
   currentFilters = {
      search: query,
      department: department,
      status: status
   };

   spinnerService.show("Filtering employees...");

   try {
      let result = await employeeService.getAll(
         currentPage,
         10,
         query,
         department,
         status,
         sortField || 'name',
         sortDirection
      );

      if(!result || !result.data || result.data.length === 0){
         $("#employeeTableBody")
            .html(`
               <tr>
               <td colspan="9" class="text-center text-muted">No employees found</td>
               </tr>
            `);
          $("#employeeCountLabel").text("Showing 0-0 of 0 records");
         $("#paginationContainer").html('');
         spinnerService.hide();
         return;
      }

      uiService.renderEmployeeTable(result);
   } catch (error) {
      console.error('Error applying filters:', error);
      showToast('Failed to apply filters: ' + error.message, 'error');
   } finally {
      spinnerService.hide();
   }


}

let sortField = "";
let sortDirection = "asc";
let searchDebounceTimer = null;
let currentPage = 1;
let currentFilters = {
   search: '',
   department: '',
   status: ''
};

$("#sortName").click(function(){
   sortField = "name";
   sortDirection = sortDirection === "asc" ? "desc" : "asc";
   currentPage = 1;
   applyFilters();

});

$("#sortSalary").click(function(){
   sortField = "salary";
   sortDirection = sortDirection === "asc" ? "desc" : "asc";
   currentPage = 1;
   applyFilters();

});

$("#sortDate").click(function(){
   sortField = "joinDate";
   sortDirection = sortDirection === "asc" ? "desc" : "asc";
   currentPage = 1;
   applyFilters();

});

/* =========================
   PAGINATION
========================= */

$(document).on("click", ".pagination a", async function(e){
   e.preventDefault();
   let page = $(this).data("page");
   currentPage = page;

   spinnerService.show("Loading page...");

   try {
      let result = await employeeService.getAll(
         currentPage, 
         10, 
         currentFilters.search, 
         currentFilters.department, 
         currentFilters.status, 
         sortField || 'name', 
         sortDirection
      );
      uiService.renderEmployeeTable(result);
   } catch (error) {
      showToast('Failed to load page: ' + error.message, 'error');
   } finally {
      spinnerService.hide();
   }
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
$(document).on("click", ".editBtn", async function(){

   document.querySelectorAll('.modal.show').forEach(modalEl => {
      let modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();
   });

   let id = Number($(this).data("id"));

   spinnerService.show("Loading employee...");

   try {
      let emp = await employeeService.getById(id);

      $(this).blur();

      // modal.show();

      setTimeout(() => {
         uiService.showModal("edit", emp);
         spinnerService.hide();
      }, 10);
   } catch (error) {
      spinnerService.hide();
      showToast('Failed to load employee: ' + error.message, 'error');
   }

});


/* =========================
   SAVE EMPLOYEE 
========================= */

// save employee (add or update)

$("#saveEmployeeBtn").click(async function(){

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
   let errors = await validationService.validateEmployee(data);
   if(Object.keys(errors).length > 0){
      uiService.showInlineErrors(errors);
      return;
   }

   //clear error
   $(".error").remove();

   spinnerService.show(id ? "Updating employee..." : "Adding employee...");

   try {
      // CHECK: ADD OR UPDATE
      if(id){
         // UPDATE 
         await employeeService.update(Number(id), data);
         showToast("Employee updated successfully!");
      }else{
         // ADD
         await employeeService.add(data);
         showToast("Employee added successfully!");
      }

      $("#searchInput").val("");
      $("#departmentFilter").val("");
      $("#statusFilter").val("");

      // Refresh UI
      await applyFilters();

      await loadDashboard();

      //close modal
      bootstrap.Modal.getInstance(
      document.getElementById("employeeModal")
      ).hide();
   } catch (error) {
       const serverErrors = validationService.mapServerErrors(error.errors);
       if (Object.keys(serverErrors).length > 0) {
          uiService.showInlineErrors(serverErrors);
       } else {
          showToast('Error saving employee: ' + (error.message || 'Validation failed'), 'error');
       }
   } finally {
      spinnerService.hide();
   }

});


//view employee details

$(document).on("click", ".viewBtn", async function(){

   document.querySelectorAll('.modal.show').forEach(modalEl => {
    let modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
   });

   let id = Number($(this).data("id"));

   spinnerService.show("Loading employee details...");

   try {
      let emp = await employeeService.getById(id);
      uiService.renderViewEmployee(emp);

      $(this).blur();

      setTimeout(() => {
         uiService.showModal("view", emp);
         spinnerService.hide();
      }, 10);
   } catch (error) {
      spinnerService.hide();
      showToast('Failed to load employee: ' + error.message, 'error');
   }

});


// handle delete button click

let deleteId = null;

$(document).on("click", ".deleteBtn", async function(){

   // close any open modal
   document.querySelectorAll('.modal.show').forEach(modalEl => {
      let instance = bootstrap.Modal.getInstance(modalEl);
      if(instance) instance.hide();
   });

   deleteId = Number($(this).data("id"));

   spinnerService.show("Loading employee...");

   try {
      let emp = await employeeService.getById(deleteId);
      // show name in message
      $("#deleteMessage").text(
      `Are you sure you want to delete ${emp.firstName} ${emp.lastName}?`
      );

      // open modal
      let modal = new bootstrap.Modal(
      document.getElementById("deleteModal")
      );

      modal.show();
      spinnerService.hide();
   } catch (error) {
      spinnerService.hide();
      showToast('Failed to load employee: ' + error.message, 'error');
      deleteId = null;
   }

});

// handle confirm delete

$("#confirmDeleteBtn").click(async function(){

   if(deleteId !== null){
      spinnerService.show("Deleting employee...");

      try {
         await employeeService.remove(deleteId);

         spinnerService.hide();
         showToast("Employee Deleted Successfully");

         // reset filters
         $("#searchInput").val("");
         $("#departmentFilter").val("");
         $("#statusAll").prop("checked", true);


         // refresh UI
         await applyFilters();
         await loadDashboard();

         // close modal
         bootstrap.Modal.getInstance(
         document.getElementById("deleteModal")
         ).hide();

         deleteId = null;
      } catch (error) {
         spinnerService.hide();
         showToast('Error deleting employee: ' + error.message, 'error');
         deleteId = null;
      }
   }

});

function showToast(message, type = 'success', position = 'bottom-right'){

   $("#toastMessage").text(message);
   let toastEl = document.getElementById("liveToast");
   let toastWrapper = document.getElementById("toastWrapper");

   // Update toast styling based on type
   if (type === 'error') {
      toastEl.classList.add('bg-danger');
      toastEl.classList.remove('bg-success');
   } else {
      toastEl.classList.remove('bg-danger');
      toastEl.classList.add('bg-success');
   }

   // Update position
   if (position === 'top-right') {
      toastWrapper.className = 'position-fixed top-0 end-0 p-3';
      toastWrapper.style.zIndex = '9999';
   } else {
      toastWrapper.className = 'position-fixed bottom-0 end-0 p-3';
      toastWrapper.style.zIndex = '9999';
   }

   let toast = new bootstrap.Toast(toastEl, {
      delay: 3000
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





