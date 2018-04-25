const  {MongoClient, ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log('Unable to connect to mongodb server')
    }
    console.log('Connected to mongodb server');
    //get all todos
    db.collection('Todos').find().toArray().then((docs)=>{
        console.log("Todos");
        console.log(JSON.stringify(docs, undefined,2));
    },(err)=>{
        console.log('Unable to fetch todos' , err);
    });
    //get completed todos
    db.collection('Todos').find({ completed: true}).toArray().then((docs)=>{
        console.log('Completed Todos');
        console.log(JSON.stringify(docs, undefined,2));
    },(err)=>{
        console.log('Unable to get completed todos ', err);
    });
    //get todo by _id
    db.collection('Todos').find({ _id: new ObjectID('5ae0b4108d06c02bfca31aa3') }).toArray().then((doc)=>{
        console.log("Get Todo By Id");
        console.log(JSON.stringify(doc, undefined, 2));
    },(err)=>{
        console.log('No todo found with that id ', err);
    });
    //close db in ther server
    //db.close();
});