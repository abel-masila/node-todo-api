const mongoose=require('mongoose');
//tell mongoose to use promises instead of default callbacks
mongoose.Promise=global.Promise;
//connect to db
mongoose.connect('mongodb://localhost:27017/TodoApp');

const Todo= mongoose.model('Todo',{
    text:{
        type:String
    },
    completed:{
        type: Boolean
    },
    completedAt:{
        type: Number
    }
});

//create one Todo
const nextTodo=new Todo({
    text:'Resume job',
    completed: false,
    completedAt: 0
});
nextTodo.save().then((doc)=>{
    console.log('Saved todo', JSON.stringify(doc, undefined,2));
}, (err)=>{
    console.log('Unable to save todo');
});


