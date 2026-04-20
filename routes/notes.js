const express = require("express");
const router = express.Router();
var fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

router.get("/fetchAllNotes", fetchUser, async (req, res) => {
  try {
    let notes = await Notes.find({ user: req.user.id });
    res.send(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post(
  "/addNotes",
  fetchUser,
  [
    body("title", "Enter a valid Title").isLength({
      min: 3,
    }),
    body("description", "Enter a valid Description").isLength({
      min: 5,
    }),
  ],

  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.send(errors.array());
      }

      let note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);

    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  },
);





router.put(
  "/updateNotes/:id",
  fetchUser,

  async (req, res) => {


    try{

    

    const { title, description, tag } = req.body;
    const newNote={};
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};
    let note=await Notes.findById(req.params.id);
    if(!note){
      res.status(404).send("Not Found");
    }
    if(note.user.toString()!==req.user.id){
      res.status(401).send("Not Allowed");
    }

    note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
    res.json({note});
    }catch(error){
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
    
    
  },
);










router.delete(
  "/deleteNotes/:id",
  fetchUser,

  async (req, res) => {
    // const { title, description, tag } = req.body;
    

    try{

    


    let note=await Notes.findById(req.params.id);
    if(!note){
      res.status(404).send("Not Found");
    }
    
    if(note.user.toString()!==req.user.id){
      res.status(401).send("Not Allowed");
    }

    note=await Notes.findByIdAndDelete(req.params.id);
    res.json("Success: Note has been deleted");

    }catch(error){
      

      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
    
    
  },
);





















module.exports = router;
