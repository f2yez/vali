const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./db/userDB');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.set('view engine', 'ejs');

// const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

// app.use('/user', userRouter);
app.use(cookieParser());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/"));


app.get('/', function(req, res) {
  res.sendFile(__dirname + "/views/index.html")
})

app.get('/dashboard', isAuthenticated, function(req, res) {
  res.sendFile(__dirname + "/views/dashboard.html")
})

app.get('/admin/dashboard', function(req, res) {
  res.sendFile(__dirname + "/views/dashboard.html")
})

app.get('/api/login', function(req, res) {
  res.sendFile(__dirname + "/views/page-login.html")
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        //  return res.status(400).json({ message: 'Email Not Found' });
          return res.render('\page-login', {message: 'Email Not Found'})
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // return res.status(400).json({ message: 'Invalid password' });
        return res.render('\page-login', {message: 'Invalid password'})

      }
      req.session.userID = user.userID;
      req.session.userType = user.userType;
      if(user.userType === 1){
        return res.render('\admin/dashboard')
      }
      else {
      // return res.json({ message: 'sign in successfully' })
      return res.render('\dashboard')
    }
  } 
    catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  function isAuthenticated(req, res, next) {
    if(req.session.userID){
      return next();
    }
    else {
      res.redirect('\api/login');
    }
}
  
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

