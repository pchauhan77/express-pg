const {Client} = require('pg')

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "rootUser",
  database: "todo_database"
})

module.exports = client