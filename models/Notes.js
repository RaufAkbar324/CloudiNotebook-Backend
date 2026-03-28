const mongoose = require('mongoose');

const NotesSchema = new Schema({
   name : {
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