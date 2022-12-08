import { configureStore } from "@reduxjs/toolkit"
import usersReducer from "../features/users/usersSlice"
import reviewsReducer from "../features/reviews/reviewsSlice"

export const store = configureStore({
  reducer: {
    reviews: reviewsReducer,
  },
})

/**
 * This tels Redux that we want our top-level state object to have a field named Reviews inside, and all the data for state.reviews will be updated by the reviewsReducer function when actions are dispatched
 */
