const  {MongoClient, ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log('Unable to connect to mongodb server')
    }
    console.log('Connected to mongodb server');
    //findOneAndUpdate
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5ae0c55a8d86146bafe8f231')
    },{
        $set:{
            completed: false
        }
    },{
        returnOriginal: false
    }).then((result)=>{
        console.log(result);
    });
    //close db in ther server
    //db.close();
});