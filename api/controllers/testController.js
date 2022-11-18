const testRouter = require("express").Router()
const db = require("../db/pg")

const getUserQuery = `SELECT * from users 
  WHERE id = $1`
const updateUserQuery = `UPDATE users SET first_name = $1, last_name = $2, email = $3, job_title = $4 WHERE id = $5`
const updateImageQuery = `UPDATE users SET image = $1 WHERE id = $2`
const updateUsernameQuery = `UPDATE users SET username = $1 WHERE id = $2`
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
      body.first_name,
      body.last_name,
      body.email,
      body.job_title,
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

const getAddressQuery = `SELECT *
FROM addresses
INNER JOIN reviews ON addresses.id = reviews.review_address_id
INNER JOIN residents ON addresses.id = residents.resident_address_id
WHERE addresses.id = $1`
// TODO Address - need address, reviews for address, user that created review, residents of each review, resident's of address, likes for each review.
testRouter.get("/address/:id", async (req, res) => {
  const addressId = req.params.id
  try {
    const addr = await db.query(getAddressQuery, [addressId])
    return res.json({ message: "success", data: addr.rows })
  } catch (error) {
    console.log(error)
    return res.json({ message: "error", data: error })
  }
})
// create address
const newAddressQuery = `INSERT INTO addresses (street_address, zipcode, address_type, unit) VALUES ($1, $2, $3, $4) RETURNING *`
testRouter.post("/address/new", async (req, res) => {
  const body = req.body
  try {
    const savedAddress = await db.query(newAddressQuery, [
      body.street_address,
      body.zipcode,
      body.address_type,
      body.unit,
    ])
    return res.json({ message: "success", data: savedAddress.rows[0] })
  } catch (error) {
    console.log("error saving address")
    return res.json({ message: "error", data: error })
  }
})

// Review
// get review
// TODO on all, add in JOINS
const getReviewQuery = `SELECT * FROM reviews WHERE reviews.id = $id`
testRouter.get("/review/:id", async (req, res) => {
  const reviewId = req.params.id
  try {
    const review = await db.query(getReviewQuery, [reviewId])
    return res.json({ message: "success", data: review })
  } catch (error) {
    console.log("error on test 113")
    return res.json({ message: "error", data: error })
  }
})
// get reviews by user
const getUserReviewsQuery = `SELECT * FROM reviews where reviews.review_user_id = $1`
testRouter.get("/user/:id/reviews", async (req, res) => {
  const userId = req.params.id
  try {
    const reviews = await db.query(getUserReviewsQuery, [userId])
    return res.json({ message: "success", data: reviews.rows })
  } catch (error) {
    console.log("error on 127")
    return res.json({ message: "error", data: error })
  }
})
// get reviews by resident
const getResidentReviewsQuery = `SELECT * FROM reviews WHERE reviews.review_resident_id = $1 INNER LEFT JOIN ON reviews.review_address_id = addresses.id && reviews.review_resident_id = residents.id`
testRouter.get("/residents/:id/reviews", async (req, res) => {
  const residentId = req.params.id
  try {
    const reviews = await db.query(getResidentReviewsQuery, [residentId])
    return res.json({ message: "success", data: reviews.rows[0] })
  } catch (error) {
    console.log("error on 138")
    return res.json({ message: "error", data: error })
  }
})
// new review
const saveReviewQuery = `INSERT INTO reviews (review_user_id, review_address_id, review_resident_id, friendly, hospitable, payment, respectful, expectations, visit_type, text) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
testRouter.post("/address/:id/review/new", async (req, res) => {
  const body = req.body
  try {
    const savedReview = await db.query(saveReviewQuery, [
      body.review_user_id,
      body.review_address_id,
      body.review_resident_id,
      body.friendly,
      body.hospitable,
      body.payment,
      body.respectful,
      body.expectations,
      body.visit_type,
      body.text,
    ])
    return res.json({ message: "success", data: savedReview.rows[0] })
  } catch (error) {
    console.log("error on test 137")
    return res.json({ message: "error", data: error })
  }
})

// delete review
// validate that the user has permission to do it using token user id and review user id TODO
const deleteReviewQuery = `DELETE FROM reviews WHERE reviews.id = $1 && WHERE reviews.review_user_id = $2`
testRouter.delete("/reviews/:id/delete", async (req, res) => {
  const reviewId = req.params.id
  // todo user id from token
  try {
    const deleted = await db.query(deleteReviewQuery, [reviewId, 2])
    return res.json({ message: "success", data: "review deleted" })
  } catch (error) {
    console.log("error on 176")
    return res.json({ message: "error", data: error })
  }
})

// update review
// TODO make sure user updating is user who created
const updateReviewQuery = `UPDATE reviews SET friendly = $1, hospitable = $2, payment = $3, respectful = $4, expectations = $5, visit_type = $6, text = $7, review_resident_id = $8 WHERE reviews.id = $9 && reviews.review_user_id = $10 RETURNING *`
testRouter.put("/reviews/:id/update", async (req, res) => {
  const reviewId = req.params.id
  const userId = req.user.id
  const body = req.body
  try {
    const updatedReview = await db.query(updateReviewQuery, [
      body.friendly,
      body.hospitable,
      body.payment,
      body.respectful,
      body.expectations,
      body.visit_type,
      body.text,
      body.review_resident_id,
      reviewId,
      userId,
    ])
    return res.json({ message: "success", data: updatedReview.rows[0] })
  } catch (error) {
    console.log("error while trying to update review")
    return res.json({ message: "error", data: error })
  }
})

// resident's
// create resident
const newResidentQuery = `INSERT INTO residents (resident_address_id, first_name, last_name, tenant, current) VALUES ($1, $2, $3, $4, $5) RETURNING *`
testRouter.post("/address/:id/residents/new", async (req, res) => {
  const body = req.body
  const addressId = req.params.id
  try {
    const savedResident = await db.query(newResidentQuery, [
      addressId,
      body.first_name,
      body.last_name,
      body.tenant,
      body.current,
    ])
    return res.json({ message: "success", data: savedResident.rows[0] })
  } catch (error) {
    console.log("Error creating new resident")
    return res.json({ message: "error", data: error })
  }
})
// get residents
const getResidentsQuery = `SELECT * FROM residents WHERE residents.resident_address_id = $1`
testRouter.get("/address/:id/residents", async (req, res) => {
  const addressId = req.params.id
  try {
    const residents = await db.query(getResidentsQuery, [addressId])
    return res.json({ message: "success", data: residents })
  } catch (error) {
    console.log("error getting all residents")
    return res.json({ message: "error", data: error })
  }
})
// update current resident
// TODO do we even need a current resident. Rather, why not show resident's by created / updated date when creating a review
// This requires both new resident/old resident to be sent. Otherwise two queries
const updateResidentsQuery = `UPDATE residents SET current`
testRouter.put("/address/:id/residents/update", async (req, res) => {})

// Likes - what is best way to send server requests so not to slow down front end
// create like - need review id and user id
// delete all likes once review is deleted -- in SCHEMA _ TODO
const newLikeQuery = `INSERT INTO likes (like_review_id, like_user_id, liked) VALUES ($1, $2, $3) RETURNING *`
testRouter.post("/reviews/:id/like", async (req, res) => {
  const reviewId = req.params.id
  const user = req.user
  try {
    const savedLike = await db.query(newLikeQuery, [reviewId, user.id, true])
    return res.json({ message: "success", data: savedLike })
  } catch (error) {
    console.log("error saving Like")
    return res.json({ message: "error", data: error })
  }
})

// erase like/delete = need review id and user id to verify
const deleteLikeQuery = `DELETE FROM likes WHERE likes.like_review_id = $1 && likes.like_user_id = $2`
testRouter.delete("reviews/:id/like", async (req, res) => {
  const reviewId = req.params.id
  const user = req.user
  try {
    const deleted = await db.query(deleteLikeQuery, [reviewId, user.id])
    return res.json({ message: "success", data: "like is deleted" })
  } catch (error) {
    console.log("error on 271 deleting like")
    return res.json({ message: "error deleting like", data: error })
  }
})

// get all reviews likes by user
const getLikedReviewsQuery = `SELECT * FROM likes WHERE like_user_id = $1 INNER LEFT JOIN ON likes.like_review_id = reviews.id`
testRouter.get("/user/reviews/liked", async (req, res) => {
  const user = req.user

  try {
    const liked = await db.query(getLikedReviewsQuery, [user.id])
    return res.json({ message: "success", data: liked.rows })
  } catch (error) {
    console.log("error getting liked reviews")
    return res.json({ message: "error", data: error })
  }
})

module.exports = testRouter
