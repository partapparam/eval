const { expressjwt: jwt } = require("express-jwt")
const { publicKey } = require("../keyConfig")
const db = require("../db/pg")
const js = require("jsonwebtoken")

/**
 * Gets Auth Bearer Token from the request
 * Attaches it
 */
const getTokenFromHeader = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    console.log("THe token is here - isAuth.js")
    const token = req.headers.authorization.split(" ")[1]
    const de = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    console.log("decoding---", de)
    const ver = js.verify(token, publicKey)
    console.log(ver)
    return token
  }
}

const checkIfAuth = jwt({
  algorithms: ["RS256"],
  secret: publicKey,
  getToken: getTokenFromHeader,
})

module.exports = checkIfAuth
