const {Todo}= require('./../../models/todo');
const {User}=require('./../../models/user');
const {ObjectID} =require('mongodb');
const jwt=require('jsonwebtoken');

const userOneId=new ObjectID();
const userTwoId=new ObjectID();
//add seed data for todos
const todos=[
    {
        _id: new ObjectID(),
        text:"First Todo",
        completed:true,
        completedAt: 333,
        _creator: userOneId
    },{
        _id: new ObjectID(),
        text:"Second Todo",
        _creator:userTwoId
    }
];

//add seed data for user

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
        password:'userTwoPass',
        tokens:[{
            access:'auth',
            token:jwt.sign({_id:userTwoId,access:'auth'}, '123abc').toString()
        }]
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