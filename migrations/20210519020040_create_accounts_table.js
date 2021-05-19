exports.up = function (knex) {
  return knex.schema.createTable('accounts', function (table) {
    table.integer('id').unique()
    table.integer('balance').notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('accounts')
}
