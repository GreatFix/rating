import axios from 'axios'

const AXIOS = axios.create({
  baseURL: 'https://rating-backend.herokuapp.com/'
})

class BACKEND_API {
  SET_TOKEN(access_token) {
    AXIOS.defaults.headers.common['Authorization'] = 'Bearer ' + access_token
  }
  async GET_USER(config = {}) {
    return await AXIOS.get('/user', config)
  }
  async GET_TARGET(config = {}) {
    return await AXIOS.get('/target', config)
  }
  async GET_TARGETS(config = {}) {
    return await AXIOS.get('/targets', config)
  }
  async POST_AUTH(data = {}, config = {}) {
    return await AXIOS.post('/auth', data, config)
  }
  async POST_FEEDBACK(data = {}, config = {}) {
    return await AXIOS.post('/feedback', data, config)
  }
  async POST_COMMENT(data = {}, config = {}) {
    return await AXIOS.post('/comment', data, config)
  }
  async PUT_FEEDBACK(data = {}, config = {}) {
    return await AXIOS.put('/feedback', data, config)
  }
  async PUT_COMMENT(data = {}, config = {}) {
    return await AXIOS.put('/comment', data, config)
  }
  async DELETE_FEEDBACK(config = {}) {
    return await AXIOS.delete('/feedback', config)
  }
  async DELETE_COMMENT(config = {}) {
    return await AXIOS.delete('/comment', config)
  }
}
export default new BACKEND_API()
