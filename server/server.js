require('./config/config');
const express= require('express');
const bodyParser=require('body-parser');
const {ObjectID} =require('mongodb');
const _=require('lodash');

const {mongoose}= require('./db/mongoose');
const {Todo}= require('./models/todo');
const {User}= require('./models/user');
const {authenticate}=require('./middleware/authenticate');

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
     // allow only a subset of User model to be accessible by a user
    var body = _.pick(req.body, ['email', 'password']);

    // create a new User model
    var user = new User(body);
    // save the new model to the DB
   user.save().then(()=>{
        return user.generateAuthToken();
   }).then((token)=>{
        res.header("x-auth",token).send(user);
   }).catch((e)=>{
       res.status(400).send(e);
   })
});

//get authorized user only
app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
});

//Login url
app.post('/users/login',(req,res)=>{
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header("x-auth",token).send(user);
        });
    }).catch((e)=>{
        res.status(400).send();
    });
});
//logout url
app.delete('/users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    },()=>{
        res.status(400).send();
    });
});
app.listen(port,()=>{
    console.log(`Started up on port ${port}`);
});

module.exports={app};






