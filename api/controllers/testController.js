const testRouter = require("express").Router()
const db = require("../db/pg")
const checkIfAuth = require("../middleware/isAuth")

const getUserQuery = `SELECT * from users 
  WHERE user_id = $1`
const updateUserQuery = `UPDATE users SET first_name = $1, last_name = $2, email = $3, job_title = $4 WHERE user_id = $5`
const updateImageQuery = `UPDATE users SET image = $1 WHERE user_id = $2`
const updateUsernameQuery = `UPDATE users SET username = $1 WHERE user_id = $2`
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
testRouter.put("/users/:id/update", checkIfAuth, async (req, res) => {
  const body = req.body
  const userId = req.params.id
  console.log(req)
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
    console.log("error on 31", error)
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
testRouter.put("/users/:id/update/username", checkIfAuth, async (req, res) => {
  const body = req.body
  const userId = req.params.id
  console.log(req.auth, req.user)
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

/**
 * Get Address Query
 * Join reviews for address and the residents, reviewers and total likes for reviews
 */
const getAddressQuery = `SELECT addresses.*, reviews.*, residents.first_name as resident_first_name, residents.last_name as resident_last_name, users.username as reviewer_username, (SELECT count(*) from likes WHERE reviews.review_id = likes.like_review_id_fkey) as likes
FROM addresses
JOIN reviews ON addresses.address_id = reviews.review_address_id_fkey
JOIN residents ON reviews.review_resident_id_fkey = residents.resident_id
JOIN users ON reviews.review_user_id_fkey = users.user_id
WHERE addresses.address_id = $1`
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

/**
 * Get Review Query
 * Join User as Reviewer, review Resident details, review address details and total likes
 */
const getReviewQuery = `SELECT r.*, u.image as reviewer_image, u.username as reviewer_username, d.first_name as resident_first_name, d.last_name as resident_last_name, a.*, (SELECT count(*) FROM likes WHERE r.review_id = likes.like_review_id_fkey) as likes
FROM reviews r
JOIN users u ON r.review_user_id_fkey = u.user_id
JOIN residents d ON r.review_resident_id_fkey = d.resident_id
JOIN addresses a ON r.review_address_id_fkey = a.address_id
WHERE r.review_id = $1`
testRouter.get("/review/:id", async (req, res) => {
  const reviewId = req.params.id
  try {
    const data = await db.query(getReviewQuery, [reviewId])
    const reviews = data.rows[0]
    return res.json({ message: "success", data: reviews })
  } catch (error) {
    console.log("error on test 113", error)
    return res.json({ message: "error", data: error })
  }
})
/**
 * Get all Reviews by User
 */
const getUserReviewsQuery = `SELECT * FROM reviews WHERE reviews.review_user_id_fkey = $1`
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
/**
 * Get all Reviews for Resident
 * Join reviewer details, total likes
 */
const getResidentReviewsQuery = `SELECT r.*, u.username as reviewer_username, u.image as reviewer_image, a.*, (SELECT count(*) FROM likes WHERE r.review_id = likes.like_review_id_fkey) as likes
FROM reviews r
JOIN addresses a ON r.review_address_id_fkey = a.address_id 
JOIN users u ON r.review_user_id_fkey = u.user_id
WHERE r.review_resident_id_fkey = $1`
testRouter.get("/residents/:id/reviews", async (req, res) => {
  const residentId = req.params.id
  try {
    const reviews = await db.query(getResidentReviewsQuery, [residentId])
    return res.json({ message: "success", data: reviews.rows })
  } catch (error) {
    console.log("error on 138", error)
    return res.json({ message: "error", data: error })
  }
})
/**
 * Create new review
 * Add in Address ID, reviewer User ID, Resident ID
 */
const saveReviewQuery = `INSERT INTO reviews (review_user_id_fkey, review_address_id_fkey, review_resident_id_fkey, friendly, hospitable, payment, respectful, expectations, visit_type, text) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
testRouter.post("/address/:id/review/new", async (req, res) => {
  const body = req.body
  try {
    const savedReview = await db.query(saveReviewQuery, [
      body.review_user_id_fkey,
      body.review_address_id_fkey,
      body.review_resident_id_fkey,
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
const deleteReviewQuery = `DELETE FROM reviews WHERE reviews.review_id = $1 && WHERE reviews.review_user_id_fkey = $2`
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
const updateReviewQuery = `UPDATE reviews SET friendly = $1, hospitable = $2, payment = $3, respectful = $4, expectations = $5, visit_type = $6, text = $7, review_resident_id_fkey = $8 WHERE reviews.review_id = $9 && reviews.review_user_id_fkey = $10 RETURNING *`
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
      body.review_resident_id_fkey,
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
const newResidentQuery = `INSERT INTO residents (resident_address_id_fkey, first_name, last_name, tenant, current) VALUES ($1, $2, $3, $4, $5) RETURNING *`
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
const getResidentsQuery = `SELECT * FROM residents WHERE residents.resident_address_id_fkey = $1`
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
const newLikeQuery = `INSERT INTO likes (like_review_id_fkey, like_user_id_fkey, liked) VALUES ($1, $2, $3) RETURNING *`
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
const deleteLikeQuery = `DELETE FROM likes WHERE likes.like_review_id_fkey = $1 && likes.like_user_id_fkey = $2`
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
const getLikedReviewsQuery = `SELECT * FROM likes WHERE like_user_id_fkey = $1 INNER LEFT JOIN ON likes.like_review_id_fkey = reviews.review_id`
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
