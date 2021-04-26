import { makeAutoObservable, when } from 'mobx'
import BRIDGE_API from '../API/bridge'

export default class User {
  userID = null
  init = false
  access_token = null
  permissions = ''
  firstName = null
  lastName = null
  error = null

  constructor(rootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
    this.permissions = ''
    when(
      () => this.init,
      async () => {
        const scopeFromStorage = (await (await BRIDGE_API.STORAGE_GET({ keys: ['scope'] })).keys[0].value) ?? ''
        this.getUserToken(scopeFromStorage)
      }
    )
    when(
      () => !this.userID && this.init,
      () => {
        this.getUserInfo()
      }
    )
  }

  setInit(init) {
    this.init = init
  }
  setUserInfo(res) {
    this.userID = res.id
    this.firstName = res.first_name
    this.lastName = res.last_name
  }

  setPermissons(scope) {
    this.permissions = scope
  }

  setToken(token) {
    this.access_token = token
  }

  setError(err) {
    this.error = err
  }

  async getUserInfo() {
    try {
      const result = await BRIDGE_API.GET_USER_INFO()
      this.setUserInfo(result)
    } catch (err) {
      this.setError(err)
    }
  }

  async getUserToken(scope = '') {
    try {
      console.log(scope)
      const result = await BRIDGE_API.GET_AUTH_TOKEN(scope)
      BRIDGE_API.SET_TOKEN(result.access_token, result.scope)

      BRIDGE_API.STORAGE_SET({ key: 'scope', value: result.scope })

      this.setToken(result.access_token)
      this.setPermissons(this.permissions + ',' + result.scope)
    } catch (err) {
      this.setError(err)
    }
  }
}
