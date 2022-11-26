const reviewsRouter = require("express").Router()
const db = require("../db/pg")
const checkIfAuth = require("../middleware/isAuth")

/**
 * Get Review Query by Review Id
 * Join User as Reviewer, Review Resident details, Review Address details and total Likes for Review
 */
const getReviewQuery = `SELECT r.*, u.image as reviewer_image, u.username as reviewer_username, d.first_name as resident_first_name, d.last_name as resident_last_name, a.*, (SELECT count(*) FROM likes WHERE r.review_id = likes.like_review_id_fkey) as likes
FROM reviews r
JOIN users u ON r.review_user_id_fkey = u.user_id
JOIN residents d ON r.review_resident_id_fkey = d.resident_id
JOIN addresses a ON r.review_address_id_fkey = a.address_id
WHERE r.review_id = $1`
reviewsRouter.get("/review/:id", checkIfAuth, async (req, res) => {
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
 * Get all Reviews by User by review_user_id_fkey
 * Join User as Reviewer, Review Resident details, Review Address details and
 * total Likes for Review
 */
const getUserReviewsQuery = `SELECT r.*, u.image as reviewer_image, u.username as reviewer_username, d.first_name as resident_first_name, d.last_name as resident_last_name, a.*, (SELECT count(*) FROM likes WHERE r.review_id = likes.like_review_id_fkey) as likes
FROM reviews r
JOIN users u ON r.review_user_id_fkey = u.user_id
JOIN residents d ON r.review_resident_id_fkey = d.resident_id
JOIN addresses a ON r.review_address_id_fkey = a.address_id
WHERE r.review_user_id_fkey = $1`
reviewsRouter.get("/user/:id/reviews", checkIfAuth, async (req, res) => {
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
 * Join User as Reviewer, Review Address, and total Likes for Reviews
 */
const getResidentReviewsQuery = `SELECT r.*, u.username as reviewer_username, u.image as reviewer_image, a.*, (SELECT count(*) FROM likes WHERE r.review_id = likes.like_review_id_fkey) as likes
FROM reviews r
JOIN addresses a ON r.review_address_id_fkey = a.address_id 
JOIN users u ON r.review_user_id_fkey = u.user_id
WHERE r.review_resident_id_fkey = $1`
reviewsRouter.get("/residents/:id/reviews", checkIfAuth, async (req, res) => {
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
 * Add in Review Address ID, Review User ID, Review Resident ID
 */
const saveReviewQuery = `INSERT INTO reviews (review_user_id_fkey, review_address_id_fkey, review_resident_id_fkey, friendly, hospitable, payment, respectful, expectations, visit_type, text) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
reviewsRouter.post("/address/:id/review/new", checkIfAuth, async (req, res) => {
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

/**
 * Delete Review
 * Requires user performing delete to be author of the review
 * Validate review_user_id_fkey == req.auth.user_id
 */
const deleteReviewQuery = `DELETE FROM reviews 
WHERE reviews.review_id = $1 
AND reviews.review_user_id_fkey = $2`
reviewsRouter.delete("/reviews/:id/delete", checkIfAuth, async (req, res) => {
  const reviewId = req.params.id
  const userId = req.auth.user_id
  try {
    const deleted = await db.query(deleteReviewQuery, [reviewId, userId])
    return res.json({ message: "success", data: "review deleted" })
  } catch (error) {
    console.log("error on 176")
    return res.json({ message: "error", data: error })
  }
})

/**
 * Update review
 * Requires User performing update to be author of review
 * Validate review_user_id_fkey = req.auth.user_id
 */
const updateReviewQuery = `UPDATE reviews 
SET friendly = $1, hospitable = $2, payment = $3, respectful = $4, expectations = $5, visit_type = $6, text = $7, review_resident_id_fkey = $8 
WHERE reviews.review_id = $9
AND reviews.review_user_id_fkey = $10 
RETURNING *`
reviewsRouter.put("/reviews/:id/update", async (req, res) => {
  const reviewId = req.params.id
  const userId = req.auth.user_id
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

module.exports = reviewsRouter
