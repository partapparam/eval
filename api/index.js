const express = require("express")
const app = express()
const port = process.env.port || 3000
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")
const req = require("express/lib/request")
require("dotenv").config()
require("./db")
// removes -x-powered-by response header
app.disable("x-powered-by")
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan("tiny"))

// this will only run if we are testing it. Check Package JSON file for testing script
if (process.env.NODE_ENV === "test") {
  // TODO
  // setup Testing Controller
  // Setup testing router
}

app.listen(process.env.PORT, () => {
  console.log("server is running", process.env.PORT)
})
