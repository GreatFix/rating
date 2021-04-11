import { makeAutoObservable, runInAction, when } from 'mobx';
import axios from 'axios';
import qs from 'querystring';

const USER = 'user';
const TARGET = 'target';
const ARRAY_TARGETS = 'arrayTargets';

const AXIOS = axios.create({
  baseURL: 'https://rating-backend.herokuapp.com',
});

export default class Backend {
  backendToken = null;
  user = { fetching: false, error: null, data: null };
  target = { fetching: false, error: null, data: null };
  arrayTargets = { fetching: false, error: null, data: [] };

  constructor(rootStore) {
    makeAutoObservable(this, { getUser: false, getTarget: false, getTargets: false });
    this.rootStore = rootStore;
    when(
      () => this.userID,
      () => this.getBackendToken()
    );
  }

  get userID() {
    return this.rootStore.user.userID;
  }

  setFetching(name) {
    this[name].fetching = true;
  }
  setFetchedData(name, data) {
    this[name].data = data;
    this[name].fetching = false;
  }
  setErrorFetch(name, error) {
    this[name].error = error;
    this[name].fetching = false;
  }

  getBackendToken() {
    const { stringParams, sign } = getQueryParams();
    AXIOS({
      method: 'POST',
      url: '/auth',
      data: {
        userID: this.userID,
        stringParams,
        sign,
      },
    })
      .then((res) => {
        runInAction(() => {
          this.backendToken = res.data.token;
          AXIOS.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
        });
      })
      .catch(toErrorLog);
  }

  getUser() {
    if (!this.backendToken) return;
    this.setFetching(USER);
    AXIOS({
      method: 'GET',
      url: '/user',
      params: {
        userID: this.userID,
      },
    })
      .then((res) => {
        this.setFetchedData(USER, res.data.user);
      })
      .catch((err) => this.setErrorFetch(USER, err));
  }

  getTarget(targetID) {
    if (!this.backendToken) return;
    this.setFetching(TARGET);
    AXIOS({
      method: 'GET',
      url: '/target',
      params: {
        targetID,
      },
    })
      .then((res) => {
        this.setFetchedData(TARGET, res.data.target);
      })
      .catch((err) => this.setErrorFetch(TARGET, err));
  }

  getTargets(arrayTargetIDs, name) {
    this.setFetching(ARRAY_TARGETS);
    AXIOS({
      method: 'GET',
      url: '/targets',
      params: {
        arrayTargetIds: arrayTargetIDs,
      },
    })
      .then((res) => {
        this.setFetchedData(ARRAY_TARGETS, res.data.targets);
        this.rootStore.bridge.setBackendData(res.data.targets, name);
      })
      .catch((err) => this.setErrorFetch(ARRAY_TARGETS, err));
  }

  createNewFeedback(targetID, content, conclusion, images) {
    if (!this.backendToken) return;
    AXIOS({
      method: 'POST',
      url: '/feedback',
      params: {
        userID: this.userID,
      },
      data: {
        targetID,
        content,
        conclusion,
        images,
      },
    })
      .then(toLog)
      .catch(toErrorLog);
  }

  createNewComment(feedbackId, content, conclusion, images) {
    if (!this.backendToken) return;
    AXIOS({
      method: 'POST',
      url: '/comment',
      data: {
        userID: this.userID,
        feedbackId,
        content,
        conclusion,
        images,
      },
    })
      .then(toLog)
      .catch(toErrorLog);
  }

  updateFeedback(feedbackId, content, conclusion, images) {
    if (!this.backendToken) return;
    AXIOS({
      method: 'PUT',
      url: '/feedback',
      data: {
        userID: this.userID,
        feedbackId,
        content,
        conclusion,
        images,
      },
    })
      .then(toLog)
      .catch(toErrorLog);
  }

  updateComment(commentId, content, conclusion, images) {
    if (!this.backendToken) return;
    AXIOS({
      method: 'PUT',
      url: '/comment',
      data: {
        userID: this.userID,
        commentId,
        content,
        conclusion,
        images,
      },
    })
      .then(toLog)
      .catch(toErrorLog);
  }

  deleteFeedback(feedbackId) {
    if (!this.backendToken) return;
    AXIOS({
      method: 'DELETE',
      url: '/feedback',
      data: {
        userID: this.userID,
        feedbackId,
      },
    })
      .then(toLog)
      .catch(toErrorLog);
  }

  deleteComment(commentId) {
    if (!this.backendToken) return;
    AXIOS({
      method: 'DELETE',
      url: '/comment',
      data: {
        userID: this.userID,
        commentId,
      },
    })
      .then(toLog)
      .catch(toErrorLog);
  }
}

function getQueryParams() {
  const urlParams = qs.parse(window.location.search.slice(1));
  const ordered = {};
  Object.keys(urlParams)
    .sort()
    .forEach((key) => {
      if (key.slice(0, 3) === 'vk_') {
        ordered[key] = urlParams[key];
      }
    });

  const stringParams = qs.stringify(ordered);
  return { stringParams, sign: urlParams.sign };
}

function toLog(res) {
  console.log(res);
}

function toErrorLog(err) {
  console.error(err);
}
