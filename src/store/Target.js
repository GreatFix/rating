import { makeAutoObservable } from 'mobx'
import BRIDGE_API from '../API/bridge'
import BACKEND_API from '../API/backend'
const USER = 'user'
const FEEDBACKS = 'feedbacks'

export default class Target {
  id = null
  user = { fetching: false, error: null, data: null }
  feedbacks = { fetching: false, error: null, data: null }
  reply = false
  constructor(rootStore) {
    makeAutoObservable(this, { getInfo: false, getUser: false, getFeedbacks: false })
    this.rootStore = rootStore
  }

  get title() {
    return `${this.user?.data?.first_name} ${this.user?.data?.last_name}`
  }

  get isReviewed() {
    return this.feedbacks.data?.Feedbacks?.some((feedback) => feedback.UserId === this.rootStore.User.userID) ?? false
  }

  popFeedback(feedbackId) {
    this.feedbacks.data.Feedbacks = this.feedbacks.data?.Feedbacks?.filter((feedback) => feedback.id !== feedbackId)
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

  getInfo() {
    this.getUser()
    this.getFeedbacks()
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
    let targetFeedbacks, authorsInfo
    try {
      const config = {
        params: {
          targetID: this.id,
        },
      }
      const result = await BACKEND_API.GET_TARGET(config)

      targetFeedbacks = result?.data?.target
      let userIds = []
      targetFeedbacks?.Feedbacks?.forEach((feedback) => {
        userIds.push(feedback.UserId)
        feedback.Comments.forEach((comment) => userIds.push(comment.UserId))
      })
      let userIdsString = userIds.join(',')
      const params = {
        user_ids: userIdsString,
        fields: 'photo_50',
      }
      authorsInfo = await (await BRIDGE_API.GET_USERS(params)).response

      //Добавляем отзывам и комментариям данные их авторов
      targetFeedbacks.Feedbacks = targetFeedbacks.Feedbacks.map((feedback) => {
        feedback.Comments = feedback.Comments.map((comment) => ({
          ...authorsInfo.find((user) => user.id === comment.UserId),
          ...comment,
        }))
        return (feedback = { ...authorsInfo.find((user) => user.id === feedback.UserId), ...feedback })
      })

      targetFeedbacks = { ...targetFeedbacks, Feedbacks: targetFeedbacks.Feedbacks }
    } catch (error) {
      this.setErrorFetch(FEEDBACKS, error)
    }

    this.setFetchedData(FEEDBACKS, {
      ...targetFeedbacks,
    })
  }

  TargetClear() {
    this.user = { fetching: false, error: null, data: null }
    this.feedbacks = { fetching: false, error: null, data: null }
  }
}
