if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}
var MongoClient = require('mongodb').MongoClient;
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const bodyParser= require("body-parser");
const importExcel = require('convert-excel-to-json');
const methodOverride = require("method-override");
const mysql = require('mysql2');
const mongoose = require('mongoose');
var async = require("async");

const app = express();
app.use(methodOverride("_method"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload({
    useTempFiles : true,
}));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb+srv://admin:XZGo5ZDZOjB7E4k9@cluster0.nzyfc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true});
var url = "mongodb+srv://admin:XZGo5ZDZOjB7E4k9@cluster0.nzyfc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const tableSchema = {
  Name: String,
  Roll_no: String,
  Class: String
};
const Table = mongoose.model("Table", tableSchema);



app.get('/', (req, res) => {
    res.render("index");
});

app.post('/', (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    console.log(req.files)

    // Accessing the file by the <input> File name="target_file"
    let targetFile = req.files.target_file;
    //mv(path, CB function(err))
    
    targetFile.mv(path.join(__dirname, "uploads", targetFile.name),  (err) => {
        if (err){
          return res.status(500).send(err);
        } else {
          let result = importExcel({
            sourceFile: path.join(__dirname, "uploads", targetFile.name),
            header: {rows: 1},
            columnToKey: {A: 'Name', B: 'Roll_no', C: 'Class'},
            sheets: ['Sheet1']
          });



          var data = [];
          

          

          console.log(result)
  //         const row =  new Table({
  //   Name: result.Sheet1[0].Name,
  //   Roll_no: result.Sheet1[0].Roll_no,
  //   Class: result.Sheet1[0].Class
  // });



  // row.save(function(err){
  //   if (!err){
  //       console.log(err)
  //   }
  // });
          for (var i = 0; i < result.Sheet1.length; i++){
            var row = new Table({Name: result.Sheet1[i].Name,
    Roll_no: result.Sheet1[i].Roll_no,
    Class: result.Sheet1[i].Class})

    row.save(function(err){
    if (!err){
        
    }
    console.log("done")
  });
          }
          
          res.redirect("/table");
          }
      });
    

});

app.get("/table", (req, res) => {
  // var query2 = 'SELECT * FROM students';
  // db.query(query2, function (err, data, fields) {
  // if (err) throw err;
  Table.find({}, function(err, data){
    
  res.render("table", {userData: data})
  
  });
})

app.post("/table", (req, res) => {
  var name = req.body.Name;
  var roll_no = req.body.Roll_no;
  // var query3 = 'SELECT * FROM students WHERE Name = ? && Roll_no = ?';
  // db.query(query3, [name, roll_no], function (err, data, fields) {
  // if (err) throw err;
  Table.find({Name: name, roll_no: roll_no}, function(err, data){
    res.render("table", {userData: data})
    console.log(data);
  })
  
  });


// app.put("/table", (req, res) => {
//   var roll_no = req.body.Roll_no;
//   var query4 = 'SELECT * FROM students WHERE Roll_no = ?';
//   db.query(query4, [roll_no], function (err, data, fields) {
//   if (err) throw err;
//   res.render("table", {userData: data})
//   console.log(data);
//   });
// })


const port = process.env.PORT ||3000
app.listen(port, () => console.log('Your app listening on port 3000'));
