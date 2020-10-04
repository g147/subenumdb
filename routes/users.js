var express = require('express');
var passport = require('passport');
var Users = require('../models/user');
var Verify = require('./verify');

var userRouter = express.Router();

userRouter.route('/')
  .get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Users.find({}, function(err, users) {
      if (err) throw err;
      res.json(users);
    });
  });

userRouter.post('/register', function(req, res) {
  Users.register(new Users({
      username: req.body.username
    }),
    req.body.password,
    function(err, user) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
      if (req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if (req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      if (req.body.admin) {
        user.admin = req.body.admin;
      }
      user.save(function(err, user) {
        passport.authenticate('local')(req, res, function() {
          return res.status(200).json({
            status: 'registration successful'
          });
        });
      });
  });
});

userRouter.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'invalid user/password'
        });
      }

      var token = Verify.getToken(user);
      res.status(200).json({
        status: 'login successful',
        success: true,
        token: token
      });
    });
  })(req, res, next);
});

userRouter.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'logged out'
  });
});

module.exports = userRouter;