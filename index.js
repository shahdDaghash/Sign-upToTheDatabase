var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const ejs = require('ejs');
var ObjectId = require('mongodb').ObjectID;
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect('mongodb+srv://userShahd:shahd@testcluster.vcl9u.mongodb.net/RecordDatabase',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

app.post("/sign_up",(req,res)=>{
    var name = req.body.name;
    var gender = req.body.gender;
    var address = req.body.address;
    var date = req.body.date;
    var email = req.body.email;

    var data = {
        "name": name,
        "gender": gender,
        "address": address,
        "date": date,
        "email" : email
    };

    db.collection('addedrecords').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    res.redirect("/");

})

const note = mongoose.model('AddedRecords', {
    name: String,
    gender: String,
    address: String,
    date: String,
    email: String
});


app.get("/",(req,res)=>{
    note.find({}, function(err, records){
        res.render('index', {
            recordsList: records
        });
    });
});


app.post("/del", (req, res)=>{
    db.collection('addedrecords').findOneAndDelete({}, {sort: {_id: -1}});
    res.redirect("/");
});

app.post("/cv", (req, res)=>{
    res.sendFile(__dirname+ "/cv.html");
});

app.post("/delAll", (req, res)=>{
    db.collection('addedrecords').deleteMany();
    res.redirect("/");
});


app.post("/check", (req, res)=>{
    var arr = req.param("checks");
    for (i = 0; i < arr.length; i++) {
        db.collection('addedrecords').deleteOne({_id: new ObjectId(arr[i])});
    } 
    res.redirect("/");
});

app.listen(4000, function(){
    console.log("Server is running");
});

let recordsToDelete = ["610647da7377904d7410b653", "60ffc4e4bcec554c0c3743f6"];

