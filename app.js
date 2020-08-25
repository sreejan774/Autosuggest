const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();
const day = date.getDate();

let removeId = "";
let updateId = "";
let searchResult ;
let path = false;

app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

//-------------------------- database ---------------------------

mongoose.connect("mongodb://localhost:27017/contactsDB",{ useNewUrlParser: true , useUnifiedTopology: true , useFindAndModify: false});

const contactSchema = new mongoose.Schema ({
  name: String,
  number: Number,
  email: String
});

const Contact = mongoose.model("Contact",contactSchema);

//---------------------get requests ----------------------------
app.get("/", function(req,res){

  Contact.find({},function(err,foundContacts){
    if(err){
      console.log(err);
    }else{
      res.render("contactList", {listTitle: day, newContactList : foundContacts,searchResult: searchResult,path: path});
    }
  });
});

app.get("/add",function(req,res){
  res.render("add",{listTitle: day});
});

app.get("/remove",function(req,res){
  res.render("remove",{id: removeId});
});

app.get("/update",function(req,res){
  Contact.findById(updateId, function(err,result){
    if(err){
      console.log(err);
    }else{
      let updateContact ={
        id: updateId,
        name : result.name,
        email : result.email,
        number :result.number
      }
      res.render("update",{contact : updateContact, listTitle: day});
    }
  });
});

//--------------------- post requests ----------------------------
app.post("/",function(req,res){
 var route =  req.body.route;
 if(route==="add"){
   res.redirect("/"+route);
 }else{
    let length = route.length;
    if(route.slice(0,6)==="remove"){
      removeId = route.slice(7,length)
    }
    else{
      updateId = route.slice(7,length)
    }
    res.redirect("/"+route.slice(0,6));
 }
});

app.post("/search", function(req,res){
  Contact.find({ name: req.body.search},function(err,result){
    if(!err){
      path= true;
      searchResult = result;
      res.redirect("/");
    }
  });
});

app.post("/remove",function(req,res){
  //console.log(req.body);
  if(req.body.button === "No"){
    path = false;
    res.redirect("/");
  }
  else{
    const id = req.body.button;
    Contact.findByIdAndRemove(id , function(err){
      if(!err){
        path = false;
        res.redirect("/");
      }
    });
  }
});

app.post("/update",function(req,res){
  const id = req.body.button ;
  Contact.findByIdAndUpdate(id, { name: req.body.name , number: req.body.number , email: req.body.email }, function(err){
    if(!err){
      path = false;
      res.render("success", {action: "updated"});
    }
  });
});

app.post("/add",function(req,res){
    const newContact = new Contact({
      name: req.body.name,
      number: req.body.number,
      email: req.body.email
    });
    newContact.save(function(err){
      if(err){
        res.render("failure", {});
      }
      else{
        res.render("success",{action : "added"});
      }
    });
});

app.post("/success",function(req,res){
  path = false;
  res.redirect("/");
});

app.listen(3000,function(){
  console.log("server started at port 3000");
});
