const Validator = require('validator');
const isEmpty= require('./isempty');

module.exports= function validateRegisterInput(data){
    let errors={};
    console.log(data.name);
    data.name= isEmpty? data.name: '';
    data.email = isEmpty? data.email: '';
    data.password= isEmpty? data.password: '';
    data.password2= isEmpty? data.password2: '';
    if(!Validator.isLength(data.name, {min:2, max: 30})){
        errors.name= "Name must be between 2 and 30 characters";
    }
    if(Validator.isEmpty(data.name)){
        errors.name="Name is required";
    }


    if(Validator.isEmpty(data.email)){
        errors.email="Email field is required";
    }
    if(!Validator.isEmail(data.email)){
        errors.email="email is Invalid";
    }
    if(Validator.isEmpty(data.password)){
        errors.password="Password is required";
    }
    if(!Validator.isLength(data.password, {min:6, max: 10})){
        errors.password= "Password should be atleast 6 characters long";
    }
    if(Validator.isEmpty(data.password2)){
        errors.password2="Confirm password field is required";
    }

    if(!Validator.equals(data.password, data.password2)){
        errors.password2="Passwords must match";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};