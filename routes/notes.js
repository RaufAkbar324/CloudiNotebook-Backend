const express = require("express");
const router = express.Router();
var fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

router.get("/fetchAllNotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
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

      const note = new Notes({
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

module.exports = router;
