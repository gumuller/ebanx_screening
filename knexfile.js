// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgres://ebanx:ebanx@localhost:5433/ebanx_screening',
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  staging: {
    client: 'postgresql',
    connection: 'postgres://ebanx:ebanx@localhost:5433/ebanx_screening',
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: 'postgres://ebanx:ebanx@localhost:5433/ebanx_screening',
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
}
