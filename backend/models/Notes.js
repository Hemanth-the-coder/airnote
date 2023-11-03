const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notesSchema = new Schema({
  user: {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  }, 
  title: 
  {
   type : String,
   required : true 
  } ,
  description : 
  {
    type : String , 
    required : true 
  },
  tags : {
    type : String , 
    default : "general"
  }

  
});

// Create a model
const Notes = mongoose.model('Notes', notesSchema);
module.exports = Notes; 

