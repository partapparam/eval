import { createSlice } from "@reduxjs/toolkit"
import * as reviewsService from "./reviewsService"

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: [],
  reducers: {
    appendReview(state, action) {
      state.concat(action.payload)
    },
    updateReview(state, action) {},
    setReviews(state, action) {
      state.concat(action.payload)
    },
  },
})

export const { appendReview, updateReview, setReviews } = reviewsSlice.actions

export const initializeReviews = () => {
  return async (dispatch, getState) => {
    try {
      const reviews = await reviewsService.getAllReviews()
      console.log(reviews, "reSlice 22")
      dispatch(setReviews(reviews))
    } catch (error) {
      console.log("error getting all reviews", error)
    }
  }
}
/**
 *
 * save review
 */
export const saveReview = (formData) => {
  return async (dispatch, getState) => {
    try {
      console.log(formData)
      console.log("reviewSlice save review")
      return dispatch(appendReview(formData))
    } catch (error) {
      console.log("Error saving review", error)
    }
  }
}

export default reviewsSlice.reducer

// update review
