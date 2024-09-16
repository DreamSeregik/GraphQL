var knex = require('knex')({
    client: 'mssql',
    connection: {
        host: 'localhost',
        port: 1433,
        user: 'sa',
        password: 'Password123',
        database: 'Учебная'
    }
})

module.exports = { knex }