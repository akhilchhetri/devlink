const Validator = require('validator');
const isEmpty= require('./isempty');

module.exports= function validateLoginInput(data){
    let errors={};
    console.log(data.name);
    data.name= isEmpty? data.name: '';
    data.email = isEmpty? data.email: '';


    if(!Validator.isEmail(data.email)){
        errors.email="email is Invalid";
    }
    
    if(Validator.isEmpty(data.email)){
        errors.email="Email field is required";
    }
    if(Validator.isEmpty(data.password)){
        errors.password="Password is required";
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    };
};