import { createSlice } from "@reduxjs/toolkit"
import * as reviewsService from "./reviewsService"

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: [],
  reducers: {
    appendReview(state, action) {},
    updateReview(state, action) {},
    setReviews(state, action) {
      return action.payload
    },
  },
})

export const { appendReview, updateReview, setReviews } = reviewsSlice.actions

export const initializeReviews = () => {
  return async (dispatch, getState) => {
    try {
      const reviews = await reviewsService.getAllReviews()
      dispatch(setReviews(reviews))
    } catch (error) {
      console.log("error getting all reviews", error)
    }
  }
}

export default reviewsSlice.reducer

// new review

// update review
