const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotesSchema = new Schema({

   user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },

   title : {
    type : String,
    required : true,
   },
    description : {
    type : String,
    required : true,
   },
    tag : {
    type : String,
    default : 'general',
   },
    Date : {
    type : Date,
    Default : Date.now,
   }
});

module.exports=mongoose.model('notes',NotesSchema);