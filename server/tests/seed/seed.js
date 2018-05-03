const {Todo}= require('./../../models/todo');
const {User}=require('./../../models/user');
const {ObjectID} =require('mongodb');
const jwt=require('jsonwebtoken');
//add seed data for todos
const todos=[
    {
        _id: new ObjectID(),
        text:"First Todo",
        completed:true,
        completedAt: 333
    },{
        _id: new ObjectID(),
        text:"Second Todo"
    }
];

//add seed data for user
const userOneId=new ObjectID();
const userTwoId=new ObjectID();
const users=[
    {
        _id:userOneId,
        email:'abel@gmail.com',
        password:'userOnePass',
        tokens:[{
            access:'auth',
            token:jwt.sign({_id:userOneId,access:'auth'}, '123abc').toString()
        }]
    },{
        _id:userTwoId,
        email:'ken@gmail.com',
        password:'userTwoPass'
    }
];


const seedTodos=(done)=>{
    Todo.remove({}).then(()=> {
        return Todo.insertMany(todos)
    }).then(()=>done());
};

const seedUsers=(done)=>{
    User.remove({}).then(()=>{
        const userOne=new User(users[0]).save();
        const userTwo=new User(users[1]).save();

        return Promise.all([userOne,userTwo]);
    }).then(()=> done());
}

module.exports={todos,seedTodos, users,seedUsers};