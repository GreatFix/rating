import { makeAutoObservable, when } from 'mobx'
import BRIDGE_API from '../API/bridge'
import BACKEND_API from '../API/backend'
const USER = 'user'
const GROUP = 'group'
const FEEDBACKS = 'feedbacks'

export default class Target {
  id = null
  type = null
  user = { fetching: false, error: null, data: null }
  group = { fetching: false, error: null, data: null }
  feedbacks = { fetching: false, error: null, data: null }
  reply = false
  constructor(rootStore) {
    makeAutoObservable(this, { getInfo: false, getUser: false, getFeedbacks: false })
    this.rootStore = rootStore
  }

  get title() {
    if (this.type === USER) return `${this.user?.data?.first_name} ${this.user?.data?.last_name}`
    if (this.type === GROUP) return `${this.user?.data?.name}`
    return 'Anonim'
  }

  get isReviewed() {
    return this.feedbacks.data?.Feedbacks?.some((feedback) => feedback.UserId === this.rootStore.User.userID) ?? false
  }

  get isMyself() {
    return this.id === this.rootStore.User.userID
  }

  popFeedback(feedbackId) {
    const feedback = this.feedbacks.data?.Feedbacks?.find((feedback) => feedback.id === feedbackId)
    this.feedbacks.data.Feedbacks = this.feedbacks.data?.Feedbacks?.filter((feedback) => feedback.id !== feedbackId)
    feedback.conclusion === 'positive'
      ? this.feedbacks.data.countPositiveFeedbacks--
      : this.feedbacks.data.countNegativeFeedbacks--
  }

  popComment(commentId, feedbackIndex) {
    this.feedbacks.data.Feedbacks[feedbackIndex].Comments = this.feedbacks.data?.Feedbacks[
      feedbackIndex
    ]?.Comments?.filter((comment) => comment.id !== commentId)
  }

  setFetching(name) {
    this[name].fetching = true
  }
  setFetchedData(name, data) {
    const context = this
    this[name].data = { ...context[name].data, ...data }
    this[name].fetching = false
  }
  setErrorFetch(name, error) {
    this[name].error = error
    this[name].fetching = false
  }

  setReply(reply) {
    this.reply = reply
  }

  setId(id) {
    this.id = id
  }
  setType(type) {
    this.type = type
  }

  sendedComment() {
    this.getInfo()
  }

  getInfo() {
    this.type === USER && this.getUser()
    this.type === GROUP && this.getGroup()
    this.getFeedbacks()
  }

  async getGroup() {
    this.setFetching(GROUP)
    try {
      let params = {
        group_id: String(this.id),
        fields: 'domain,photo_100,city,members_count,counters',
      }
      const result_1 = await BRIDGE_API.GET_GROUPS(params)

      this.setFetchedData(GROUP, result_1?.response[0])
    } catch (error) {
      this.setErrorFetch(GROUP, error)
    }
  }

  async getUser() {
    this.setFetching(USER)
    try {
      let params = {
        user_ids: String(this.id),
        fields: 'domain,photo_100,city,counters,bdate,common_count,is_friend,last_seen,deactivated,status,country',
      }
      const result_1 = await BRIDGE_API.GET_USERS(params)

      params = {
        user_id: this.id,
        count: 3,
        fields: 'id,photo_50',
      }
      const result_2 = await BRIDGE_API.GET_FRIENDS(params)

      this.setFetchedData(USER, {
        ...result_1?.response[0],
        countFriends: result_2?.response?.count,
        friends: result_2?.response?.items,
      })
    } catch (error) {
      this.setErrorFetch(USER, error)
    }
  }

  async getFeedbacks() {
    this.setFetching(FEEDBACKS)
    await when(() => this.rootStore.Backend.authorized)
    try {
      const config = {
        params: {
          targetID: this.id,
        },
      }
      const target = await (await BACKEND_API.GET_TARGET(config)).data // Инфо о цели с backend

      const AuthorsIds = []
      target.Feedbacks.forEach((feedback) => {
        AuthorsIds.push(feedback.UserId)
        feedback.Comments.forEach((comment) => AuthorsIds.push(comment.UserId))
      })

      const params = {
        user_ids: AuthorsIds.join(','),
        fields: 'photo_50',
      }
      const AuthorsInfo = await (await BRIDGE_API.GET_USERS(params)).response // Данные о авторах отзывов и комментариев с bridge

      const Authors = {}
      AuthorsInfo.forEach((item) => {
        Authors[item.id] = item
      })

      target.Feedbacks.forEach((feedback, i) => {
        target.Feedbacks[i] = { ...Authors[feedback.UserId], ...target.Feedbacks[i] }
        target.Feedbacks[i].Comments = feedback.Comments.map((comment) => ({
          ...Authors[comment.UserId],
          ...comment,
        }))
      })
      this.setFetchedData(FEEDBACKS, target)
    } catch (error) {
      this.setErrorFetch(FEEDBACKS, error)
    }
  }

  TargetClear() {
    this.user = { fetching: false, error: null, data: null }
    this.group = { fetching: false, error: null, data: null }
    this.feedbacks = { fetching: false, error: null, data: null }
  }
}
