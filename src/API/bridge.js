import bridge from '@vkontakte/vk-bridge'
const API_METHOD = 'VKWebAppCallAPIMethod'
const APP_ID = 7799989
let ACCESS_TOKEN
let SCOPE = window.location.search.slice(26).split('&')[0]
class BRIDGE_API {
  SET_TOKEN(token, scope) {
    ACCESS_TOKEN = token
    SCOPE = SCOPE + ',' + scope
  }

  async GET_USER_INFO() {
    return await bridge.send('VKWebAppGetUserInfo')
  }

  async GET_AUTH_TOKEN(scope) {
    return await bridge.send('VKWebAppGetAuthToken', {
      app_id: APP_ID,
      scope,
    })
  }

  async SHOW_IMAGES(images = [], start_index = 0) {
    return await bridge.send('VKWebAppShowImages', { images, start_index })
  }

  async APP_CLOSE(status = 'success') {
    return await bridge.send('VKWebAppClose', { status })
  }
  async ENABLE_SWIPE() {
    return await bridge.send('VKWebAppEnableSwipeBack')
  }

  async DISABLE_SWIPE() {
    return await bridge.send('VKWebAppDisableSwipeBack')
  }

  async TAPTIC_IMPACT(style = 'heavy') {
    return await bridge.send('VKWebAppTapticImpactOccurred', { style })
  }

  async TAPTIC_NOTIFICATION(type = 'error') {
    return await bridge.send('VKWebAppDisableSwipeBack', { type })
  }

  async TAPTIC_SELECTION() {
    return await bridge.send('VKWebAppDisableSwipeBack')
  }

  async GET_FRIENDS(params = {}) {
    if (!SCOPE.includes('friends')) return new Error("Don't permission")
    return await bridge.send(API_METHOD, {
      method: 'friends.get',
      params: setV(params),
    })
  }

  async GET_USER_GROUPS(params = {}) {
    if (!SCOPE.includes('groups')) return new Error("Don't permission")
    return await bridge.send(API_METHOD, {
      method: 'groups.get',
      params: setV(params),
    })
  }

  async GET_USERS(params = {}) {
    return await bridge.send(API_METHOD, {
      method: 'users.get',
      params: setV(params),
    })
  }

  async GET_GROUPS(params = {}) {
    return await bridge.send(API_METHOD, {
      method: 'groups.getById',
      params: setV(params),
    })
  }

  async SEARCH_GROUPS(params = {}) {
    return await bridge.send(API_METHOD, {
      method: 'groups.search',
      params: setV(params),
    })
  }

  async SEARCH_USERS(params = {}) {
    return await bridge.send(API_METHOD, {
      method: 'users.search',
      params: setV(params),
    })
  }

  async DB_GET_CITIES(params = {}) {
    return await bridge.send(API_METHOD, {
      method: 'database.getCities',
      params: setV(params),
    })
  }

  async DB_GET_COUNTRIES(params = {}) {
    return await bridge.send(API_METHOD, {
      method: 'database.getCountries',
      params: setV(params),
    })
  }

  async GET_UPLOAD_SERVER(params = {}) {
    return await bridge.send(API_METHOD, {
      method: 'photos.getUploadServer',
      params: setV(params),
    })
  }

  async PHOTOS_SAVE(params = {}) {
    return await bridge.send(API_METHOD, {
      method: 'photos.save',
      params: setV(params),
    })
  }

  async STORAGE_SET(params = {}) {
    return await bridge.send('VKWebAppStorageSet', params)
  }

  async STORAGE_GET(params = {}) {
    return await bridge.send('VKWebAppStorageGet', params)
  }
}

export default new BRIDGE_API()

function setV(params) {
  return { ...params, access_token: ACCESS_TOKEN, v: '5.130' }
}
