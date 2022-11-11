/**
 * Create Postgres Tables and Seed data base
 */

const { Client } = require("pg")
require("dotenv").config()
console.log(process.env.POSTGRES_DB)
const client = new Client(process.env.POSTGRES_DB)

const createScript = `
CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    image VARCHAR(200) NULL,
    username VARCHAR(30) NOT NULL,
    job_title VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS addresses(
    id SERIAL PRIMARY KEY,
    street_address VARCHAR(200) NOT NULL,
    zip_code INT NOT NULL,
    address_type VARCHAR(20) NOT NULL,
    unit VARCHAR(10) NULL
);

CREATE TABLE IF NOT EXISTS residents(
    id SERIAL PRIMARY KEY,
    resident_address_id INT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    tenant BOOLEAN NOT NULL,
    FOREIGN KEY (resident_address_id) REFERENCES addresses(id)
);

CREATE TABLE IF NOT EXISTS reviews(
    id SERIAL PRIMARY KEY,
    review_user_id INT NOT NULL,
    review_address_id INT NOT NULL,
    review_resident_id INT NOT NULL,
    friendly INT NOT NULL,
    hospitable INT NOT NULL,
    payment INT NOT NULL,
    respectful INT NOT NULL,
    expectations INT NOT NULL,
    visit_type VARCHAR(30) NOT NULL,
    text VARCHAR(300) NULL,
    FOREIGN KEY (review_user_id) REFERENCES users(id),
    FOREIGN KEY (review_address_id) REFERENCES addresses(id),
    FOREIGN KEY (review_resident_id) REFERENCES residents(id)
);

CREATE TABLE IF NOT EXISTS likes(
    id SERIAL PRIMARY KEY,
    like_review_id INT NOT NULL,
    like_user_id INT NOT NULL,
    liked BOOLEAN,
    FOREIGN KEY (like_review_ID) REFERENCES reviews(id),
    FOREIGN KEY (like_user_id) REFERENCES users(id)
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
      client.query("DROP TABLE IF EXISTS reviews"),
      client.query("DROP TABLE IF EXISTS residents"),
      client.query("DROP TABLE IF EXISTS addresses"),
      client.query("DROP TABLE IF EXISTS likes"),
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
