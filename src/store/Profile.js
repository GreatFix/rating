import { makeAutoObservable, when } from 'mobx'
import BRIDGE_API from '../API/bridge'
import BACKEND_API from '../API/backend'

const INFO = 'info'
const ABOUT = 'about'

export default class Profile {
  info = { fetching: false, error: null, data: null }
  about = { fetching: false, error: null, data: null }
  reply = false
  constructor(rootStore) {
    makeAutoObservable(this, { getInfo: false })
    this.rootStore = rootStore
  }

  get title() {
    if (!this.info?.data?.first_name) return null
    return `${this.info?.data?.first_name} ${this.info?.data?.last_name}`
  }

  get userID() {
    return this.rootStore.User.userID
  }

  popComment(commentId, feedbackIndex) {
    this.about.data.Feedbacks[feedbackIndex].Comments = this.about.data?.Feedbacks[feedbackIndex]?.Comments?.filter(
      (comment) => comment.id !== commentId
    )
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

  sendedComment() {
    this.getAbout()
  }

  async getInfo() {
    this.setFetching(INFO)
    await when(() => this.rootStore.Backend.authorized)
    try {
      let params = {
        fields:
          'domain,photo_100,photo_50,city,counters,bdate,common_count,is_friend,last_seen,deactivated,status,country',
      }
      const info = await (await BRIDGE_API.GET_USERS(params)).response[0] // Инфо о пользователе с bridge

      const config = {
        params: {
          userID: this.userID,
        },
      }
      const user = await (await BACKEND_API.GET_USER(config)).data // Инфо о пользователе с backend

      const commentAuthorsIds = []
      user.Feedbacks.forEach((feedback) => {
        feedback.Comments.forEach((comment) => commentAuthorsIds.push(comment.UserId))
      })

      params = {
        user_ids: commentAuthorsIds.join(','),
        fields: 'photo_50',
      }
      const commentAuthorsInfo = await (await BRIDGE_API.GET_USERS(params)).response // Данные о авторах комментариев с bridge

      const commentAuthors = {}
      commentAuthorsInfo.forEach((item) => {
        commentAuthors[item.id] = item
      })

      const userMiniInfo = { photo_50: info.photo_50, last_name: info.last_name, first_name: info.first_name }

      user.Feedbacks = user.Feedbacks.map((feedback) => ({ ...feedback, ...userMiniInfo }))
      user.Comments = user.Comments.map((comment) => ({ ...comment, ...userMiniInfo }))

      user.Feedbacks.forEach((feedback, i) => {
        user.Feedbacks[i].Comments = feedback.Comments.map((comment) => ({
          ...commentAuthors[comment.UserId],
          ...comment,
        }))
      })

      this.setFetchedData(INFO, { ...user, ...info })
    } catch (error) {
      this.setErrorFetch(INFO, error)
    }
  }

  async getAbout() {
    this.setFetching(ABOUT)
    await when(() => this.rootStore.Backend.authorized)
    try {
      const config = {
        params: {
          targetID: this.userID,
        },
      }
      const about = await (await BACKEND_API.GET_TARGET(config)).data // Инфо о пользователе с backend

      const AuthorsIds = []
      about.Feedbacks.forEach((feedback) => {
        AuthorsIds.push(feedback.UserId)
        feedback.Comments.forEach((comment) => AuthorsIds.push(comment.UserId))
      })

      const params = {
        user_ids: AuthorsIds.join(','),
        fields: 'photo_50',
      }
      const AuthorsInfo = await (await BRIDGE_API.GET_USERS(params)).response // Данные о авторах отзывов и  комментариев с bridge

      const Authors = {}
      AuthorsInfo.forEach((item) => {
        Authors[item.id] = item
      })

      about.Feedbacks.forEach((feedback, i) => {
        about.Feedbacks[i] = { ...Authors[feedback.UserId], ...about.Feedbacks[i] }
        about.Feedbacks[i].Comments = feedback.Comments.map((comment) => ({
          ...Authors[comment.UserId],
          ...comment,
        }))
      })

      this.setFetchedData(ABOUT, about)
    } catch (error) {
      this.setErrorFetch(ABOUT, error)
    }
  }

  async getTargetOfFeedback(feedback) {
    try {
      const config = {
        params: {
          targetID: feedback.TargetId,
        },
      }
      const result = await (await BACKEND_API.GET_TARGET(config)).data
      this.rootStore.Target.setId(result.id)
      this.rootStore.Target.setType(result.type)
      return result
    } catch (err) {
      console.error(err)
    }
  }

  async getTargetOfComment(comment) {
    try {
      let config = {
        params: {
          feedbackID: comment.FeedbackId,
        },
      }
      const feedback = await (await BACKEND_API.GET_FEEDBACK(config)).data
      config = {
        params: {
          targetID: feedback.TargetId,
        },
      }
      const result = await (await BACKEND_API.GET_TARGET(config)).data
      this.rootStore.Target.setId(result.id)
      this.rootStore.Target.setType(result.type)
      return result
    } catch (err) {
      console.error(err)
    }
  }

  ProfileClear() {
    this.info = { fetching: false, error: null, data: null }
    this.about = { fetching: false, error: null, data: null }
  }
}
