import axios from "axios"
import { baseUrl } from "../../common/constants"
const reviewsUrl = baseUrl + "/reviews"

const getAllReviews = async () => {
  console.log("getAllReviews Called")
  try {
    const response = await axios.get(reviewsUrl + "/review/1")
    console.log(response)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

const createNewReview = async (content) => {
  try {
    const response = await axios.post(reviewsUrl + "/new", content)
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

export { getAllReviews, createNewReview }
