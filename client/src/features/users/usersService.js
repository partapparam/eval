import axios from "axios"

const baseUrl = "http://localhost:3005/users"

const login = async (body) => {
  const response = await axios.post(baseUrl + "/login", body)
  return response.data
}

const signup = async (body) => {
  const response = await axios.post(baseUrl + "/signup", body)
  return response.data
}

export { login, signup }
