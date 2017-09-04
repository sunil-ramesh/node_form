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

var sess;
exports.login = function(req, res) {
  sess = req.session;
  if(req.method.toLowerCase() != "post" && !req.session.user )  {
    res.render("login.ejs", {layout: false});
  }
  else {
   users = user.findOne({email: req.body.uname}, function(err, result) {
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
      if(UserModel.encrypt(req.body.psw) != userRes.password) {
         res.send('invalid password', 
		  {'Content-type' : 'text/plain'}, 
                  403);
      } else {
         // console.log(userRes._id);
         req.session.user = userRes;
         user.update({_id : userRes._id}, {'$set' : {token : Date.now}});
         // res.send(userRes);
         res.redirect("index");
      }
    }
  }
}