const {mongoose}= require('./../server/db/mongoose');
const {Todo}= require('./../server/models/todo');

const id ='5ae1bf54154d72b406e98d95';

Todo.find({
    _id:id
}).then((todos)=>{
    console.log("Todos",todos);
});

Todo.findOne({
    _id:id
}).then((todo)=>{
    console.log("Todo",todo);
});

Todo.findById(id).then((todoById)=>{
    console.log("Todo",todoById);
});