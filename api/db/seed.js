const bcrypt = require("bcrypt")
const saltRounds = 10

const seedUsers = async (client) => {
  const query = `INSERT INTO users (first_name, last_name, email, password, username, job_title) 
  VALUES ($1, $2, $3, $4, $5, $6)`
  const passwordHash = bcrypt.hashSync("password", saltRounds)
  const p1 = client.query(query, [
    "param",
    "singh",
    "1@test.com",
    passwordHash,
    "user 1",
    "tech",
  ])
  const p2 = client.query(query, [
    "justin",
    "smith",
    "2@test.com",
    passwordHash,
    "user 2",
    "Salesmen",
  ])
  const p3 = client.query(query, [
    "harry",
    "yadav",
    "3@test.com",
    passwordHash,
    "user 3",
    "Technician",
  ])

  await Promise.all([p1, p2, p3])
}

const seedAddresses = async (client) => {
  const query = `INSERT INTO addresses (street_address, zipcode, address_type, unit) VALUES ($1, $2, $3, $4)`
  const p1 = client.query(query, ["123 main st", "90019", "Home", null])
  const p2 = client.query(query, [
    "4533 W 18th st",
    "90019",
    "apartment",
    "1/2",
  ])

  await Promise.all([p1, p2])
}

const seedResidents = async (client) => {
  const query = `INSERT INTO residents (resident_address_id_fkey, first_name, last_name) VALUES ($1, $2, $3)`
  const p1 = client.query(query, [1, "Param", "Singh"])
  const p2 = client.query(query, [1, "Kai", "Matsukuma"])
  const p3 = client.query(query, [2, "justin", "smith"])
  await Promise.all([p1, p2, p3])
}

const seedReviews = async (client) => {
  const query = `INSERT INTO reviews (review_user_id_fkey, review_address_id_fkey, review_resident_id_fkey, friendly, hospitable, payment, respectful, expectations, visit_type, text) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`
  const p1 = client.query(query, [
    2,
    1,
    1,
    5,
    5,
    5,
    4,
    3,
    "Service Call",
    "Good glient",
  ])
  const p2 = client.query(query, [
    2,
    1,
    1,
    2,
    3,
    3,
    2,
    5,
    "Sales Call",
    "This is the reviews",
  ])
  const p3 = client.query(query, [
    1,
    1,
    2,
    5,
    5,
    5,
    5,
    5,
    "Sales",
    "New reviews",
  ])
  await Promise.all([p1, p2, p3])
}

const seedLikes = async (client) => {
  const query = `INSERT INTO likes (like_review_id_fkey, like_user_id_fkey) VALUES ($1, $2)`
  const p1 = client.query(query, [1, 1])
  const p2 = client.query(query, [1, 2])
  const p3 = client.query(query, [2, 1])
  const p4 = client.query(query, [2, 2])
  const p5 = client.query(query, [1, 1])
  await Promise.all([p1, p2, p3, p4, p5])
}

module.exports = {
  seedUsers,
  seedAddresses,
  seedResidents,
  seedReviews,
  seedLikes,
}
