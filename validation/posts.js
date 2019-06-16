const Validator = require('validator');
const isEmpty= require('./isempty');

module.exports= function validatePostInput(data){
    let errors={};
    console.log(data.text);
    data.text= isEmpty? data.text: '';
    
    if(Validator.isEmpty(data.text)){
        errors.text="Text field is required";
    }
    if(!Validator.isLength(data.text,{min:10, max: 200})){
        errors.text= "Post must be between 10-200 characters";
    }

    
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
