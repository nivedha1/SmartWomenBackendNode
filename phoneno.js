// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var phoneNumberSchema = new Schema({
  username: { type: String, required: true, unique: true},
  daycare_no:String,
  forward_no: String,
  created_at: Date,
  updated_at: Date,
  meeting_date:String,
  meeting_time_from:String,
  meeting_time_to:String
});

// the schema is useless so far
// we need to create a model using it
var PhoneNo = mongoose.model('PhoneNo', phoneNumberSchema);

// make this available to our users in our Node applications
module.exports = PhoneNo;
