import { makeAutoObservable, when } from 'mobx'
import BACKEND_API from '../API/backend'

const CREATE_COMMENT = 'createComment'

export default class Comment {
  content = ''
  feedbackId = null
  greetingID = null
  greetingName = ''
  images = []
  validateError = ''
  sending = false
  ready = false
  type = CREATE_COMMENT
  commentID = null
  constructor(rootStore) {
    makeAutoObservable(this)

    this.rootStore = rootStore
  }

  get userID() {
    return this.rootStore.User.userID
  }

  init({
    feedbackId = null,
    content = '',
    greetingID = null,
    greetingName = '',
    images = [],
    commentID = null,
    type = CREATE_COMMENT,
  }) {
    this.content = content
    this.feedbackId = feedbackId
    this.greetingID = greetingID
    this.greetingName = greetingName
    this.images = images
    this.type = type
    this.validateError = ''
    this.sending = false
    this.ready = false
    this.commentID = commentID
  }
  clear() {
    this.content = ''
    this.feedbackId = null
    this.greetingID = null
    this.greetingName = ''
    this.images = []
    this.type = CREATE_COMMENT
    this.validateError = ''
    this.sending = false
    this.ready = false
    this.commentID = null
  }

  async request() {
    await when(() => this.ready)
    try {
      let result
      if (this.greetingName !== this.content.substring(0, this.greetingName.length)) {
        this.setGreetingID(null)
        this.setGreetingName(null)
      }
      if (this.type === CREATE_COMMENT) {
        result = await this.createComment(
          this.feedbackId,
          this.greetingName ? this.content.slice(this.greetingName.length + 1) : this.content,
          this.images,
          this.greetingID,
          this.greetingName
        )
      } else {
        result = await this.updateComment(
          this.commentID,
          this.greetingName ? this.content.slice(this.greetingName.length + 1) : this.content,
          this.images,
          this.greetingID,
          this.greetingName
        )
      }

      this.setSending(false)
      return result
    } catch (err) {
      console.error(err)
    }
  }

  setType(type) {
    this.type = type
  }
  setContent(content) {
    this.content = content
  }
  setFeedbackId(feedbackId) {
    this.feedbackId = feedbackId
  }
  setGreetingID(greetingID) {
    this.greetingID = greetingID
  }
  setGreetingName(greetingName) {
    this.greetingName = greetingName
  }
  setImages(images) {
    this.images = images
  }

  setValidateError(validateError) {
    this.validateError = validateError
  }
  setSending(sending) {
    this.sending = sending
  }
  setReady(ready) {
    this.ready = ready
  }

  async createComment(feedbackId, content, images, greetingID = null, greetingName = '') {
    const config = {
      params: {
        userID: this.userID,
      },
    }
    const data = {
      feedbackId,
      content,
      images,
      greetingID,
      greetingName,
    }
    return await BACKEND_API.POST_COMMENT(data, config)
  }

  async updateComment(commentId, content, images, greetingID = null, greetingName = '') {
    const config = {
      params: {
        userID: this.userID,
      },
    }
    const data = {
      userID: this.userID,
      commentId,
      content,
      images,
      greetingID,
      greetingName,
    }
    return await BACKEND_API.PUT_COMMENT(data, config)
  }

  async deleteComment(commentId) {
    const config = {
      data: { commentId },
      params: {
        userID: this.userID,
      },
    }
    return await BACKEND_API.DELETE_COMMENT(config)
  }
}
