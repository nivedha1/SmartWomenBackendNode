var express = require('express');
var app = express();
var request = require('request');
var User = require('./user');
app.set('port', (process.env.PORT || 5000));


var mongoose = require('mongoose');
Promise = require('bluebird');
Promise.promisifyAll(mongoose);
// Connection URL
var url = 'mongodb://nivedha:password@ds145100-a0.mlab.com:45100,ds145100-a1.mlab.com:45100/smartwomen?replicaSet=rs-ds145100'
// Use connect method to connect to the Server


mongoose.connect(url, function() {

          var newUser = User({
            name: 'Peter Quill12',
            username: 'starlord5512',
            password: 'password12',
            admin: true
          });
          // save the user
          newUser.save(function(err) {
            if (err) throw err;

            console.log('User created!');
              mongoose.connection.close();
          });// The collection exists





});
