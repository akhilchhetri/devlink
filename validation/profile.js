const Validator = require('validator');
const isEmpty= require('./isempty');

module.exports= function validateProfileInput(data){
    let errors={};
    console.log(typeof(data.skills));
    console.log(data.handle);
    handle= data.handle;
    data.handle= isEmpty? data.handle: '';
    data.skills = isEmpty? data.skills: '';
    data.status= isEmpty? data.status: '';
    // data.bio= isEmpty? data.bio: '';

    if(!Validator.isLength(data.handle,{min:2, max:40} )){
        errors.handle="Handle needs to be within 2 and 40";
    }
    if(Validator.isEmpty(data.handle)){
        errors.handle="Profile handle is required";
    }
    if(Validator.isEmpty(data.status)){
        errors.status="Status is required";
    }
    if(Validator.isEmpty(data.skills)){
        errors.skills="Skills are required";
    }
    if(!isEmpty(data.website)){
        if(!Validator.isURL(data.website)){
            errors.website="Not a valid URL";
        }
    }
    if(!isEmpty(data.youtube)){
        if(!Validator.isURL(data.youtube)){
            errors.youtube="Not a valid URL";
        }
    }
    if(!isEmpty(data.facebook)){
        if(!Validator.isURL(data.facebook)){
            errors.facebook="Not a valid URL";
        }
    }
    if(!isEmpty(data.twitter)){
        if(!Validator.isURL(data.twitter)){
            errors.twitter="Not a valid URL";
        }
    }
    if(!isEmpty(data.linkedin)){
        if(!Validator.isURL(data.linkedin)){
            errors.linkedin="Not a valid URL";
        }
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    };
};