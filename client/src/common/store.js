import { configureStore } from "@reduxjs/toolkit"
import usersReducer from "../features/users/usersSlice"

const reducer = {}

export const store = configureStore({
  reducer: {
    users: usersReducer,
  },
})
