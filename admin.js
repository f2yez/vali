const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
const port = 3000
const Admin = require("./db/adminDB")

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/"));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/views/index.html")
})

app.get('/dashboard', function(req, res) {
  res.sendFile(__dirname + "/views/dashboard.html")
})

app.get('/login', function(req, res) {
  res.sendFile(__dirname + "/views/page-login.html")
})

app.post('/login', function(req, res) {
  const checkUser = new Admin({
    email: req.body.email,
    password: req.body.password
});
Admin.findOne({email:checkUser.email}).then((user) => {
  console.log(checkUser.email, checkUser.password)
  if(user) {
        if(user.password == checkUser.password) {
          res.redirect("\dashboard");
        }
        else {
            res.render('\page-login',{
                message: 'Password is wrong'
            })
        }
    } else {
        res.render('\page-login',{
            message: 'Email is not found'
        })
    }
})
})



app.listen(port, () => {
  console.log(`listening on port ${port}`)
})