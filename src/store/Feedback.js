import { makeAutoObservable, when } from 'mobx';
import BACKEND_API from '../API/backend';

const CREATE_FEEDBACK = 'createFeedback';
export default class Feedback {
  conclusion = '';
  content = '';
  images = [];
  uploadServer = null;
  validateError = '';
  sending = false;
  ready = false;
  type = CREATE_FEEDBACK;
  feedbackID = null;
  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  get userID() {
    return this.rootStore.User.userID;
  }

  get targetID() {
    return this.rootStore.Target.id;
  }
  init({ feedbackID = null, conclusion = '', content = '', images = [], type = CREATE_FEEDBACK }) {
    this.conclusion = conclusion;
    this.content = content;
    this.images = images;
    this.type = type;
    this.validateError = '';
    this.sending = false;
    this.ready = false;
    this.feedbackID = feedbackID;
  }
  clear() {
    this.conclusion = '';
    this.content = '';
    this.images = [];
    this.type = CREATE_FEEDBACK;
    this.validateError = '';
    this.sending = false;
    this.ready = false;
    this.feedbackID = null;
  }

  async request() {
    await when(() => this.ready);
    try {
      let result;
      if (this.type === CREATE_FEEDBACK)
        result = await this.createFeedback(this.targetID, this.content, this.conclusion, this.images);
      else result = await this.updateFeedback(this.feedbackID, this.content, this.conclusion, this.images);

      this.setSending(false);
      return result;
    } catch (err) {
      console.error(err);
    }
  }

  setType(type) {
    this.type = type;
  }

  setConclusion(conclusion) {
    this.conclusion = conclusion;
  }
  setContent(content) {
    this.content = content;
  }
  setImages(images) {
    this.images = images;
  }

  setValidateError(validateError) {
    this.validateError = validateError;
  }
  setSending(sending) {
    this.sending = sending;
  }
  setReady(ready) {
    this.ready = ready;
  }

  async createFeedback(targetID, content, conclusion, images) {
    const config = {
      params: {
        userID: this.userID,
      },
    };
    const data = {
      targetID,
      content,
      conclusion,
      images,
    };
    return await BACKEND_API.POST_FEEDBACK(data, config);
  }

  async updateFeedback(feedbackId, content, conclusion, images) {
    const config = {
      params: {
        userID: this.userID,
      },
    };

    const data = {
      feedbackId: parseInt(feedbackId),
      content,
      conclusion,
      images,
    };
    return await BACKEND_API.PUT_FEEDBACK(data, config);
  }

  async deleteFeedback(feedbackId) {
    const config = {
      data: { feedbackId: feedbackId },
      params: {
        userID: this.userID,
      },
    };
    return await BACKEND_API.DELETE_FEEDBACK(config);
  }
}
