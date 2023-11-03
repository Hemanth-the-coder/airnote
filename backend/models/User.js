const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: 
  {
   type : String,
   required : true 
  } ,
  email: String,
  password : String , 
  date : {
    type :Date , 
    default : Date.now
  }
});

// Create a model
const User = mongoose.model('User', userSchema);
User.createIndexes() // To eliminate the redundant data 
module.exports = User; 





