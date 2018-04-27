const mongoose=require('mongoose');
//tell mongoose to use promises instead of default callbacks
mongoose.Promise=global.Promise;
//connect to db
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

//export mongosoe
module.exports={mongoose};