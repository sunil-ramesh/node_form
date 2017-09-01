var crypto = require("crypto");
var user = require('../models/user');
var UserModel = new user();
var async = require('async');
var nodemailer = require('nodemailer');

exports.create = function(req, res) {
  res.render("forgot_password.ejs")
}

exports.forgotPassword = function(req, res) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      user.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.redirect('back');
        }
       console.log('step 1')
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; 

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
        console.log('step 2')
      var smtpTrans = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, 
         auth: {
          user: 'cb3swxri7iab6eqk@ethereal.email',
          pass: 'nZbA3pDtrnkwvdmw36'
        }
      });
      var mailOptions = {

        to: user.email,
        from: 'myemail',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'

      };
      console.log('step 3')
        smtpTrans.sendMail(mailOptions, function(err) {
        // req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        console.log('sent')
        res.redirect('/reset/:token');
});
}
  ], function(err) {
    console.log('this err' + ' ' + err)
    res.redirect('/forgot/password');
  });
};

let token
 exports.reset = function(req, res) {
  token = req.params.token
    user.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      return res.redirect('/forgot/password');
    }
    res.render("set_password.ejs")
  });
 }

 exports.set = function(req, res) {
    async.waterfall([
      function(done) {
        user.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user, next) {
          console.log(user)
          if (!user) {
          return res.redirect('back');
        }
        console.log(req.body.psw)
        user.password = req.body.psw;
        user.resetPasswordToken = "";
        user.resetPasswordExpires = "";
        console.log('password' + user.password  + 'and the user is' + user)

        user.save(function(err) {
          if (err) {
            // console.log(err)
            // return res.redirect('login.ejs');
          } else { 
            return res.redirect('login.ejs');
          }
        });
      });
      },





      function(user, done) {
        var smtpTrans = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, 
          auth: {
            user: 'cb3swxri7iab6eqk@ethereal.email',
            pass: 'nZbA3pDtrnkwvdmw36'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'myemail',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
          ' - This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTrans.sendMail(mailOptions, function(err) {
        // req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
      }
      ], function(err) {
        res.redirect('/');
      });
// });
}