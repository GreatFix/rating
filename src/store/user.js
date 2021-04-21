import { makeAutoObservable, when } from 'mobx';

import BRIDGE_API from '../API/bridge';

export default class User {
  userID = null;
  access_token = null;
  permissions = '';
  firstName = null;
  lastName = null;
  error = null;

  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.permissions = window.location.search.slice(26).split('&')[0];

    when(
      () => true,
      () => this.getUserToken('photos, groups, friends')
    );
    when(
      () => !this.userID,
      () => {
        this.getUserInfo();
      }
    );
  }

  setUserInfo(res) {
    this.userID = res.id;
    this.firstName = res.first_name;
    this.lastName = res.last_name;
  }

  setPermissons(scope) {
    this.permissions = scope;
  }

  setToken(token) {
    this.access_token = token;
  }

  setError(err) {
    this.error = err;
  }

  async getUserInfo() {
    try {
      const result = await BRIDGE_API.GET_USER_INFO();
      this.setUserInfo(result);
    } catch (err) {
      this.setError(err);
    }
  }

  async getUserToken(scope = '') {
    try {
      const result = await BRIDGE_API.GET_AUTH_TOKEN(scope);
      BRIDGE_API.SET_TOKEN(result.access_token, result.scope);
      this.setToken(result.access_token);
      this.setPermissons(this.permissions + ',' + result.scope);
    } catch (err) {
      this.setError(err);
    }
  }
}
