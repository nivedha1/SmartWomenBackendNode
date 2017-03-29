var express = require('express');
var app = express();
var request = require('request');
var User = require('./user');
var PhoneNo = require('./phoneno');
var parser = require('xml2json');
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
app.get('/createuser', function(req, res) {
    mongoose.connect(url, function() {
        User.find({
                'username': req.query.username
            }, function(err, docs) {
              if(err!=null)
              {
                console.log(err);
                mongoose.connection.close();
                res.send("failure");
              }else if (docs.length == 0) {
                    var newUser = User({
                        name: req.query.name,
                        username: req.query.username,
                        password: req.query.password,
                    });
                    newUser.save(function(err) {
                        if (err!=null) {
                          console.log(err);
                          mongoose.connection.close();
                          res.send("failure");
                        }
                        else {
                            console.log('User created!');
                            mongoose.connection.close();
                            res.send("success");
                        }
                    });
                } else if(docs.length>0){
                  console.log('User not created!');
                    mongoose.connection.close();
                    res.send("failure");
                }
            });
    });
});

app.get('/login', function(req, res) {
    mongoose.connect(url, function() {
        if (User.find({
                username: req.query.username,
                password: req.query.password
            }, function(err, docs) {
              if(err!=null)
              {
                console.log(err);
                  mongoose.connection.close();
                res.send("failure");
              }else if (docs.length == 0) {
                    console.log('Username doest exists!');
                    mongoose.connection.close();
                    res.send("failure");
                } else if(docs.length>0){
                    console.log('Username exists!');
                    mongoose.connection.close();
                    res.send("success");
                }
            }));
    });
});

app.get('/health',function(req,res){
    var options = {
        url: 'https://wsearch.nlm.nih.gov/ws/query?db=healthTopics&rettype=topic&term=full-summary:'+req.query.term,
        method: 'GET',
        headers: {
            'Authorization': 'fc8c108f9833af20c8468722d4577692',
        },
      };
    request(options, function(err,response,body) {


  var xml = body;
  var json = parser.toJson(xml); //returns a string containing the JSON structure by default
  var htmlToText = require('html-to-text');

  var text = htmlToText.fromString(JSON.parse(json).nlmSearchResult.list.document[0].content['health-topic']['full-summary'], {
      wordwrap: 130
  });
  res.send(text);

});
  });

app.get('/addphoneno', function(req, res) {
    mongoose.connect(url, function() {
        var phoneNos = PhoneNo({
            name: req.query.name,
            daycare_no: req.query.daycareno,
            forward_no: req.query.forwardno,
            lateforward_no: req.query.lateforwardno,
            meeting_time: req.query.meetingtime
        });
        // save the user
        phoneNos.save(function(err) {
            if (err) throw err;
            else {
                console.log('Phone nos saved');
                res.send("created");
            }
            mongoose.connection.close();
        }); // The collection exists
    });
});
