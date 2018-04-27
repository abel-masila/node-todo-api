require('./config/config');
const express= require('express');
const bodyParser=require('body-parser');
const {ObjectID} =require('mongodb');
const _=require('lodash');

const {mongoose}= require('./db/mongoose');
const {Todo}= require('./models/todo');
const {User}= require('./models/user');

const app =express();

 const port=process.env.PORT;;

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    const todo=new Todo({
        text: req.body.text
    });
    todo.save().then((todo)=>{
        res.send(todo);
    }, (err)=>{
        res.status(400).send(err);
    });
});
app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    }, (e)=>{
        res.status(400).send(e);
    });
});
// GET /todos/1234
app.get('/todos/:id',(req,res)=>{
    const id=req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    },(err)=>{
        res.status(400).send();
    });
});
//DELETE /todos/1234
app.delete('/todos/:id',(req,res)=>{
    const id=req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            return res.status(404).send(); 
        }
        res.send({todo});
    }, (err)=>{
        res.status(400).send();
    });
});
//PATCH /todos/123
app.patch('/todos/:id', (req,res)=>{
    const id=req.params.id;
    const body=_.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt=new Date().getTime();
    } else {
        body.completed=false;
        body.completedAt=null;
    }
    Todo.findByIdAndUpdate(id, {$set: body},{new: true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(404).send();
    });
});


//POST /users
app.post('/users',(req,res)=>{
    var body=_.pick(req.body,['email','password']);
    const user=new User(body);
    user.save().then((user)=>{
        res.status(200).send({user});
    },(err)=>{
        res.status(404).send(err);
    });
});
app.listen(port,()=>{
    console.log(`Started up on port ${port}`);
});

module.exports={app};






