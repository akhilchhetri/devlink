// importing express and setting app
const express = require('express');
const app=express();
// importing morgan which keeps the server logs on each request and response
const morgan=require('morgan');
// importing body-parser to parse the body contents
const bodyParser= require('body-parser');

// importing mongoose package to connect with mongoDB database
const mongoose= require('mongoose');

// importing keys
const db= require('./config/keys').mongoURI;

const User= require('./model/User');
// import passport
const passport= require('passport');
// using passport middleware
app.use(passport.initialize());

// connecting mongoDB through mongoose
mongoose
    .connect(db,{useNewUrlParser: true})
    .then(()=> console.log("MongoDB connected"))
    .catch(err=>console.log(err));


require('./model/User');

// passport config
require('./config/passport')(passport);

// // using body-parser middleware
app.use(bodyParser.urlencoded({extendend:false}));
app.use(bodyParser.json());

// importing routes for users
const users= require("./routes/api/users");
// importing profile route
const profile= require("./routes/api/profile");
// importing posts route
const posts= require("./routes/api/posts");
// use routes
app.use('/api/posts', posts);
app.use('/api/users', users);
app.use('/api/profile', profile);


app.get("/",(req, res)=>{
    res.send("Hello !!");
});
// request for the error
app.use((req, res, next)=>{
    const error= new Error("Not Found");
    error.status=404;
    next(error);
});

// next function for handeling the above error
app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});
module.exports=app;