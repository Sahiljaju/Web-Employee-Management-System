const mongoose = require("mongoose");
const jwt = require("jsonwebToken");

const employeeSchema = new mongoose.Schema({
    Fullname: {
     type: String,
     required: true,
   },
   profilephoto: {     
     type: [String],
   },
   EmployeeId: {
     type: String,
     required: true,
   },
   Username: {
     type: String,
     required: true,
   },
   Password: {
     type: String,
     required: true,
   },
   TeamName:{
     type:String,
   },
   PhoneNumber: {
     type: String,
     required: true,
   },
   FatherName: {
     type: String,
     required: false,
   },
   MotherName: {
     type: String,
     required: false,
   },
   HomeContact: Number,
   MonthlySalary: Number,
   TotalAnnualLeave: Number,
   EmailAddress: {
     type: String,
     required: true,
   },
   Department: {
     type: String,
     required: true,
   },
   Designation: {
     type: String,
     required: true,
   },
   JoiningDate: {
     type: String,
     required: true,
   },
   LeavingDate: {
     type: String,
   },
   MailingAddress: {
     type: String,
     required: true,
   },
   PermanentAddress: {
     type: String,
     required: true,
   },
   DateofBirth: {
     type: String,
     required: true,
   },
   Gender: {
     type: String,
     required: true,
   },
   DocumentName:{
    type: String,
    
  },
  Documents:{
    
    type: [String],     
  },
  BankName:{
    type: String,
    required:true,
  },
  IFSCcode:{
    type: String,
    required:true,
  },
  AccountNumber:{
    type: String,
    required:true,
  },
  AccountName:{
    type: String,
    required:true,
  },
  UserAcess:{
    type: Boolean,
   
  },
  
  
 });

 


const Employee = new mongoose.model("Employees", employeeSchema);

/// AddUser
const AddUserSchema = new mongoose.Schema({
    
    profilephoto: {
           type: String,
    },
    EmpId:{ 
       type:String,
       required:true,
    },
      Username: {
      type: String,
      required: true,
    },
    UserPassword: {
      type: String,
      required: true,
    },
    UserFullName: {
      type: String,
      required: true,
    },
    UserTeamName:{
      type:String,
      required:true,
    },
    UserFatherName: {
      type: String,
      required: true,
    },
    UserEmail: {
      type: String,
      required: false,
    },
    UserContact: {
      type: Number,
      required: false,
    },
   
    UserAddress: {
      type: String,
      required: true,
    },
    UserDateofbirth: {
      type: Date,
      required: true,
    }
  });
 
 const Users = new mongoose.model("Users", AddUserSchema);
 
 //login
 const loginSchema = new mongoose.Schema({
    LoginUsername:String,
    LoginPassword:String,
    LoginTime:String,
})

const login = new mongoose.model("login", loginSchema);

//addSalary

const addSalary = new mongoose.Schema({
    Type:String,
    EmployeeName:String,
    PaymentType:String,
    Amount:Number,
    TaxRate:Number,
    SalaryDate:String,
    SalaryMonth:String,
    SalaryYear:Number,
    Note:String
  
});

const AddSalary = new mongoose.model("Salarydata",addSalary);

//tasks
const Taskschema = new mongoose.Schema({
    TaskTitle:String,
    TaskDescription:String,
    AssignDate:String,
    Submissiondate:String,
    EmployeeName:String,
});

const Tasks = new mongoose.model("Tasks",Taskschema);

const leaveschema = new mongoose.Schema({
    EmpName:String,
    EmpID:String,
    LeaveFrom:String,
    Leaveto:String,
    Teamname:String,
    Subject:String,
    Reason:String,
    LeavetypeDay:String,
    LeavetypePaidorUnpaid:String,
    Leavetype:String,
    status:{
        type : String,
        default:'pending',
    },

});

const Leave = new mongoose.model("Leave",leaveschema);

//Expense Claim
const ExpenseSchema = new mongoose.Schema({
    EmpID:String,
    EmpName:String,
    Date:Date,
    Teamname:String,
    ExpenseType:String,
    Amount:Number,
    ExpenseFile:String,
    ExpenseDocument:String,
    ExpenseTitle:String,
    Note:String,
    status:{
      type : String,
      default:'pending',
  },
});

const ExpenseClaim = new mongoose.model("ExpenseClaim",ExpenseSchema);

const departmentSchema = new mongoose.Schema({
    DeptID:String,
    DeptName:String,
    Overview:String,
});         

const Department = new mongoose.model("Department",departmentSchema);

const designationSchema = new mongoose.Schema({
  DesigID:String,
  DesigName:String,
  Work:String,
  DesignationPriority:Number,
});

const Designation =  new mongoose.model("Designation",designationSchema)

const pageschema = new mongoose.Schema({
  Pageid:String,
  PageName:String,
  PageUrl:String,
  
});

const Page = new mongoose.model("Pages", pageschema);

module.exports = {Employee,ExpenseClaim,Leave,Tasks,AddSalary,login,Users,Department,Designation};