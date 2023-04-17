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
// const adminRouter = require('./routes/admin');

// app.use('/user', userRouter);
// app.use('/admin', adminRouter);
app.use(cookieParser()); // add this line

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/"));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/views/index.html")
})

app.get('/dashboard', isAuthenticated, function(req, res) {
  res.sendFile(__dirname + "/views/dashboard.html")
})

app.get('/login', function(req, res) {
  res.sendFile(__dirname + "/views/page-login.html")
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'Email Not Found' });
          // res.render('\page-login',{message: 'Email Not Found'})
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
        // res.render('\page-login',{message: 'Invalid password'})

      }
      const token = jwt.sign({ userId: user.userId }, 'mysecretkey');
      return res.json({ token })
    } 
    catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  });


  function isAuthenticated(req, res, next) {
    const token = req.cookies.jwt; 
    if (token) {
      jwt.verify(token, 'mysecretkey', function(err, decoded) {
        if (err) {
          return res.redirect('/login');
        } else {
          if (decoded && decoded.userType === 1) {
            req.user = decoded;
            return next();
        } else {
          return res.status(403).json({ error: 'Forbidden' });
        }
      }
    });
  } else {
    return res.redirect('/login');
  }
}
  
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

