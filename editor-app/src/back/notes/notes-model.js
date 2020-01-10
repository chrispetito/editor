const db = require("../dbConfig");

module.exports = {
  getAllNotes,
  findById,
  insertNote
};

function getAllNotes() {
  return db("notes");
}
function findById(id) {
  return db("notes")
    .where({ id })
    .first();
}
function insertNote(body) {
  return db("notes")
    .insert(body)
    .then(([id]) => findById(id));
}
