if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const methodOverride = require("method-override");

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];

app.set("veiw-engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
//css styles
app.use("/public", express.static("public"));

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});
app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
  console.log(users);
});

app.delete("/logout", (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(3000);

/**
 * 1 npm init
 * 2 npm i express ejs
 * 3 npm i --save-dev nodemon dotenv   (nodemon for restart server auto and dotenv for storing variables to use in our env enviroment
 * 4 .gitignor for prevent commits (for example we dont want send information from .env file)
 * 5 create script for run server
 * 6 Set up express application
 * 7 making a routes for home page (app.get)
 * 8 making render file (index.ejs)
 * 9 create index.ejs
 * 10 to use egs syntax we use(app.set('view-engine), ejs)
 * 11 creating different pages (login.egs and register.egs)
 * 12 creating routes for login and register
 * 13 render login and register
 * 14 creating HTML in register page and change method='POST'
 * 15 creating HTML in login page and change method='POST'
 * 16 creating form
 * 17 add link to login page and vice versa
 * 18 implementing POST method for register (add.post())
 * 19 app.use(express.urlencoded({extended: false})) (it takes out forms (password, email) and building accses them inside variable our post method)
 * 20 creating a variable to store our users inside our variable insted of database (dont do this in production)
 * 21 istall bcrypt for hashing our passwords
 * 22 npm i bcrypt (for secure)
 * 23  creating const bcrypte
 * 24 creating a new user with crak-hash password
 * 25 creating an async function to use  try-catch method
 * 26 creating const hashPassword with bcrypt
 * 27 push users and creating unicly id for user with Date.now().toString()
 * 28 name: req.body.name
 * 29 email: req.body.email
 * 30 password: hashedPassword
 * 31 redirect user with th account they just registered (res.redirect('/login'))
 * 32 catch failer then redirect them back to register with res.redirect('/register')\
 * 33 console.log for checking user in terminal
 * 34 installing Passport is authentication middleware for Node.js
 * 35 go to other terminal and istall passport
 * 36 npm i passport passport-local express-session express-flash (just passport can be used for login through facebook google linkedn and so on but password-local only through email and password)
 * 37 express-session for storing and persist our users across different pages
 * 38 express-flash for display messages if we failed to login wich is used inside passport
 * 39 creating passport-config.js
 * 40 creating function for initializing passport
 * 41 inside server.js we require our passport through variable const initializePassport
 * 42 call it
 * 43 const passport (set variable for library we just instaled)
 * 44 const localStrategy = require('passport-local').Strategy
 * 45 passport.use for using new localStrategy with usesrnameField: 'email' and authenticateUser function
 * 46 authenticateUser takes in email, password and done
 * 47 passport.serializeUser(user, done) =>  to store inside our session
 * 48 passport.deserializeUser(id, done) =>  we gonna serialize our user as a single id
 * 49 get userByEmail(email) in authenticateUser function (const user =..) it will return email if user exists and null if not
 * 50 check user with if statment (user == null){return done(1st case null (if there is an error), no user then false,{ message: 'no user with this email})}
 * 51 check if we have a user and password matches the password in authenticateUser function
 * 52 const bcrypt = require('bcrypt)
 * 53 try,catch after return in initialize
 * 54 we are using if statment to check if( await bcrypt.compare(password, and compare to the user.password)) and if that return true we have an authenticated user
 * 55 first check bad case with no authentication else{done: null, false, message: 'password incorrect}
 * 56 good case when we have user and want authenticate it return done(null, user)
 * 57 catch (e){return done(e)}  dont use null because we have error with application
 * 58 pass getUserByEmail into initialize function
 * 59 express this function module.export = initialize
 * 60 back to server.js
 * 61 initializePassport we add into it email ()=>{ return users.find(user => user.email === email)}  for finding user based on email
 * 62 begin passport configuring
 * 63 app.use(flash())
 * 64 require flash in variable
 * 65 require session const session = require('express-session')
 * 66 app.use(session(){secret:process.env.SESSION_SECRET}          a key to keep in secret all inforamtion for us
 * 67 GO TO .env file and write this SESSION_SECRET=secret or what you want
 * 68 load in our enviroment variables and set them in process.env
 * 69 at the top of our application if(process.env.NODE_ENW !== 'production' (that means the we are in development){require('dotenv').config()})
 * 70 resave: false ( for saving our session variables if nothing is changed)
 * 71 saveUninitialized: false ( for saving empty value in a session if there is not value)
 * 72 app.use(passport.initialize())  set up passport
 * 73 app.use(passport.session())  to store variable to be persistent across intire session our user has which gonna work with app.use(passport.session)
 * 74 app.post('/login', passport.authenticate('local',{successRedirect: '/', failureRedirect: '/login', failureFlash: true (to show error message)}))
 * 75 go to login.egs for displaying error messages
 * 76 <% if (messages.error) { %> <%= messages.error %> <% } %>
 * 77 implementing our serializeUser and deserializeUser
 * 78 for serializeUser  done(null, user.id)
 * 79 for deserializeUser  done(null, getUserById(id))
 * 80 pass getUserById in initialize
 * 81 go to our server.js and add function id => users.find(user => user.id === id)
 * 82 protecting all different routes
 * 83 creating a function checkAuthenticated which takes req and res next
 * 84 check if the user authentificated with if statment
 * 85 if(req.isAuthenticated() (return true or false if the user is authenticated)){ return next()(all warking good) res.redirect('/login')(if there is some error)}
 * 86 take checkAuthenticated function and put it in app.get before actual function
 * 87 creating a function checkNotAuthenticated which takes req and res next
 * 88 if (req.isAuthenticated()){return res.redirect('/')} next()
 * 89 take checkNotAuthenticated function and put it in app.get('/login'), app.post('/login'), app.get('/register'),  app.post('/register')
 * 90 loging user out
 * 91 app.delete('/logout', req, res =>{req.logOut(), res.redirect('/login')}) to use delete we have to install library
 * 92 npm i method-override
 * 93 const methodOverride = require('method-override)
 * 94 app.use(methodOverride('_method'))
 * 95 go to index.egs and making logout form
 * 96 <form action="/logout?_method=DELETE" method="POST"> <button type="submit">Log out</button> </form>   delete method istead POST method
 */
