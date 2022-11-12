const testRouter = require("express").Router()
const Address = require("../models/Address")
const Review = require("../models/Review")
const Resident = require("../models/Resident")
const db = require("../db/pg")
const getUserQuery = `SELECT * from users 
  WHERE users.id = $1`
const updateUserQuery = `UPDATE users SET firstName = $1, lastName = $2, email = $3, jobTitle = $4 WHERE users.id = $5`
const updateImageQuery = `UPDATE users SET image = $1 WHERE users.id = $2`
const updateUsernameQuery = `UPDATE users set username = $1 WHERE users.id = $2`

// users
testRouter.get("/user/:id", async (req, res) => {
  const id = req.params.id
  try {
    const response = await db.query(getUserQuery, [id])
    const user = response.rows[0]
    delete user.password
    return res.json({ message: "success", data: user })
  } catch (error) {
    console.log("Test js.21", error._message)
    return res.json({ message: "error", data: "There was an error on test 22" })
  }
})
testRouter.put("/user/update/:id", async (req, res) => {
  const body = req.body
  const userId = req.params.id
  try {
    const updatedUser = await db.query(updateUserQuery, [
      body.firstName,
      body.lastName,
      body.email,
      body.jobTitle,
      userId,
    ])
    return res.json({ message: "success", data: "User updated" })
  } catch (error) {
    console.log("error on 31", error._message)
    return res.json({ message: "error", data: "error updating user" })
  }
})
testRouter.put("/user/update/:id/image", async (req, res) => {
  const body = req.body
  const userId = req.params.id
  try {
    const response = await db.query(updateImageQuery, [body.image, userId])
    return res.json({ message: "success", data: "updated image" })
  } catch (error) {
    console.log("error on test 50", error._message)
    return res.json({ message: "error", data: "error saving image" })
  }
})
testRouter.put("/user/update/:id/username", async (req, res) => {
  const body = req.body
  const userId = req.params.id
  try {
    const updatedUser = await db.query(updateUsernameQuery, [
      body.username,
      userId,
    ])
    return res.json({ message: "success", data: "username updated" })
  } catch (error) {
    console.log("error on 60", error.detail)
    return res.json({ message: "error", data: error })
  }
})

const getAddressQuery = `SELECT * FROM addresses WHERE addresses.id = $1`
// Address - need address, reviews for address, user that created review, residents of each review, resident's of address, likes for each review.
testRouter.get("/address/:id", async (req, res) => {
  const addressId = req.params.id
  try {
    const address = await Review.find({ address: addressId })
      .populate("user")
      .populate("resident")
      .populate("address")
      .exec((err, reviews) => {
        if (err) throw new Error("nothing found")
        return res.json({ data: reviews, message: "success" })
      })
  } catch (error) {
    return res.json({ message: "success", data: error })
  }
})
// create address
const newAddressQuery = `INSERT INTO addresses (streetAddress, zipCode, addressType, unit) VALUES ($1, $2, $3, $4) RETURNING *`
testRouter.post("/address/new", async (req, res) => {
  const body = req.body
  try {
    const savedAddress = await db.query(newAddressQuery, [
      body.streetAddress,
      body.zipCode,
      body.addressType,
      body.unit,
    ])
    return res.json({ message: "success", data: savedAddress.rows[0] })
  } catch (error) {
    console.log("error saving address")
    return res.json({ message: "error", data: error })
  }
})

// Resident
testRouter.get("/resident/:id", async (req, res) => {
  const residentId = req.params.id
  try {
    const resident = await Resident.findOne({ id: residentId })

    return res.json({ message: "success", data: resident })
  } catch (error) {
    return res.json({ message: "error", data: error })
  }
})
testRouter.post("/resident/new", async (req, res) => {
  const newResident = req.body
  try {
    const savedResident = await new Resident(newResident).save()
    return res.json({ message: "success", data: savedResident })
  } catch (error) {
    return res.json({ message: "error", data: error })
  }
})

// Review
testRouter.get("/review/:id", async (req, res) => {
  const reviewId = req.params.id
  try {
    const review = await Review.findOne({ id: reviewId })

    return res.json({ message: "success", data: review })
  } catch (error) {
    return res.json({ message: "error", data: error })
  }
})

testRouter.post("/address/review/new", async (req, res) => {
  const newReview = req.body
  try {
    const savedReview = await new Review(newReview).save()
    return res.json({ message: "success", data: savedReview })
  } catch (error) {
    return res.json({ message: "error", data: error })
  }
})
// resident's
// create resident
const newResidentQuery = `INSERT INTO residents (firstName, lastName, tenant, current, residentAddressId) VALUES ($1, $2, $3, $4, $5) RETURNING *`
testRouter.post("/address/:id/residents/new", async (req, res) => {
  const body = req.body
  const addressId = req.params.id
  try {
    const savedResident = await db.query(newResidentQuery, [
      body.firstName,
      body.lastName,
      body.tenant,
      body.current,
      addressId,
    ])
    return res.json({ message: "success", data: savedResident.rows[0] })
  } catch (error) {
    console.log("Error creating new resident")
    return res.json({ message: "error", data: error })
  }
})
// get residents
const getResidentsQuery = `SELECT * FROM residents WHERE residents.residentAddressId = $1`
testRouter.get("/address/:id/residents", async (req, res) => {
  const addressId = req.params.id
  try {
    const residents = await db.query(getResidentsQuery, [addressId])
    return res.json({ message: "success", data: residents.rows })
  } catch (error) {
    console.log("error getting all residents")
    return res.json({ message: "error", data: error })
  }
})
// update current resident
const updateResidentsQuery = `UPDATE residents SET current`
testRouter.put("/address/:id/residents/update", async (req, res) => {})

module.exports = testRouter
