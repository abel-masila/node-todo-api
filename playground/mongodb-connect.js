//const MongoClient=require('mongodb').MongoClient;
const  {MongoClient, ObjectID}=require('mongodb');

//const obj=new ObjectID();

//console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log('Unable to connect to mongodb server')
    }
    console.log('Connected to mongodb server');
    // db.collection('Todos').insertOne({
    //     text:'New todo',
    //     completed: false
    // },(err, result)=>{
    //     if(err){
    //         return console.log("Unable to insert todo ", err);
    //     }
    //     console.log(JSON.stringify(result.ops,undefined,2));
    // });
    // db.collection('Users').insertOne({
    //     name:'Abel Masila',
    //     age: 25,
    //     location: 'Nairobi'
    // },(err,result)=>{
    //     if(err){
    //         return console.log('Unable to insert user ', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined,2));
    // });
    //close db in ther server
    db.close();
});