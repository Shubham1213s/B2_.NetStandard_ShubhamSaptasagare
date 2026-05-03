/* ============================
   ADMIN DATA
============================ */

var adminData = {
   username: "admin",
   password: "123456"
};


/* ============================
   EMPLOYEE DATA (15 Records)
============================ */

var employees = [
   {
      id:1,
      firstName:"Shubham",
      lastName:"Saptasagare",
      email:"shubham.s@xyz.com",
      phone:"8010215831",
      department:"Engineering",
      designation:"Software Engineer",
      salary:750000,
      joinDate:"2022-06-15",
      status:"Active"
   },
   
   {
      id:2,
      firstName:"Shivam",
      lastName:"Sharma",
      email:"shivam.sharma@xyz.com",
      phone:"8010115832",
      department:"Marketing",
      designation:"Marketing Executive",
      salary:550000,
      joinDate:"2023-01-10",
      status:"Active"
   },

   {
      id:3,
      firstName:"Amit",
      lastName:"Patil",
      email:"amit.patil@xyz.com",
      phone:"9987654321",
      department:"HR",
      designation:"HR Executive",
      salary:500000,
      joinDate:"2021-09-12",
      status:"Inactive"
   },

   {
      id:4,
      firstName:"Neha",
      lastName:"Marathe",
      email:"neha.marathe@xyz.com",
      phone:"9876543213",
      department:"Finance",
      designation:"Accountant",
      salary:600000,
      joinDate:"2020-11-20",
      status:"Active"
   },

   {
      id:5,
      firstName:"Arjun",
      lastName:"Kapoor",
      email:"arjun.kapoor@xyz.com",
      phone:"7622321411",
      department:"Operations",
      designation:"Operations Manager",
      salary:650000,
      joinDate:"2022-03-18",
      status:"Active"
   },
   
   {
      id:6,
      firstName:"Sneha",
      lastName:"Kulkarni",
      email:"sneha.kulkarni@xyz.com",
      phone:"9876543215",
      department:"Engineering",
      designation:"Frontend Developer",
      salary:720000,
      joinDate:"2023-02-14",
      status:"Active"
   },

   {
      id:7,
      firstName:"Rohit",
      lastName:"Sharma",
      email:"rohit.sharma@xyz.com",
      phone:"6654321678",
      department:"Marketing",
      designation:"SEO Specialist",
      salary:480000,
      joinDate:"2021-06-25",
      status:"Inactive"
   },

   {
      id:8,
      firstName:"Sunita",
      lastName:"Koshti",
      email:"sunita.koshti@xyz.com",
      phone:"9876332171",
      department:"HR",
      designation:"HR Manager",
      salary:800000,
      joinDate:"2019-04-30",
      status:"Active"
   },

   {
      id:9,
      firstName:"Manish",
      lastName:"Sisodia",
      email:"manish.sisodia@xyz.com",
      phone:"9876543218",
      department:"Finance",
      designation:"Financial Analyst",
      salary:670000,
      joinDate:"2020-12-10",
      status:"Active"
   },

   {
      id:10,
      firstName:"Santram",
      lastName:"Joshi",
      email:"santram.joshi@xyz.com",
      phone:"8854321922",
      department:"Operations",
      designation:"Operations Executive",
      salary:520000,
      joinDate:"2022-08-22",
      status:"Inactive"
   },

   {
      id:11,
      firstName:"Sonali",
      lastName:"Mehta",
      email:"sonali.mehta@xyz.com",
      phone:"9876543220",
      department:"Engineering",
      designation:"Backend Developer",
      salary:780000,
      joinDate:"2023-05-12",
      status:"Active"
   },

   {
      id:12,
      firstName:"Varsha",
      lastName:"Desai",
      email:"varsha.desai@xyz.com",
      phone:"9876543221",
      department:"Marketing",
      designation:"Brand Manager",
      salary:620000,
      joinDate:"2021-07-09",
      status:"Active"
   },

   {
      id:13,
      firstName:"Omkar",
      lastName:"Reddy",
      email:"omkar.reddy@xyz.com",
      phone:"9876543222",
      department:"Finance",
      designation:"Finance Manager",
      salary:900000,
      joinDate:"2018-02-01",
      status:"Active"
   },

   {
      id:14,
      firstName:"Madhuri",
      lastName:"Nair",
      email:"madhuri.nair@xyz.com",
      phone:"9876543223",
      department:"HR",
      designation:"Recruiter",
      salary:450000,
      joinDate:"2022-09-05",
      status:"Inactive"
   },

   {
      id:15,
      firstName:"Akash",
      lastName:"Yadav",
      email:"akash.yadav@xyz.com",
      phone:"9876543224",
      department:"Engineering",
      designation:"DevOps Engineer",
      salary:820000,
      joinDate:"2023-11-15",
      status:"Active"
   }

];

// For Node.js
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        adminData,
        employees
    };
}

// For browser
if (typeof window !== "undefined") {
    window.adminData = adminData;
    window.employees = employees;
}