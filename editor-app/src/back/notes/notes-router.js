const express = require("express");
const db = require("./notes-model");

const router = express.Router();

router.get("/", (req, res) => {
  db.getAllNotes().then(notes => {
    res.status(200).json(notes);
  });
});

router.post("/", (req, res) => {
  db.insertNote(req.body)
    .then(note => {
      res.status(201).json(note);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router