var express = require('express');
var app = express();
var request = require('request');
app.set('port', (process.env.PORT || 5000));


var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://nivedha:password@ds145100-a0.mlab.com:45100,ds145100-a1.mlab.com:45100/smartwomen?replicaSet=rs-ds145100'
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server"); 
  db.close();
});
