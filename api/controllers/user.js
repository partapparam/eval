const usersRouter = require("express").Router()
const bcrypt = require("bcrypt")

/**
 * get all users
 */
usersRouter.get("/all", async (req, res) => {
  try {
    const users = await User.find()
    res.json({ message: "success", data: users })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "error", data: "cannot find users" })
  }
})

// Get user by id
usersRouter.get("/:id", async (req, res) => {
  const id = req.params.id
  try {
    const user = await User.findById(id)
    res.json({ message: "success", data: user })
  } catch {
    // logger.error(error)
    //   TODO = res.status vs res.json
    //   how to check for res.status on client side
    res.status(500).json({ message: "error", data: "cannot find user" })
  }
})

/**
 * Update User by Id
 * By default, Mongo will send back old record
 * See options in query
 */
usersRouter.put("/update/:id", async (req, res) => {
  const id = req.params.id
  const body = req.body
  const user = {
    name: {
      first: body.first,
      last: body.last,
    },
    email: body.email,
    username: body.username,
    image: body.image,
    jobTitle: body.jobTitle,
  }
  console.log(user, req)

  try {
    const updatedUser = await User.findByIdAndUpdate(id, user, {
      new: true,
    })
    console.log(updatedUser)
    return res.json({ message: "success", data: updatedUser })
  } catch (error) {
    console.log(error)

    return res.status(500).json({ message: "error" })
  }
})

/**
 * Delete user by ID
 */
usersRouter.delete("/:id/", async (req, res) => {
  const id = req.params.id
  try {
    const deletedUser = await User.findByIdAndDelete(id)
    res.status(200).json({ message: "success", data: deletedUser })
  } catch (error) {
    console.log(error)
    res.status(400).json({ status: "error", message: error._message })
  }
})

module.exports = usersRouter
