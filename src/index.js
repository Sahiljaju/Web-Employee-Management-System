
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const hbs = require("hbs");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const url =require("url");
const moment = require('moment');


// cookie and sessions
const cookieParser = require("cookie-parser");
const session = require('express-session');
       

const port = 3000;

var app = express();
//  for making sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// connecting to database
const connString = "mongodb+srv://HR:Shubham%40123@cluster0.boknb.mongodb.net/EmployeeDatabase?retryWrites=true&w=majority"; 

const conn = mongoose.connect(
  connString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (e) => {
    if (e) {
      console.log(e);
    } else {
      console.log("Database Connected");
    }
  }
);

//built in middleware

const staticpath = path.join(__dirname, "../public/");
const templatepath = path.join(__dirname, "../templates/views");
const partialspath = path.join(__dirname, "../templates/partials");

//to set the view engine

app.set('view engine', 'hbs');
app.set('view engine', 'ejs');
app.set('views', templatepath);


app.use(express.static(staticpath));
app.use(`/images`,express.static(path.join(__dirname, "../uploads/profiles")));
app.use('/pdf', express.static(path.join(__dirname,"./../uploads/certificates")));
app.use('/pdf', express.static(path.join(__dirname,"./../uploads/ExpenseDocument")));
hbs.registerPartials(partialspath);

// Step 5 - set up multer for storing uploaded files
 
const certificatesPaths = path.join(__dirname,"./../uploads/certificates");
const profilePaths = path.join(__dirname,"./../uploads/profiles");
const ExpenseDocumentPaths = path.join(__dirname,"./../uploads/ExpenseDocument");
const UserImagePaths = path.join(__dirname,"./../uploads/profiles");


var storage = multer.diskStorage({
	destination: (req, file, cb) => {
    if (file.fieldname === "profile") {
        cb(null, profilePaths)
    }    
    else if (file.fieldname === "certificate" ) {
        cb(null, certificatesPaths)
    }
    else if(file.fieldname === "ExpenseDocument"){
      cb(null, ExpenseDocumentPaths)
    }
    else if(file.fieldname === "UserImage"){
      cb(null, UserImagePaths)
    }
 },
 filename:(req,file,cb)=>{
      if (file.fieldname === "profile" || file.fieldname === "UserImage") {
          cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
      }
      
      else if (file.fieldname === "certificate" || file.fieldname === "ExpenseDocument") {
      cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
    } 
  }
});

var upload = multer({ storage: storage,
                      
                    fileFilter: (req, file, cb) => {
                        checkFileType(file, cb);
                    }
                    })
                    .fields(
                    [
                      {name:'profile', maxCount:1},
                      {name: 'certificate', maxCount:1},
                      {name: 'UserImage', maxCount:1},
                      {name: 'ExpenseDocument', maxCount:1}
                    ]
                    ); 
                    function checkFileType(file, cb) {
                      if (file.fieldname === "certificate" || file.fieldname === "ExpenseDocument") {
                          if (
                              file.mimetype === 'application/pdf' ||
                              file.mimetype === 'application/msword' ||
                              file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                            ) { // check file type to be pdf, doc, or docx
                                cb(null, true);
                            } else {
                                cb(null, false); // else fails
                            }
                      }
                      else if ( file.fieldname === "profile" || file.fieldname === "UserImage") {
                          if (
                              file.mimetype === 'image/png' ||
                              file.mimetype === 'image/jpg' ||
                              file.mimetype === 'image/jpeg'||
                              fiel.mimetype===  'image/gif'
                            ) { // check file type to be png, jpeg, or jpg
                              cb(null, true);
                            } else {
                              cb(null, false); // else fails
                            }
                          }
                      }

// Step 6 - load the mongoose model for Image

const {Employee,ExpenseClaim,Leave,Tasks,AddSalary,login,Users,Department, Designation} = require('./model');
const { log } = require("console");
// var Employee = require('./addEmployee');
// var AddSalary = require('./addSalary');
// var Tasks = require('./tasks');
// var Users =require('./addUser')
// var ExpenseClaim = require('./ExpenseClaim');



//Login
app.get('/login',(req,res)=>{
      res.render('Loginpage');
});
var uploads = multer();
app.post('/login',uploads.none(),async (req,res)=>{

  
  try{

      let obj={
        LoginUsername : req.body.LoginpageUsername,
        LoginPassword :  req.body.LoginpagePassword,
        LoginTime: moment().format('DD/MM/YY,h:mm:ss a'),
      // token: await createToken(UserEmployee.EmployeeId),
     }

    if(req.body.loginradio==='Admin'){

     var UserEmployee = await Users.findOne({Username:obj.LoginUsername})
    //  const PasswordMatch = await bcrypt.compare(obj.LoginPassword,UserEmployee.Password);
    console.log(obj.LoginPassword,UserEmployee.UserPassword);
     if(obj.LoginPassword==UserEmployee.UserPassword){
            login.create(obj,(err,items)=>{
              if (err) {
                console.log(err);
              } 
            else {
              req.session.user = UserEmployee;
              console.log(UserEmployee);
                res.redirect('/Dashboared');
                // res.redirect('/addEmployee');
              }
            
            });
       
     }
    }
    else if(req.body.loginradio==='Employee'){
      console.log(obj);
      var UserEmployee = await Employee.findOne({Username:obj.LoginUsername})
      console.log(UserEmployee)
      const PasswordMatch = await bcrypt.compare(obj.LoginPassword,UserEmployee.Password);
      console.log(PasswordMatch)
      if(PasswordMatch == true){
        login.create(obj,(err,items)=>{
          if (err) {
            console.log(err);
          } 
        else {
          console.log()
          req.session.user = UserEmployee;
          console.log(UserEmployee);
          res.redirect('/sidebarhome')
            // res.redirect('/addEmployee');
          }
        
        });
        
        
        
      }else{
        console.log(`hi3`)
        res.send('fail')
      } 
      }
  
   
    
  }catch(e){
    res.status(400).send('invalid')
  }
  
})


///---------------------------------------------Home-------------------------------------------------///
//Home
app.get('/Dashboared',(req,res)=>{

  if (!req.session.user) {
    
    res.redirect('/login')
    return null
  }
  else{
    res.render('home');
  console.log(req.session);
  }
  
})

///-------------------------------------------Employee-----------------------------------------------///

//addEmployee

app.get('/addEmployee', (req, res) => {
  if (!req.session.user) {
    
    res.redirect('/login')
    return null
  }
  else{
    var DepartmentData = {};
  var DesignationData = {};
  Department.find({},(err,docs)=>{
    if(err){
      res.send(err);
    }else{
     DepartmentData = docs ;
    }
  });
  Designation.find({},(err,items)=>{
    if(err){
      res.send(err);
    }else{
      DesignationData = items ;
      res.render('addEmployee',{DepartmentData:DepartmentData, DesignationData:DesignationData});
    }
  });
   
    
  }
});




app.post('/addEmployee',upload, async function  (req, res, next) {
  //using bcrypt
  PasswordByUser = req.body.Password;
    const securepassword = async (UserPassword) =>{
      const passwordhash = await bcrypt.hash(UserPassword,10);
      return passwordhash;
    };

    
   
    // using Url
          
  let obj = {
           profilephoto: req.files['profile'][0].filename,
            Fullname: req.body.FullName,
            EmployeeId: req.body.EmpId,            
            Username: req.body.UserName,
            Password: await securepassword(PasswordByUser),
            TeamName:req.body.TeamName,
            PhoneNumber: req.body.Phone,
            HomeContact: req.body.HomeContact,
            EmailAddress: req.body.email,   
            MonthlySalary: req.body.MonthlySalary,
            TotalAnnualLeave: req.body.TotalAnnualIncome,
            Department: req.body.Department,
            Designation: req.body.Designation,
            JoiningDate: req.body.JoiningDate,
            LeavingDate: req.body.LeavingDate,
            MailingAddress: req.body.MailingAddress,
            FatherName: req.body.FatherName,
            MotherName: req.body.MotherName,
            DateofBirth: req.body.DateofBirth,
            Gender: req.body.Gender,
            PermanentAddress: req.body.DocumentName,
            DocumentName: req.body.PermanentAddress,
            Documents:req.files['certificate'][0].filename,
            
            BankName: req.body.BankName,
            IFSCcode: req.body.IFSCcode,
            AccountNumber: req.body.AccountNumber,
            AccountName: req.body.AccountName,
           
                        }
                        console.log(obj)

            
             Employee.create(obj, (err, item) => {
            if (err) {
                console.log(err);
              } 
            else {
                 
                // res.send('fileuploaded');
                res.redirect('/manageEmployee');
              }
            });
          });
          




// Update Employee

app.get('/updateEmployee/:id', (req, res)=>{
  if (!req.session.user) {
    
    res.redirect('/login')
    return null
  }
  else{
  var id = req.params.id;
  var DepartmentData = {};
  var DesignationData = {};
  Department.find({},(err,docs)=>{
    if(err){
      res.send(err);
    }else{
     DepartmentData = docs ;
    }
  });
  Designation.find({},(err,items)=>{
    if(err){
      res.send(err);
    }else{
      DesignationData = items ;
    }
  });
  Employee.findOne({_id:id}, (err, Data) => {
    if (err) {
        console.log(err);
        res.status(500).send('An error occurred', err);
    }
    else {
        res.render('updateEmployee', { userData: Data , DepartmentData:DepartmentData ,DesignationData:DesignationData });
        
    }
});
  }
});


app.post('/updateEmployee/:id',upload, (req, res)=>{
  let obj = {
    // profilephoto: url.pathToFileURL(req.files['profile'][0].path).pathname,
     Fullname: req.body.FullName,
     EmployeeId: req.body.EmpId,            
    
     TeamName:req.body.TeamName,
     PhoneNumber: req.body.Phone,
     HomeContact: req.body.HomeContact,
     EmailAddress: req.body.email,   
     MonthlySalary: req.body.MonthlySalary,
     TotalAnnualLeave: req.body.TotalAnnualIncome,
     Department: req.body.Department,
     Designation: req.body.Designation,
     JoiningDate: req.body.JoiningDate,
     LeavingDate: req.body.LeavingDate,
     MailingAddress: req.body.MailingAddress,
     FatherName: req.body.FatherName,
     MotherName: req.body.MotherName,
     DateofBirth: req.body.DateofBirth,
     Gender: req.body.Gender,
     PermanentAddress: req.body.PermanentAddress,
     DocumentName: req.body.DocumentName,
   
     
     BankName: req.body.BankName,
     IFSCcode: req.body.IFSCcode,
     AccountNumber: req.body.AccountNumber,
     AccountName: req.body.AccountName,
                 }
    
    if(req.file){
      
      obj.Documents = req.files['certificate'][0].filename ;
    }
                 console.log(obj)
     
  var id = req.params.id;
    Employee.update({_id:id},obj,(err,docs)=>{
      if(err){
        console.log(err);
      }
      else{
        console.log(docs);
        res.redirect('/manageEmployee')
      }
    });
  

});

var uploads = multer()
app.get('/manageEmployee', (req, res) => {
  if (!req.session.user) {
    
    res.redirect('/login')
    return null
  }
  if(req.body.ManageEmployeeSearch==null){
console.log(req.session.user);
    const user=req.session.user
  Employee.find({TeamName:user.UserTeamName}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('manageEmployee', { userData: items });
          console.log(items);
      }
  });
}else{
  Employee.find({Fullname:req.body.ManageEmployeeSearch}, (err, items) => {
    if (err) {
        console.log(err);
        res.status(500).send('An error occurred', err);
    }
    else {
        res.render('manageEmployee', { userData: items });
        console.log(items);
    }
});
}
});

app.post('/manageEmployee/:id',(req,res)=>{

    Employee.findByIdAndRemove( req.params.id, (err, docs)=>{
            if(err){ res.json(err)}
            else {
              res.redirect('/manageEmployee')};
            
});
});
  

// app.get manage Employee

///-------------------------------------- Users -----------------------------------------------------///


//users
 
app.get("/addUser",(req,res)=>{
  if (!req.session.user) {
    
    res.redirect('/login')
    return null
  }
  if(req.body.ManageEmployeeSearch==null){
console.log(req.session.user);
    const user=req.session.user
  Employee.find({TeamName:user.UserTeamName}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('addUser', { userData: items });
          console.log(items);
      }
  });
}
});

app.get("/adduserid/:id",(req,res)=>{
  const id = req.params.id
  if (!req.session.user) {
    
    res.redirect('/login')
    return null
  }
  else{
    Employee.findOne({_id:id}, (err, Data) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('adduserid', { userData: Data });
          console.log(Data)
      }
  });
  }
  
});


app.post("/adduserid/:id", upload,function (req, res, next) {
  

  var obj = {
    profilephoto:req.body.profilephoto,
    EmpId:req.body.EmployeeId,
    Username:req.body.UserName,
    UserPassword:req.body.UserPassword,
    UserFullName:req.body.UserFullName,
    UserTeamName:req.body.UserTeamName,
    UserFatherName:req.body.UserFatherName,
    UserEmail:req.body.UserEmail,
    UserContact:req.body.UserContact,
    UserAddress:req.body.UserAddress,
    UserDateofbirth:req.body.UserDateofbirth,
  }

 
 Users.create(obj, (err, item) => {
    if (err) {
        console.log(err);
      }
    else {
        res.redirect("http://localhost:3000/manageUser");
        // res.redirect('/addEmployee');
      }
    })
  });



 ///////////////// ---------------- manageUsers -----------------------------///////// 

 app.get('/manageUser', (req, res) => {
  if (!req.session.user) {
    
    res.redirect('/login')
    return null
  }
  
console.log(req.session.user);
    const user=req.session.user
  Users.find({TeamName:user.UserTeamName}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('manageUsers', { userData: items });
          console.log(items);
      }
  });

});



/////////////////////////------------------Expense Claim---------------------/////////////////////////////




// ExpenseClaim
app.get('/ExpenseClaim/:id',(req,res)=>{
 
 
   
          if (!req.session.user) {
    
            res.redirect('/login')
            return null
          }
          
         console.log(req.session.user);
         var id = req.params.id;
           ExpenseClaim.findOne({_id:id}, (err, items) => {
               if (err) {
                  console.log(err);
                  res.status(500).send('An error occurred', err);
               }
               else {
                   res.render('ExpenseClaim', { userData: items });
                   console.log(items);
               }
           });
})
        
        app.post('/ExpenseClaim/:id',upload, (req, res)=>{
          let obj = {
            
            status:req.body.LeaveApproved,
                         }
            
            
             
          var id = req.params.id;
          ExpenseClaim.update({_id:id},obj,(err,docs)=>{
              if(err){
                console.log(err);
              }
              else{
                console.log(docs);
                res.redirect('/manageLeave')
              }
            });
          
        
        });
      
/////-----------------------------------Salary---------------------------------------------------------------///

//addSalary
app.get("/addSalary",(req,res)=>{
  if (!req.session.user) {
    
    res.redirect('/login')
    return null
  }
  Employee.find({}, (err, items) => {
    if (err) {
        console.log(err);
        res.status(500).send('An error occurred', err);
    }
    else {
        res.render('addSalary', { userData: items });
        console.log(items);
    }
});
})
var uploads = multer()
app.post("/addSalary", uploads.none(),function (req, res, next) {
  
  let obj = {
      Type:req.body.SalaryType,
      EmployeeName:req.body.SelectEmployee,
      PaymentType:req.body.PaymentType,
      Amount:req.body.SalaryAmount,
      TaxRate:req.body.SalaryTaxRate,
      SalaryDate:req.body.SalaryDate,
      SalaryMonth:req.body.SalaryMonth,
      SalaryYear:req.body.SalaryYear,
      Note:req.body.Note
  }
 AddSalary.create(obj, (err, item) => {
    if (err) {
        console.log(err);
      }
    else {
        res.redirect("http://localhost:3000/manageSalary");
        // res.redirect('/addEmployee');
      }
    });
  });




   ///manage Salary
 app.get("/manageSalary",(req,res)=>{
  if (!req.session.user) {
    
    res.redirect('/login')
    return null
  }
  AddSalary.find({}, (err, items) => {
    if (err) {
        console.log(err);
        res.status(500).send('An error occurred', err);
    }
    else {
        res.render('manageSalary', { userData: items });
        console.log(items);
    }
});
});



///-----------------------------------------------Tasks----------------------------------------------///


 //tasks
 app.get("/Tasks",(req,res)=>{
  if (!req.session.user) {   
    res.redirect('/login')
    return null
  }
  else{
   var Taskdata ={};
   var Employeedata = {};
   const user=req.session.user;
   
   Tasks.find({},(err,docs)=>{
     if(err){
       res.send(err);
     }
     else{
       Taskdata = docs;
       console.log(`Tasks`,Taskdata)
     }
   })
   Employee.find({TeamName:user.UserTeamName},(err,items)=>{
     if(err){
       res.send(err);
     }
     else{
       Employeedata = items;
       console.log(Employeedata,Taskdata)
       res.render('Tasks',{Employeedata:Employeedata, Taskdata:Taskdata});
     }
   })
  }


});
var uploads = multer()
app.post("/Tasks", uploads.none(),function (req, res ) {
  var obj = {
    TaskTitle:req.body.TaskTitle,
    TaskDescription:req.body.TasksDescription,
    AssignDate:moment().format('DD/MM/YY'),
    Submissiondate:req.body.Submissiondate,
    EmployeeName:req.body.AssignEmployee,
  }

 
 Tasks.create(obj, (err, item) => {
    if (err) {
        console.log(err);
      }
    else {
        res.redirect("/Tasks");
        // res.redirect('/addEmployee');
      }
    })
  });

  app.post("/Tasks/:id",(req,res)=>{

    Tasks.findByIdAndRemove( req.params.id, (err, docs)=>{
            if(err){ res.json(err)}
            else {
              
              res.redirect('/Tasks')};
            
});
}); 
  

  

           
// });


 
 

  //////////////////--------------------------Manage Leave --------------------------////////////////////
  app.get("/manageLeave",(req,res)=>{
    if (!req.session.user) {
    
      res.redirect('/login')
      return null
    }
    
   console.log(req.session.user);
       const user=req.session.user

     Leave.find({Teamname:user.UserTeamName}, (err, items) => {
         if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
         }
         else {
             res.render('manageLeave', { userData: items });
             console.log(items);
         }
     });
    
  })

  app.get("/manageLeaveid/:id",(req,res)=>{
    if (!req.session.user) {
    
      res.redirect('/login')
      return null
    }
    
   console.log(req.session.user);
   var id = req.params.id;
     Leave.findOne({_id:id}, (err, items) => {
         if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
         }
         else {
             res.render('manageLeaveid', { userData: items });
             console.log(items);
         }
     });
    
  })

  app.post('/manageLeaveid/:id',upload, (req, res)=>{
    let obj = {
      
      status:req.body.LeaveApproved,
                   }
      
      
       
    var id = req.params.id;
      Leave.update({_id:id},obj,(err,docs)=>{
        if(err){
          console.log(err);
        }
        else{
          console.log(docs);
          res.redirect('/manageLeave')
        }
      });
    
  
  });

  //////////////-----------------Expense-------------------------------/////
  app.get("/Expenses",(req,res)=>{
    if (!req.session.user) {
    
      res.redirect('/login')
      return null
    }
    
   console.log(req.session.user);
       const user=req.session.user

     ExpenseClaim.find({Teamname:user.UserTeamName}, (err, items) => {
         if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
         }
         else {
             res.render('manageClaimExpenses', { userData: items });
             console.log(items);
         }
     });
    
  })


 ///////////////////// --------------------------loginvideo ------------------------////////////////////////////////
app.get("/loginvideo",(req,res)=>{
  res.render("loginvideo")
})







///////////////////// -----------------  Profile -----------------------------------//////////////////////////////
app.get("/Profile",(req,res)=>{
  if (!req.session.user) {
    
    res.redirect('/login')
    return null
  }
  Employee.findOne({},(err,items)=>{
    if (err) {
      console.log(err);
      res.status(500).send('An error occurred', err);
  }
  else {
      res.render('profile', { userData: items });
      console.log(items);
  }
  
    });
  });


  ///////////////////////---------------------Department -----------------------------////////////////

  app.get('/departments',(req,res)=>{
    if (!req.session.user) {
    
      res.redirect('/login')
      return null
    }
    Department.find({},(err,docs)=>{
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred', err);
    }
    else {
        res.render('departments', { userData: docs });
        console.log(docs);
    }
    });
  });
      
  app.post("/departments",uploads.none(),(req,res)=>{
     if (!req.session.user) {
    
    res.redirect('/login')
    return null
  }
   
    let obj={
      DeptID:req.body.DepartmentID,
      DeptName:req.body.DepartmentName,
      Overview:req.body.DepartmentDescription,
    }


    Department.create(obj,(err,items)=>{ 
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred', err);
    }
    else {
      res.redirect("http://localhost:3000/departments");
      // res.redirect('/addEmployee');
    }    
      });
    }); 

    app.post('/departments/:id',(req,res)=>{

      Department.findByIdAndRemove( req.params.id, (err, docs)=>{
              if(err){ res.json(err)}
              else {
                res.redirect('/departments')};
              
  });
  });
 
////////////////// ------------------------ Designation ---------------------------------/////////////////
app.get('/designation',(req,res)=>{
  if (!req.session.user) {
    
    res.redirect('/login')
    return null
  }
  Designation.find({},(err,docs)=>{
    if (err) {
      console.log(err);
      res.status(500).send('An error occurred', err);
  }
  else {
    console.log(docs);
    res.render('Designation', { DesignationData: docs });
  }
});
});

app.post("/designation",uploads.none(),(req,res)=>{
  let obj={
    DesigID:req.body.DesigID,
    DesigName:req.body.DesigName,
    Work:req.body.Work,
    DesignationPriority:req.body.DesignationPriority,
  }


  Designation.create(obj,(err)=>{ 
    if (err) {
      console.log(err);
      res.status(500).send('An error occurred', err);
  }
  else {
    res.redirect("http://localhost:3000/designation");
    // res.redirect('/addEmployee');
  }    
    });
  }); 

  app.post('/designation/:id',(req,res)=>{

    Designation.findByIdAndRemove( req.params.id, (err, docs)=>{
            if(err){ res.json(err)}
            else {
              res.redirect('/designation')};
            
});
});


  ///////--------------applyleave--------------////

  app.get('/applyleave',(req,res)=>{
    if (!req.session.user) {
    
      res.redirect('/login')
      return null
    }
    else{
      const user=req.session.user
      Leave.find({EmpName:user.Fullname}, (err, Data) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('applyleavenavigation', { userData: Data });
            
        }
    });
      }
    
  })

  var uploads = multer();
  app.post('/applyleave',uploads.none(),(req,res)=>{
    const user=req.session.user
    let obj ={
      EmpName: user.Fullname, 
      EmpID:user.EmployeeId,
      Teamname:user.TeamName,
      Subject:req.body.leaveSubject,
      Reason:req.body.leavetextarea,
      LeaveFrom:req.body.from,
      Leaveto:req.body.to,
      LeavetypeDay:req.body.leavetextarea,
      LeavetypePaidorUnpaid:req.body.Paid,
      Leavetype:req.body.LeaveType,

      }
      console.log(obj)
      Leave.create(obj,(err,docs)=>{
        if(err){
          res.send(err);
        }
        else{
          console.log(docs)
          res.redirect('/Sidebarhome');
        }
      })
  })

  app.get('/logout',(req,res)=>{
    
    req.session.destroy();
    res.redirect('/login')
   
  })

  /////////////------------------------- Sidebar -------------------------------------////////////////////

  app.get('/Sidebarapplyleave',(req,res)=>{
    if (!req.session.user) {
    
      res.redirect('/login')
      return null
    }
    else{
      const user=req.session.user
      Leave.find({EmpName:user.Fullname}, (err, Data) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('Sidebarapplyleave', { userData: Data });
            
        }
    });
      }
    
  })

  var uploads = multer();
  app.post('/Sidebarapplyleave',uploads.none(),(req,res)=>{
    const user=req.session.user
    let obj ={
      EmpName: user.Fullname, 
      EmpID:user.EmployeeId,
      Teamname:user.TeamName,
      Subject:req.body.leaveSubject,
      Reason:req.body.leavetextarea,
      LeaveFrom:req.body.from,
      Leaveto:req.body.to,
      LeavetypeDay:req.body.leavetextarea,
      LeavetypePaidorUnpaid:req.body.Paid,
      Leavetype:req.body.LeaveType,

      }
      console.log(obj)
      Leave.create(obj,(err,docs)=>{
        if(err){
          res.send(err);
        }
        else{
          console.log(docs)
          res.redirect('/Sidebarhome');
        }
      })
  })
  app.get('/SidebarExpense',(req,res)=>{
    if (!req.session.user) {
    
      res.redirect('/login')
      return null
    }
    else{
    res.render('SidebarExpense');
    }
    
   })

   app.post('/SidebarExpense',upload,(req,res)=>{
     const user =req.session.user
     console.log(user)

    obj={
      EmpID:user.EmployeeId,
      EmpName:user.FullName,
      Date:req.body.DateofExpense,
      Teamname:user.TeamName,
      ExpenseType:req.body.ExpenseType,
      Amount:req.body.AmountofExpense,
      ExpenseFile:req.body.ExpenseFileName,
      ExpenseDocument:req.files['ExpenseDocument'][0].filename,
      ExpenseTitle:req.body.ExpenseTitle,
      Note:req.body.Note,
    }
     console.log(obj)

            
      ExpenseClaim.create(obj, (err, item) => {
     if (err) {
         console.log(err);
       } 
     else {
          
         res.send('fileuploaded');
         // res.redirect('/addEmployee');
       }
     });
   
    
   })

   app.get('/sidebarhome',(req,res)=>{
    if (!req.session.user) {
      console.log(`error`)
      res.redirect('/login')
      return null
    }
    
    res.render('sidebarhome');
    
   })

   app.get('/sidebarprofile',(req,res)=>{
    if (!req.session.user) {
    
      res.redirect('/login')
      return null
    }
    else{
      console.log(`Testing`)
    const user=req.session.user
    console.log(`Testing`)
    console.log(user)
    Employee.findOne({_id:user._id}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('sidebarprofile', { userData: items });
          console.log(items);
      }
  });
}
   })



   app.post('/sidebarprofile',(req,res)=>{
    if (!req.session.user) {
    
      res.redirect('/login')
      return null
    }
    else{
      console.log(`Testing`)
    const user=req.session.user
    console.log(`Testing`)
    console.log(user)
    Employee.update({_id:user._id}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('sidebarprofile', { userData: items });
          console.log(items);
      }
  });
}
   })

app.get('/profile',(req,res)=>{
    if (!req.session.user) {
    
      res.redirect('/login')
      return null
    }
    else{
      console.log(`Testing`)
    const user=req.session.user
    console.log(`Testing`)
    console.log(user)
    Employee.findOne({_id:user._id}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('profile', { userData: items });
          console.log(items);
      }
  });
}
   })

   app.post('/profile',(req,res)=>{
    if (!req.session.user) {
    
      res.redirect('/login')
      return null
    }
    else{
      console.log(`Testing`)
    const user=req.session.user
    console.log(`Testing`)
    console.log(user)
    Employee.update({_id:user._id}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('profile', { userData: items });
          console.log(items);
      }
  });
}
   })
 
   app.get('/ExpenseClaimnavigation',(req,res)=>{
    if (!req.session.user) {
    
      res.redirect('/login')
      return null
    }
    else{
    res.render('Expenseclaimnavigation');
    }
    
   })

   app.post('/ExpenseClaimnavigation',upload,(req,res)=>{
     const user =req.session.user
     console.log(user)

    obj={
      EmpID:user.EmployeeId,
      EmpName:user.FullName,
      Date:req.body.DateofExpense,
      Teamname:user.TeamName,
      ExpenseType:req.body.ExpenseType,
      Amount:req.body.AmountofExpense,
      ExpenseFile:req.body.ExpenseFileName,
      ExpenseDocument:req.files['ExpenseDocument'][0].filename,
      ExpenseTitle:req.body.ExpenseTitle,
      Note:req.body.Note,
    }
     console.log(obj)

            
      ExpenseClaim.create(obj, (err, item) => {
     if (err) {
         console.log(err);
       } 
     else {
          
         res.send('fileuploaded');
         // res.redirect('/addEmployee');
       }
     });
    })




app.listen(port,()=>{
console.log("server running on port number",port);
})



 