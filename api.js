var express=require('express');
var app=express();
var port=8700;
var bodyparser=require('body-parser');
var mongo=require('mongodb');
var MongoClient=mongo.MongoClient
var mongourl="mongodb+srv://admin:J7spXgYc9B9zXTCB@cluster0.3dlqr.mongodb.net/edurekaintern?retryWrites=true&w=majority";
var cors=require('cors');
var db;

app.use(cors());
app.get('/',(req,res)=>{
    res.send(`<a href="http://localhost:8700/location" target="_blank">City</a> <br/> <a href="http://localhost:8700/mealtype" target="_blank">Mealtype</a> <br/> <a href="http://localhost:8700/restaurent" target="_blank">Restaurent</a> <br/> <a href="http://localhost:8700/cuisine" target="_blank">Cuisine</a>`)
});

app.get('/location',(req,res)=>{
    db.collection('city').find({}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
});
app.get('/mealtype',(req,res)=>{
    db.collection('mealtype').find({}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
});
app.get('/restaurent',(req,res)=>{
    var query={};
    if(req.query.city){
        query={city:req.query.city}
    }else{
        query={}
    }
    db.collection('restaurent').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
});

app.get('/cuisine',(req,res)=>{
    db.collection('cuisine').find({}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
});



MongoClient.connect(mongourl,(err,connection)=>{
    if(err) throw err;
    db=connection.db('edurekaintern');
    app.listen(port,(err)=>{
        if(err) throw err;
        console.log(`Server is running on port ${port}`)
    })

})