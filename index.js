var express = require('express');
var app = express();
var request = require('request');
var User = require('./user');
app.set('port', (process.env.PORT || 5001));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var mongoose = require('mongoose');
Promise = require('bluebird');
Promise.promisifyAll(mongoose);
// Connection URL
var url = 'mongodb://nivedha:password@ds145100-a0.mlab.com:45100,ds145100-a1.mlab.com:45100/smartwomen?replicaSet=rs-ds145100'
// Use connect method to connect to the Server
app.get('/', function(req, res) {
  console.log('app running successfully')
});
app.get('/createuser',function(req,res){
mongoose.connect(url, function() {

          var newUser = User({
            name: req.query.name,
            username: req.query.name,
            password: req.query.password,
          });
          // save the user
          newUser.save(function(err) {
            if (err) throw err;
            else{
            console.log('User created!');
            res.send("created");
          }
              mongoose.connection.close();
          });// The collection exists
});
});
