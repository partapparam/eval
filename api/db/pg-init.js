/**
 * Create Postgres Tables and Seed data base
 */

const { Client } = require("pg")
require("dotenv").config()
console.log(process.env.POSTGRES_DB)
const client = new Client(process.env.POSTGRES_DB)

const createScript = `
CREATE TABLE IF NOT EXISTS users(
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    image VARCHAR(200) NULL,
    username VARCHAR(30) NOT NULL UNIQUE,
    job_title VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS addresses(
    address_id SERIAL PRIMARY KEY,
    street_address VARCHAR(200) NOT NULL,
    zipcode INT NOT NULL,
    address_type VARCHAR(20) NOT NULL,
    unit VARCHAR(10) NULL
);


CREATE TABLE IF NOT EXISTS residents(
    resident_id SERIAL PRIMARY KEY,
    resident_address_id_fkey INT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    tenant BOOLEAN NOT NULL,
    current BOOLEAN NOT NULL,
    FOREIGN KEY (resident_address_id_fkey) REFERENCES addresses(address_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS reviews(
    review_id SERIAL PRIMARY KEY,
    review_user_id_fkey INT NOT NULL,
    review_address_id_fkey INT NOT NULL,
    review_resident_id_fkey INT NOT NULL,
    friendly INT NOT NULL,
    hospitable INT NOT NULL,
    payment INT NOT NULL,
    respectful INT NOT NULL,
    expectations INT NOT NULL,
    visit_type VARCHAR(30) NOT NULL,
    text VARCHAR(300) NULL,
    FOREIGN KEY (review_user_id_fkey) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (review_address_id_fkey) REFERENCES addresses(address_id) ON DELETE CASCADE,
    FOREIGN KEY (review_resident_id_fkey) REFERENCES residents(resident_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes(
    like_id SERIAL PRIMARY KEY,
    like_review_id_fkey INT NOT NULL,
    like_user_id_fkey INT NOT NULL,
    FOREIGN KEY (like_review_id_fkey) REFERENCES reviews(review_id) ON DELETE CASCADE,
    FOREIGN KEY (like_user_id_fkey) REFERENCES users(user_id) ON DELETE CASCADE
);
`

const seedUsers = async (client) => {}
const seedAddresses = async (client) => {}
const seedResidents = async (client) => {}
const seedReviews = async (client) => {}
const seedLikes = async (client) => {}

client.connect(async (err) => {
  if (err) {
    return console.error("could not connect to postgres", err)
  }
  try {
    console.log("creating scripts")
    await Promise.all([
      client.query("DROP TABLE IF EXISTS likes"),
      client.query("DROP TABLE IF EXISTS reviews"),
      client.query("DROP TABLE IF EXISTS residents"),
      client.query("DROP TABLE IF EXISTS addresses"),
      client.query("DROP TABLE IF EXISTS users"),
    ])
    console.log("drop table finished")
    await client.query(createScript)
    console.log("create tables")
    // TODO
    // Database seeding
  } catch (err) {
    console.log("recieved error---", err)
    process.exit(1)
  } finally {
    //   release client
    client.end()
  }
})
