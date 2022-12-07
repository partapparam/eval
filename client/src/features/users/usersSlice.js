import { createSlice } from "@reduxjs/toolkit"
import usersService from "./usersService"
//  IMPORT UsersService

/**
 * Maybe it should just be updateUser and setUser as Reducers
 * new user will be setUser
 */
const usersSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    newUser(state, action) {},
    setUser(state, action) {},
  },
})

export const { newUser, setUser } = usersSlice.actions

export const loginUser = (details) => {
  return async (dispatch, getState) => {
    try {
      // make a call to server
    } catch (error) {
      console.log()
    }
  }
}

export default usersSlice.reducer
