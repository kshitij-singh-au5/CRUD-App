var express = require("express")
var hbs = require("hbs")
var bodyParser = require("body-parser")
const mongodb = require("mongodb")

var app = express()

app.set("view engine", "hbs")
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))

var url = "mongodb://localhost:27017"
var dbName = "CRUD"
var DB = ""

mongodb.MongoClient.connect(url, function (err, client) {
    if (err) {
        console.log(err)
    }
    else {
        DB = client.db(dbName)
    }
})

app.get("/", function (req, res) {
    DB.collection("users").find({}).toArray(function (err, result) {
        if (err) {
            console.log(err)
        }
        else {
            res.render("home", { 
                users: result,
                updated: req.query.updated,
                deleted: req.query.deleted,
                alreadyexist: req.query.alreadyexist
            })
        }
    })

})




app.post("/adduser", function (req, res) {
    var data = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username
    }
    DB.collection("users").findOne({email:req.body.email},function(err,result){
        if(result==null){
            DB.collection("users").insertOne(data, function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.redirect("/")
                }
            })
        }
        else{
            res.redirect("/?alreadyexist=true")
        }
    })
    

    
})

app.post("/edituser", function (req, res) {
    var id = mongodb.ObjectID(req.body.id)
    var data = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email

    }
    DB.collection("users").updateOne({_id:id},{$set:data},function (err,result) {
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/?updated=true")
        }
    })
})

app.post("/deleteuser", function (req, res) {
    var id = mongodb.ObjectID(req.body.id)
    //console.log(req.body)
    DB.collection("users").deleteOne({_id:id}, function (err, result) {
        if (err) {
            console.log(err)
        }
        else {
            res.send({ url: "/?deleted=true" })
        }
    })
})
app.listen(process.env.PORT||4000);

