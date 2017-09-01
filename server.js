const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer  = require('multer');
const methodOverride = require('method-override');
var users = require('./controllers/users_controller.js');
var password = require('./controllers/forgot_password_controller.js');

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/userdb', {useMongoClient: true});
var db = mongoose.connection;

app.set('view engine', 'ejs');
app.use(bodyParser.json())
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


app.listen(3001,function(){
    console.log('server running on 3001')
})