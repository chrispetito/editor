exports.up = function(knex) {
  return knex.schema.createTable("notes", table => {
    table.increments();
    table.string("body");
  });
};

exports.down = function(knex) {
  return knex.schema.dropIfTableExists("notes");
};
