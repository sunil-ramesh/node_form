const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer  = require('multer');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const methodOverride = require('method-override');
var users = require('./controllers/users_controller.js');
var password = require('./controllers/forgot_password_controller.js');

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/userdb', {useMongoClient: true});
var db = mongoose.connection;

app.set('view engine', 'ejs');
app.use(bodyParser.json())
app.use(cookieParser());
app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.urlencoded())
app.use(methodOverride());

app.get('/users/create', users.create);
app.get('/users', users.getUsers);
app.post('/users/create', users.create);
app.get('/users/login', users.login);
app.post('/users/login', users.login);
app.get('/forgot/password', password.create);
app.post('/forgot/password', password.forgotPassword);
app.get('/reset/:token', password.reset);
app.post('/reset/:token', password.set);


app.get("/users/index", function(req,res){
  if(!req.session.user){
    res.render('login');
  }
  res.render('index')
});

app.get("/about", function(req,res){
 res.render("about")
});

app.get('/logout',function(req,res){

req.session.destroy(function(err){
if(err){
console.log(err);
}
else
{
res.render('login');
}
});
})

app.listen(3001,function(){
    console.log('server running on 3001')
})