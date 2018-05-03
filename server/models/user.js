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
    const user = this;
    const userObject = user.toObject();
  
    return _.pick(userObject, ['_id', 'email']);
  };
  
  // Instance methods
  UserSchema.methods.generateAuthToken = function () {
    const user = this; // individual document
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(),access},'123abc').toString();
  
    user.tokens.push({access, token});
  
    return user.save().then(() => {
      return token; // We can chain a promise to this return
    });
  };

  //Model method
  UserSchema.statics.findByToken =function(token){
    var User=this;
    var decoded;

    //handle jwt verify error
    try{
        decoded=jwt.verify(token,'123abc');
    }catch(e){
        return Promise.reject();
    }
    return User.findOne({
        _id:decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
  };
  
const User= mongoose.model('User',UserSchema);

module.exports={User};