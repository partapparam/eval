const express = require("express")
const app = express()
require("dotenv").config()
const port = process.env.PORT || 3000
const morgan = require("morgan")
const cors = require("cors")
const req = require("express/lib/request")
const checkIfAuth = require("./middleware/isAuth")
require("./db/pg")
// removes -x-powered-by response header
app.disable("x-powered-by")
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan("tiny"))
/**
 * Routers and Middleware
 */
const authRouter = require("./controllers/auth")
const userRouter = require("./controllers/user")
const testRouter = require("./controllers/testController")
app.use("/api/auth", authRouter)
app.use("/api/users", checkIfAuth, userRouter)
app.use("/api/test", testRouter)

/**
 * Handles all failed routing that do not match or Auth is not met
 */
app.use((req, res) => {
  res.status(404).json({ message: "error", data: "Not Found - 400" })
})
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    console.log(err.message)
    return res.json({
      message: "error",
      data: "500 - server error - access not allowed",
    })
  }
  console.log(err.message)
  return res.status(500).json({ message: "error", data: "500 - server error" })
})

// this will only run if we are testing it. Check Package JSON file for testing script
if (process.env.NODE_ENV === "test") {
  // TODO
  // setup Testing Controller
  // Setup testing router
}

app.listen(process.env.PORT, () => {
  console.log("server is running", process.env.PORT)
})
