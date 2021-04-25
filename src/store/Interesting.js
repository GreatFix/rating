import { makeAutoObservable } from 'mobx'
import BACKEND_API from '../API/backend'
import BRIDGE_API from '../API/bridge'

const FEEDBACKS = 'feedbacks'
const COMMENTS = 'comments'
const USERS = 'users'
const TARGETS = 'targets'

export default class Interesting {
  feedbacks = { fetching: false, error: null, list: [] }
  comments = { fetching: false, error: null, list: [] }
  users = { fetching: false, error: null, list: [] }
  targets = { fetching: false, error: null, list: [] }

  constructor(rootStore) {
    makeAutoObservable(this, {
      getRecentFeedbacks: false,
      getRecentComments: false,
      getTopUsers: false,
      getTopTargets: false,
      complement: false,
    })
    this.rootStore = rootStore
  }

  setFetching(name) {
    this[name].fetching = true
  }
  setFetchedList(name, list) {
    this[name].list = list
  }
  setErrorFetch(name, error) {
    this[name].error = error
    this[name].fetching = false
  }

  setComplement(name, list) {
    this[name].list = list
    this[name].fetching = false
  }

  async complement(list, name, mixed = false) {
    let complementedList = []
    if (mixed) {
      const arrayUsersIds = list.filter((item) => item?.type === 'user').map((item) => item.id)
      const arrayGroupsIds = list.filter((item) => item?.type === 'group').map((item) => item.id)
      const users = {}
      const groups = {}
      if (arrayUsersIds.length > 0) {
        let params = {
          user_ids: arrayUsersIds.join(','),
          fields: 'photo_50',
        }
        try {
          const result = await (await BRIDGE_API.GET_USERS(params)).response
          result.forEach((item) => {
            users[item.id] = item
          })
        } catch (err) {
          console.error(err)
        }
      }

      if (arrayGroupsIds.length > 0) {
        let params = {
          group_ids: arrayGroupsIds.join(','),
          fields: 'id,members_count,photo_50',
        }
        try {
          const result = await (await BRIDGE_API.GET_GROUPS(params)).response
          result.forEach((item) => {
            groups[item.id] = item
          })
        } catch (err) {
          console.error(err)
        }
      }

      complementedList = this[name].list.map((item) => {
        switch (item.type) {
          case 'user':
            return { ...item, ...users[item.id] }
          case 'group':
            return { ...item, ...groups[item.id] }
          default:
            return item
        }
      })
    } else {
      let arrayUsersIds
      if (name === USERS) arrayUsersIds = list.map((item) => item.id)
      else arrayUsersIds = list.map((item) => item.UserId)

      const users = {}
      if (arrayUsersIds.length > 0) {
        let params = {
          user_ids: arrayUsersIds.join(','),
          fields: 'photo_50',
        }
        try {
          const result = await (await BRIDGE_API.GET_USERS(params)).response
          result.forEach((item) => {
            users[item.id] = item
          })
        } catch (err) {
          console.error(err)
        }
      }
      if (name === USERS) complementedList = this[name].list.map((item) => ({ ...users[item.id], ...item }))
      else complementedList = this[name].list.map((item) => ({ ...users[item.UserId], ...item }))
    }

    this.setComplement(name, complementedList)
  }

  async getRecentFeedbacks(limit = 50, offset = 0) {
    const config = {
      params: {
        limit,
        offset,
      },
    }
    try {
      this.setFetching(FEEDBACKS)
      const result = await BACKEND_API.GET_RECENT_FEEDBACKS(config)
      this.setFetchedList(FEEDBACKS, result.data)
      this.complement(result.data, FEEDBACKS)
    } catch (err) {
      this.setErrorFetch(FEEDBACKS, err)
    }
  }

  async getRecentComments(limit = 50, offset = 0) {
    const config = {
      params: {
        limit,
        offset,
      },
    }
    try {
      this.setFetching(COMMENTS)
      const result = await BACKEND_API.GET_RECENT_COMMENTS(config)
      this.setFetchedList(COMMENTS, result.data)
      this.complement(result.data, COMMENTS)
    } catch (err) {
      this.setErrorFetch(COMMENTS, err)
    }
  }

  async getTopUsers(count = 50) {
    try {
      this.setFetching(USERS)
      const result = await BACKEND_API.GET_TOP_USERS(count)
      this.setFetchedList(USERS, result.data)
      this.complement(result.data, USERS)
    } catch (err) {
      this.setErrorFetch(USERS, err)
    }
  }

  async getTopTargets(count = 50) {
    try {
      this.setFetching(TARGETS)
      const result = await BACKEND_API.GET_TOP_TARGETS(count)
      this.setFetchedList(TARGETS, result.data)
      this.complement(result.data, TARGETS, true)
    } catch (err) {
      this.setErrorFetch(TARGETS, err)
    }
  }

  clear() {
    this.feedbacks = { fetching: false, error: null, list: [] }
    this.comments = { fetching: false, error: null, list: [] }
    this.users = { fetching: false, error: null, list: [] }
    this.targets = { fetching: false, error: null, list: [] }
  }
}
