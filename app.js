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

// connecting mongoDB through mongoose
mongoose
    .connect(db,{useNewUrlParser: true})
    .then(()=> console.log("MongoDB connected"))
    .catch(err=>console.log(err));

// // importing the product routes in the app.js
// const productRoutes=require('./api/routes/product');

// // importing the order routes in the app.js
// const orderRoutes=require('./api/routes/order');

// // importing user router
// const userRoutes=require('./api/routes/user');
// // using morgan for the logging of the get and post request 
// app.use(morgan('dev'));
// // using app for products routes

// // using body-parser
// app.use(bodyParser.urlencoded({extendend:false}));
// app.use(bodyParser.json());
// app.use('/uploads', express.static('uploads'));

// app.use('/products', productRoutes);
// // using app for the orders routes
// app.use('/orders', orderRoutes);
// // getting the user routes
// app.use('/user', userRoutes);


// // request for the error
// app.use((req, res, next)=>{
//     const error= new Error("Not Found");
//     error.status=404;
//     next(error);
// });

// // next function for handeling the above error
// app.use((error, req, res, next)=>{
//     res.status(error.status || 500);
//     res.json({
//         error:{
//             message: error.message
//         }
//     });
// });
app.get("/",(req, res)=>{
    res.send("Hello !!");
});
module.exports=app;