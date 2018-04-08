const fs = require("fs");
const express = require("express");
const path = require("path");
var app = express();
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname,"/static/html/home.html"));
   // res.sendFile(path.join(__dirname+ "/static/html/index.html"));
});
app.get("/login", function(req, res){
    res.sendFile(path.join(__dirname, "/static/html/login.html"));
});
app.get("/search", function(req, res){
    res.sendFile(path.join(__dirname, "/static/html/search.html"));
});
app.get("/lot", function(req, res){
    res.sendFile(path.join(__dirname, "/static/html/lot.html"));
});
app.get("/newLot", function(req, res){
    res.sendFile(path.join(__dirname, "/static/html/newLot.html"));
})
app.use("/static", express.static(path.join(__dirname, "/static")));
app.listen(8082);