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
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    image VARCHAR(200) NULL,
    username VARCHAR(30) NOT NULL UNIQUE,
    jobTitle VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS addresses(
    id SERIAL PRIMARY KEY,
    streetAddress VARCHAR(200) NOT NULL,
    zipCode INT NOT NULL,
    addressType VARCHAR(20) NOT NULL,
    unit VARCHAR(10) NULL
);

CREATE TABLE IF NOT EXISTS residents(
    id SERIAL PRIMARY KEY,
    residentAddressId INT NOT NULL,
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30) NOT NULL,
    tenant BOOLEAN NOT NULL,
    current BOOLEAN NOT NULL,
    FOREIGN KEY (residentAddressId) REFERENCES addresses(id)
);

CREATE TABLE IF NOT EXISTS reviews(
    id SERIAL PRIMARY KEY,
    reviewUserId INT NOT NULL,
    reviewAddressId INT NOT NULL,
    reviewResidentId INT NOT NULL,
    friendly INT NOT NULL,
    hospitable INT NOT NULL,
    payment INT NOT NULL,
    respectful INT NOT NULL,
    expectations INT NOT NULL,
    visitType VARCHAR(30) NOT NULL,
    text VARCHAR(300) NULL,
    FOREIGN KEY (reviewUserId) REFERENCES users(id),
    FOREIGN KEY (reviewAddressId) REFERENCES addresses(id),
    FOREIGN KEY (reviewResidentId) REFERENCES residents(id)
);

CREATE TABLE IF NOT EXISTS likes(
    id SERIAL PRIMARY KEY,
    likeReviewId INT NOT NULL,
    likeUserId INT NOT NULL,
    liked BOOLEAN NOT NULL,
    FOREIGN KEY (likeReviewId) REFERENCES reviews(id),
    FOREIGN KEY (likeUserId) REFERENCES users(id)
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
