const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');

const _=require('lodash');

const UserSchema=new mongoose.Schema(
    {
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
    },
    { usePushEach: true }
);

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
  
    return _.pick(userObject, ['_id', 'email']);
  };
  
  // Instance methods
  UserSchema.methods.generateAuthToken = function () {
    var user = this; // individual document
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(),access},'123abc').toString();
  
    user.tokens.push({access, token});
  
    return user.save().then(() => {
      return token; // We can chain a promise to this return
    });
  };
  
const User= mongoose.model('User',UserSchema);

module.exports={User};