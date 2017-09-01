var crypto = require("crypto");
var user = require('../models/user');
var author = require('../models/author');
var story = require('../models/story');
var UserModel = new user();

exports.create = function(req, res) {

  if(req.method.toLowerCase() != "post") {
    res.render("new.ejs", {layout: false});
  }
  else {
     new user(req.body).save();
     res.render("login.ejs");
  }

}

exports.getUsers = function(req, res) {
 user.getUser(function(err,users)
{
  if (err)
   {
    throw err;
  }
  res.json(users)
});
}

exports.login = function(req, res) {

  if(req.method.toLowerCase() != "post") {
    res.render("login.ejs", {layout: false});
  }
  else {
    user.findOne({email: req.body.email}, function(err, result) {
       if(err) console.log(err);

         if(result == null) {
           res.send('invalid username', 
		    {'Content-type' : 'text/plain'}, 
                    403);
         }
	 else {
           auth(result);
         }
    });

    function auth( userRes ) {
      if(!UserModel.encrypt(req.body.psw) == userRes.password) {
         res.send('invalid password', 
		  {'Content-type' : 'text/plain'}, 
                  403);
      } else {
         console.log(userRes._id);
         user.update({_id : userRes._id}, {'$set' : {token : Date.now}});
         res.send(userRes);
      }
    }
  }
}