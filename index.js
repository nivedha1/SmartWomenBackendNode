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

console.log(text)
  res.send(text);
});
  });

app.get('/addPhoneNos', function(req, res) {
    mongoose.connect(url, function() {
      var phoneNos ;
      if (PhoneNo.find({
              username: req.query.username,
          }, function(err, docs) {
            if(docs.length==0)
            {
            phoneNos = PhoneNo({
            username: req.query.username,
            meeting_date:req.query.meeting_date,
            daycare_no: req.query.daycare_no,
            forward_no: req.query.forward_no,
            meeting_time_from: req.query.meeting_time_from,
            meeting_time_to: req.query.meeting_time_to
        });
        phoneNos.save(function(err) {
            if (err) {
                mongoose.connection.close();
                console.log('Phone nos not saved'+ err);
                res.send("failure");
            }
            else {
                mongoose.connection.close();
                console.log('Phone nos saved');
                res.send("success");
            }
        });
      }
        else{

          var query = {'username':req.query.username};
          req.newData=[];
          req.username= req.query.username;
          req.meeting_date=req.query.meeting_date;
          req.daycare_no= req.query.daycare_no;
          req.forward_no= req.query.forward_no;
          req.meeting_time_from= req.query.meeting_time_from;
          req.meeting_time_to= req.query.meeting_time_to;

          PhoneNo.findOneAndUpdate(query, req, function(err, doc){
            if (err) {
              mongoose.connection.close();
              console.log('Phone nos not saved'+err);
              res.send("failure");
            }
            else {
              mongoose.connection.close();
              console.log('Phone nos saved');
              res.send("success");
            }
          });
        }
    }));

});
});
app.get('/getPhoneNos', function(req, res) {
    mongoose.connect(url, function() {
        PhoneNo.find({
            username: req.query.username},function(err,docs){

            if (err || docs.length ==0 ) {
              console.log('Phone nos not retrived');
                mongoose.connection.close();
              res.send("failure");
            } else {
                console.log('Phone nos retrived');
                  mongoose.connection.close();
                res.send(docs);
            }

        }); // The collection exists
    });
});
