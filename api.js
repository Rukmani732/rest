var express=require('express');
var app=express();
var port=process.env.PORT || 8700;
var bodyparser=require('body-parser');
var mongo=require('mongodb');
var MongoClient=mongo.MongoClient
var mongourl="mongodb+srv://admin:J7spXgYc9B9zXTCB@cluster0.3dlqr.mongodb.net/edurekaintern?retryWrites=true&w=majority";
var cors=require('cors');
var db;

app.use(cors());
app.get('/',(req,res)=>{
    res.send(`<a href="http://localhost:8700/location" target="_blank">City</a> <br/> <a href="http://localhost:8700/mealtype" target="_blank">Mealtype</a> <br/> <a href="http://localhost:8700/restaurents" target="_blank">Restaurent</a> <br/> <a href="http://localhost:8700/cuisine" target="_blank">Cuisine</a>`)
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
app.get('/restaurents',(req,res) => {
    var condition = {};
    if(req.query.city && req.query.mealtype){
        condition = {city:req.query.city,"type.mealtype":req.query.mealtype}
    }
    else if(req.query.city){
        condition={city:req.query.city}
    } else if(req.query.mealtype){
        condition={"type.mealtype":req.query.mealtype}
    }
    else{
        condition={}
    }
    db.collection('restaurent').find(condition).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/cuisine',(req,res)=>{
    db.collection('cuisine').find({}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
});
app.get('/restaurantdetails/:id',(req,res) => {
    var query = {_id:req.params.id}
    db.collection('restaurent').find(query).toArray((err,result) => {
        res.send(result)
    })
});

//RestaurentList
app.get('/restaurantList/:mealtype',(req,res) => {
    var condition = {};
    if(req.query.cuisine){
        condition={"type.mealtype":req.params.mealtype,"Cuisine.cuisine":req.query.cuisine}
    }else if(req.query.city){
        condition={"type.mealtype":req.params.mealtype,city:req.query.city}
    }else if(req.query.lcost && req.query.hcost){
        condition={"type.mealtype":req.params.mealtype,cost:{$lt:Number(req.query.hcost),$gt:Number(req.query.lcost)}}
    }
    else{
        condition= {"type.mealtype":req.params.mealtype}
    }
    db.collection('restaurent').find(condition).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
});

//PlaceOrder
app.post('/placeorder',(req,res) => {
    console.log(req.body);
    db.collection('orders').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send('posted')
    })
});

//order
app.get('/orders',(req,res) => {
    db.collection('orders').find({}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
});

//Delete Orders
app.delete('/deleteorders',(req,res) => {
    db.collection('orders').remove({_id:req.body.id},(err,result) => {
        if(err) throw err;
        res.send('data deleted')
    })
})

//Update orders
app.put('/updateorders',(req,res) => {
    db.collection('orders').update({_id:req.body._id},
        {
            $set:{
                name:req.body.name,
                address:req.body.address
            }
        },(err,result) => {
            if(err) throw err;
            res.send('data updated')
        })
})



MongoClient.connect(mongourl,(err,connection)=>{
    if(err) throw err;
    db=connection.db('edurekaintern');
    app.listen(port,(err)=>{
        if(err) throw err;
        console.log(`Server is running on port ${port}`)
    })

})
