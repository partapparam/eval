const residentRouter = require("express").Router()
const db = require("../db/pg")
const checkIfAuth = require("../middleware/isAuth")

/**
 * Queries
 */
// get Residents for Address
const getResidentsQuery = `SELECT * FROM residents WHERE residents.resident_address_id_fkey = $1`
// Create new Resident at Address using address_id
const newResidentQuery = `INSERT INTO residents (resident_address_id_fkey, first_name, last_name, tenant) VALUES ($1, $2, $3, $4) RETURNING *`

residentRouter.post("/address/:id/new", checkIfAuth, async (req, res) => {
  const body = req.body
  const addressId = req.params.id
  try {
    const savedResident = await db.query(newResidentQuery, [
      addressId,
      body.first_name,
      body.last_name,
      body.tenant,
    ])
    return res.json({ message: "success", data: savedResident.rows[0] })
  } catch (error) {
    console.log("Error creating new resident")
    return res.json({ message: "error", data: error })
  }
})

residentRouter.get("/address/:id/all", checkIfAuth, async (req, res) => {
  const addressId = req.params.id
  try {
    const residents = await db.query(getResidentsQuery, [addressId])
    return res.json({ message: "success", data: residents.rows })
  } catch (error) {
    console.log("error getting all residents")
    return res.json({ message: "error", data: error })
  }
})

module.exports = residentRouter
