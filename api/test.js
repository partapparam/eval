// TODO
// npm install pg
// How to change DB after production -- add new rows/tables/etc.
// how to plural a word like address in sql
// how to do timestamps
//  how to add min/max on an INT
// how to set validation error messages on types
//  best way to track likes on a review

//create db using pg client
const { Client } = require("pg")
const { credentials } = require("../config")
const { connectionString } = credentials.postgres
const client = new Client({ connectionString })

const seedUsers = async (client) => {
  let query = `
    INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4);
    `
  let p1 = client.query(query, ["param", "singh", "1@test.com", "asd"])
  let p2 = client.query(query, ["justin", "smith", "2@test.com", "asd"])
  let p3 = client.query(query, ["harry", "yadav", "3@test.com", "asd"])

  await Promise.all([p1, p2, p3])
}
