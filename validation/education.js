const Validator = require('validator');
const isEmpty= require('./isempty');

module.exports= function validateEducationInput(data){
    let errors={};
    console.log(data);
    // checking with customized isEmpty function
    console.log(data.school);
    data.school= isEmpty? data.school: '';
    data.degree = isEmpty? data.degree: '';
    data.fieldofstudy= isEmpty? data.fieldofstudy: '';
    data.from= isEmpty? data.from : '';

    if(Validator.isEmpty(data.school)){
        errors.school="School field is required";
    }
    if(Validator.isEmpty(data.degree)){
        errors.degree="Degree field is required"; 
    }
    if(Validator.isEmpty(data.fieldofstudy)){
        errors.fieldofstudy="field of study is required";
    }
    
    if(Validator.isEmpty(data.from)){
        errors.from="From date field is required";
    }
    
    
    return {
        errors,
        isValid: isEmpty(errors)
    };
};