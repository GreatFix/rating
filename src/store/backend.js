import { makeAutoObservable, when } from 'mobx';
import qs from 'querystring';
import BACKEND_API from '../API/backend';

const USER = 'user';

export default class Backend {
  user = { fetching: false, error: null, data: null };

  constructor(rootStore) {
    makeAutoObservable(this, { getUser: false, getTarget: false, getTargets: false });
    this.rootStore = rootStore;
    when(
      () => this.userID,
      () => this.backendAuth()
    );
  }

  get userID() {
    return this.rootStore.User.userID;
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

  async backendAuth() {
    const { stringParams, sign } = getQueryParams();
    const data = {
      userID: this.userID,
      stringParams,
      sign,
    };
    try {
      const result = await BACKEND_API.POST_AUTH(data);
      BACKEND_API.SET_TOKEN(result.data.token);
    } catch (err) {
      toErrorLog(err);
    }
  }

  async getUser() {
    const config = {
      params: {
        userID: this.userID,
      },
    };
    try {
      this.setFetching(USER);
      const result = await BACKEND_API.GET_USER(config);
      this.setFetchedData(USER, result.data.user);
    } catch (err) {
      this.setErrorFetch(USER, err);
    }
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

function toErrorLog(err) {
  console.error(err);
}
