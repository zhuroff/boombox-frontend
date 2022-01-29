import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_DEV_HOST,
  // withCredentials: true,
  headers: {
    'accept': 'application/json',
    'content-type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const statusCode = error.response?.status
      const responseData = error.response.data
      console.log(statusCode)
      console.log(responseData)
    }
  }
)

export default api
