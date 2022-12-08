import axios from "axios"
import { baseUrl } from "../../common/constants"
const reviewsUrl = baseUrl + "/review/1"

const getAllReviews = async () => {
  console.log("getAllReviews Called")
  try {
    const response = await axios.get(reviewsUrl)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export { getAllReviews }
