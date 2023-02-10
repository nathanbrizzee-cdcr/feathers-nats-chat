const Knex = require('knex')
require('dotenv').config()
const config = require('config')

process.env.ALLOW_CONFIG_MUTATIONS = true //allow the db config to be altered once read into memory
const dbConfig = config.get('postgresql')

let databaseName = ''

// If the connection is a string, convert it to and object and remove the database name from the config
if (dbConfig.connection && typeof dbConfig.connection === 'string') {
  const url = new URL(dbConfig.connection)
  databaseName = url.pathname.replace('/', '') // Grab the database name and remove and slashes if present

  delete dbConfig.connection
  dbConfig.connection = {
    host: url.hostname,
    port: url.port,
    user: url.username,
    password: url.password
  }
}

// If the connection is an object, or we converted the string to an object,
// then remove the databasename (if present) from the connection object
if (dbConfig.connection && typeof dbConfig.connection === 'object') {
  if (dbConfig.connection.database) {
    databaseName = dbConfig.connection.database
    delete dbConfig.connection.database
  }
}
// Add some extra flags to knex connection
dbConfig.debug = true
dbConfig.pool = {
  min: 1,
  max: 1
}

console.log('database config:', dbConfig)

if (!databaseName) {
  console.error('Database Name was not found in the config.')
  process.exit(1)
}

async function main() {
  const knex = Knex(dbConfig)

  console.log(`Creating database ${databaseName}`)
  // Lets create our database if it does not exist
  // await knex.raw("CREATE DATABASE IF NOT EXISTS ??", databaseName)
  // Postgresql doesn't support the NOT EXISTS. We just let it fail if it exists and not care.
  await knex.raw('CREATE DATABASE ??', databaseName)
  console.log(`Database ${databaseName} created`)
  knex.destroy()
  await addExtensions()
}

async function addExtensions() {
  dbConfig.connection.database = databaseName
  const knex = Knex(dbConfig)

  const dbExtension = "uuid-ossp"
  console.log(`Adding extension ${dbExtension}`)
  await knex.raw('CREATE EXTENSION IF NOT EXISTS ??', dbExtension) // Add the UUID generator to Postgresql database
  console.log(`Extension ${dbExtension} added to database`)
  // CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  // SELECT uuid_generate_v4();
  // SELECT session_user, current_database();
  knex.destroy()
}

main()
  .catch((e) => {
    console.error(e.message)
    process.exit(1)
  }).then(() => {
    console.log("exiting")
    process.exit(0)
  })
