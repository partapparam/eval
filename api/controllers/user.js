const userRouter = require("express").Router()
const db = require("../db/pg")
const checkIfAuth = require("../middleware/isAuth")

// TODO will an error thrown outside try/catch work or no.

/**
 * Queries
 * Confirm ID in URL == req.auth.user_id from Decoded JWT Token
 */
const getUserQuery = `SELECT * from users 
  WHERE user_id = $1`
const updateUserQuery = `UPDATE users SET first_name = $1, last_name = $2, email = $3, job_title = $4 WHERE user_id = $5`
const updateImageQuery = `UPDATE users SET image = $1 WHERE user_id = $2`
const updateUsernameQuery = `UPDATE users SET username = $1 WHERE user_id = $2`

/**
 * Get user by id
 */
userRouter.get("/:id", async (req, res) => {
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

/**
 * Update user by ID
 */
userRouter.put("/:id/update", checkIfAuth, async (req, res) => {
  const body = req.body
  const userId = req.params.id
  if (userId !== req.auth.user_id)
    throw Error("Incorrect user -- you do not have permission")
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

/**
 * Update User.image by Id
 */
userRouter.put("/:id/update/image", checkIfAuth, async (req, res) => {
  const body = req.body
  const userId = req.params.id
  if (userId !== req.auth.user_id)
    throw Error("Incorrect user -- you do not have permission")
  try {
    const response = await db.query(updateImageQuery, [body.image, userId])
    return res.json({ message: "success", data: "updated image" })
  } catch (error) {
    console.log("error on test 50", error._message)
    return res.json({ message: "error", data: "error saving image" })
  }
})

/**
 * Update User.username by Id
 */
userRouter.put("/:id/update/username", checkIfAuth, async (req, res) => {
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

module.exports = userRouter
