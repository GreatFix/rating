import { makeAutoObservable } from 'mobx'
import BRIDGE_API from '../API/bridge'
import BACKEND_API from '../API/backend'

const FRIENDS = 'friends'
const GROUPS = 'groups'
const SEARCHED_USERS = 'searchedUsers'
const SEARCHED_GROUPS = 'searchedGroups'

export default class Find {
  friends = { fetching: false, error: null, list: [] }
  groups = { fetching: false, error: null, list: [] }
  searchedUsers = { fetching: false, error: null, list: [] }
  searchedGroups = { fetching: false, error: null, list: [] }

  constructor(rootStore) {
    makeAutoObservable(this, { fetchFriends: false, fetchGroups: false, searchUsers: false, searchGroups: false })
    this.rootStore = rootStore
  }

  setFetching(name) {
    this[name].fetching = true
  }
  setFetchedList(name, list) {
    this[name].list = list
    this[name].fetching = false
  }
  setErrorFetch(name, error) {
    this[name].error = error
    this[name].fetching = false
  }

  async extractIdc(list, name) {
    const arrayTargetIds = list.map((item) => item.id)
    const config = {
      params: {
        arrayTargetIds,
      },
    }
    try {
      const result = await BACKEND_API.GET_TARGETS(config)
      this.addBackendData(result.data, name)
    } catch (err) {
      console.error(err)
    }
  }

  addBackendData(array, container) {
    if (this[container].list && array) {
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < this[container].list.length; j++) {
          if (array[i].id === this[container].list[j].id)
            this[container].list[j] = { ...this[container].list[j], ...array[i] }
        }
      }
    }
  }

  async fetchFriends(offset = 0, count = 20) {
    if (!(offset === 0 && this.friends.list.length > 0)) {
      this.setFetching(FRIENDS)
      try {
        const params = {
          count,
          offset,
          fields: 'id,nickname,domain,photo_50,city,last_seen',
        }
        const result = await BRIDGE_API.GET_FRIENDS(params)
        if (offset > 0) {
          if (offset > result.response.count) return
          this.setFetchedList(FRIENDS, this.friends.list.concat(result.response.items))
        } else {
          this.setFetchedList(FRIENDS, result.response.items)
        }
        this.extractIdc(result.response.items, FRIENDS)
      } catch (err) {
        this.setErrorFetch(FRIENDS, err)
      }
    }
  }

  async fetchGroups(offset = 0, count = 20) {
    if (!(offset === 0 && this.groups.list.length > 0)) {
      try {
        this.setFetching(GROUPS)
        const params = {
          extended: 1,
          count,
          offset,
          fields: 'id,members_count,photo_50',
        }
        const result = await BRIDGE_API.GET_USER_GROUPS(params)
        if (offset > 0) {
          if (offset > result.response.count) return
          this.setFetchedList(GROUPS, this.groups.list.concat(result.response.items))
        } else {
          this.setFetchedList(GROUPS, result.response.items)
        }
        this.extractIdc(result.response.items, GROUPS)
      } catch (err) {
        this.setErrorFetch(GROUPS, err)
      }
    }
  }

  async searchUsers(text, filters, offset = 0, count = 20) {
    this.setFetching(SEARCHED_USERS)
    try {
      const params = {
        q: text,
        country: filters.country?.id,
        city: filters.city?.id,
        sex: filters.sex,
        age_from: filters.age_from,
        age_to: filters.age_to,
        count,
        offset,
        fields: 'id,nickname,domain,photo_50,city,last_seen',
      }
      const result = await BRIDGE_API.SEARCH_USERS(params)
      if (offset > 0) {
        if (offset > result.response.count) return
        this.setFetchedList(SEARCHED_USERS, this.searchedUsers.list.concat(result.response.items))
      } else {
        this.setFetchedList(SEARCHED_USERS, result.response.items)
      }
      this.extractIdc(result.response.items, SEARCHED_USERS)
    } catch (err) {
      this.setErrorFetch(SEARCHED_USERS, err)
    }
  }

  async searchGroups(text, filters = {}, offset = 0, count = 20) {
    try {
      this.setFetching(SEARCHED_GROUPS)

      const params = {
        q: text,
        count,
        offset,
        fields: 'id,members_count,photo_50',
      }
      const result = await BRIDGE_API.SEARCH_GROUPS(params)
      if (offset > 0) {
        if (offset > result.response.count) return
        this.setFetchedList(SEARCHED_GROUPS, this.searchedGroups.list.concat(result.response.items))
      } else {
        this.setFetchedList(SEARCHED_GROUPS, result.response.items)
      }
      this.extractIdc(result.response.items, SEARCHED_GROUPS)
    } catch (err) {
      this.setErrorFetch(SEARCHED_GROUPS, err)
    }
  }

  clearFetchedInfo() {
    this.friends = { fetching: false, error: null, list: [] }
    this.groups = { fetching: false, error: null, list: [] }
  }
}
