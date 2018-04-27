const {ObjectID} =require('mongodb');

const {mongoose}= require('./../server/db/mongoose');
const {Todo}= require('./../server/models/todo');

// Todo.remove({}).then((res)=>{
//     console.log(res);
// });

Todo.findByIdAndRemove('5ae2e379eba6bb002750c6f5').then((todo)=>{
    console.log(todo);
});
// Todo.findOneAndRemove({_id:'5ae2e37aeba6bb002750c6f6'}).then((todo)=>{
//     console.log(todo);
// });




