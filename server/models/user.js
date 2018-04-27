const mongoose=require('mongoose');
const validator=require('validator');
const User= mongoose.model('User',{
    email:{
        type:String,
        minlength: 1,
        required:true,
        trim: true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'{VALUE} is not a valide email'
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

module.exports={User};