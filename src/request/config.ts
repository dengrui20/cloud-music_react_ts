import Axios from 'axios'
export const axiosInstance = Axios.create({
  // baseURL: 'http://localhost:8000'
})

axiosInstance.interceptors.response.use(
  function (response) {
    if (response.data.code) {
      response.data.success = response.data.code === 200
    }
    
    // console.log(response.config.url)
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)
axiosInstance.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error.response)
  }
)
