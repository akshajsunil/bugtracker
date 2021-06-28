const express = require('express');
const app = express();
var mysql = require('mysql');
var session = require('express-session');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine","ejs");

app.use(bodyParser.json());
var con = mysql.createConnection({
  host: "localhost",
  user: "akshaj",
  password: "pass",
  database: "akshaj"  
});
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/views/home.html");

});
app.get('/register',(req,res)=>{
    res.sendFile(__dirname+"/views/register.html");

});
app.post('/register',(req,res)=>{
 console.log(req.body.username);
    console.log(req.body.pass1);
    var sql = "INSERT INTO user (username,email,password) VALUES (?)";  
var values = [req.body.username,req.body.email,req.body.pass1];
con.query(sql, [values], function (err, result) {  
if (err) throw err;  
//console.log("Number of records inserted: " + result.affectedRows);   

});
return res.redirect('/');
});
app.get('/login',(req,res)=>{
 res.sendFile(__dirname+"/views/login.html");
});
app.get('/dash',(req,res)=>{
  if(req.session.loggedin==true)
  {
    var sql = "SELECT * FROM `project`";
    con.query(sql,function(err,result){
      if(err) throw err;
      
      res.render("dash",{result:result});
    });
  
    
 
    
  



}
 else
 res.send("You have no freaking authority to access this page /*-*")





});
app.post('/login',(req,res)=>{
var uname = req.body.username;
var pass = req.body.pass1;
	if (uname && pass) {
		con.query('SELECT * FROM user WHERE username = ? AND password = ?', [uname, pass], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = uname;
				res.redirect('/dash');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
  }
  else
  {
    res.send('Please enter Username and Password!');
		res.end();
  }
});
app.post('/newproject',(req,res)=>{

    var sql = "INSERT INTO project (pname,pmanager,members) VALUES (?)";  









var str="";
if (typeof req.body.users === 'string' || req.body.users instanceof String)
str = req.body.users;
else{
Array.from(req.body.users).forEach(element => {

  str=str+element;
  str=str+'%';
});
}
var values = [req.body.pname,req.body.pmanager,str];
con.query(sql, [values], function (err, result) {  
if (err) throw err;
console.log(str);
res.redirect('/dash');
});
});

app.get('/newproject',(req,res)=>{

 var sql = "SELECT username FROM `user`";
    con.query(sql,function(err,result){
      if(err) throw err;
      
      res.render("newproject",{result:result});
    });
});

app.get("/newissue",(req,res)=>{
var sql = "SELECT pname FROM `project`";
con.query(sql,function(err,result){
      if(err) throw err;
  res.render("newissue",{result:result});
  });
});
app.post("/newissue",(req,res)=>{
    var sql = "INSERT INTO project (pname,pmanager,members) VALUES (?)";  
    
});

app.get('/logout',(req,res)=>{
req.session.destroy();
res.redirect('/');
});


app.listen(5000,console.log("running in 5000"));