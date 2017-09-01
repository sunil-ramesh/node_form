var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    crypto = require('crypto'),
    assert = require('assert');

var algorithm = 'aes256'; 
var key = 'D#$DF#QD#@~!W@E@';
var pw = '';

var userSchema = mongoose.Schema({
    ObjectId: ObjectId,
    username: String,
    email: String,
    password: String,
    first_name: String,
    last_name: String,
    resetPasswordToken: String,
    resetPasswordExpires: String
});

userSchema.methods.encrypt = function encrypt(str) {
  pw = str;
  var cipher = crypto.createCipher(algorithm, key);  
  var encrypted = cipher.update(pw, 'utf8', 'hex') + cipher.final('hex');
  console.log("ENCRYPTED: " + encrypted);
  return encrypted;
}

//password setter
userSchema.path('password').set(function(v) {
  return this.encrypt(v);
});


var User = module.exports = mongoose.model('User',userSchema);

module.exports.getUser = function(callback,limit){
    User.find(callback).limit(limit);
}
