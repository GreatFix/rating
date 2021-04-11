import { makeAutoObservable } from 'mobx';
import bridge from '@vkontakte/vk-bridge';
const FRIENDS = 'friends';
const GROUPS = 'groups';
const SEARCHED_USERS = 'searchedUsers';
const SEARCHED_GROUPS = 'searchedGroups';

export default class Bridge {
  friends = { fetching: false, error: null, list: [] };
  groups = { fetching: false, error: null, list: [] };
  searchedUsers = { fetching: false, error: null, list: [] };
  searchedGroups = { fetching: false, error: null, list: [] };

  constructor(rootStore) {
    makeAutoObservable(this, { fetchFriends: false, fetchGroups: false, searchUsers: false, searchGroups: false });
    this.rootStore = rootStore;
  }

  get bridgeTokenFG() {
    return this.rootStore.user.bridgeTokenFG.token;
  }

  get bridgeToken() {
    return this.rootStore.user.bridgeToken;
  }

  setFetching(name) {
    this[name].fetching = true;
  }
  setFetchedList(name, list) {
    this[name].list = list;
    this[name].fetching = false;
  }
  setErrorFetch(name, error) {
    this[name].error = error;
    this[name].fetching = false;
  }

  extractIdc(list, name) {
    const listIds = list.map((item) => item.id);
    this.rootStore.backend.getTargets(listIds, name);
  }

  clearFetchedInfo() {
    this.friends = { fetching: false, error: null, list: [] };
    this.groups = { fetching: false, error: null, list: [] };
  }

  setBackendData(array, container) {
    if (this[container].list && array) {
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < this[container].list.length; j++) {
          if (array[i].id === this[container].list[j].id)
            this[container].list[j] = { ...this[container].list[j], ...array[i] };
        }
      }
    }
  }

  fetchFriends(offset = 0, count = 20) {
    if (this.bridgeTokenFG && !(offset === 0 && this.friends.list.length > 0)) {
      this.setFetching(FRIENDS);
      bridge
        .send('VKWebAppCallAPIMethod', {
          method: 'friends.get',
          params: {
            count,
            offset,
            fields: 'id,nickname,domain,photo_50,city,activities',
            access_token: this.bridgeTokenFG,
            v: '5.130',
          },
        })
        .then((res) => {
          if (offset > 0) {
            if (offset > res.response.count) return;
            this.setFetchedList(FRIENDS, this.friends.list.concat(res.response.items));
          } else {
            this.setFetchedList(FRIENDS, res.response.items);
          }
          this.extractIdc(res.response.items, FRIENDS);
        })
        .catch((err) => this.setErrorFetch(FRIENDS, err));
    }
  }

  fetchGroups(offset = 0, count = 20) {
    if (this.bridgeTokenFG && !(offset === 0 && this.groups.list.length > 0)) {
      this.setFetching(GROUPS);
      bridge
        .send('VKWebAppCallAPIMethod', {
          method: 'groups.get',
          params: {
            extended: 1,
            count,
            offset,
            fields: 'id,members_count,photo_50',
            access_token: this.bridgeTokenFG,
            v: '5.130',
          },
        })
        .then((res) => {
          if (offset > 0) {
            if (offset > res.response.count) return;
            this.setFetchedList(GROUPS, this.groups.list.concat(res.response.items));
          } else {
            this.setFetchedList(GROUPS, res.response.items);
          }
          this.extractIdc(res.response.items, GROUPS);
        })
        .catch((err) => this.setErrorFetch(GROUPS, err));
    }
  }

  searchUsers(text, filters, offset = 0, count = 20) {
    if (this.bridgeToken) {
      this.setFetching(SEARCHED_USERS);
      bridge
        .send('VKWebAppCallAPIMethod', {
          method: 'users.search',
          params: {
            q: text,
            country: filters.country && filters.country.id,
            city: filters.city && filters.city.id,
            sex: filters.sex,
            age_from: filters.age_from,
            age_to: filters.age_to,
            count,
            offset,
            fields: 'id,nickname,domain,photo_50,city,activities',
            access_token: this.bridgeToken,
            v: '5.130',
          },
        })
        .then((res) => {
          if (offset > 0) {
            if (offset > res.response.count) return;
            this.setFetchedList(SEARCHED_USERS, this.searchedUsers.list.concat(res.response.items));
          } else {
            this.setFetchedList(SEARCHED_USERS, res.response.items);
          }
          this.extractIdc(res.response.items, SEARCHED_USERS);
        })
        .catch((err) => this.setErrorFetch(SEARCHED_USERS, err));
    }
  }

  searchGroups(text, filters, offset = 0, count = 20) {
    if (this.bridgeToken) {
      this.setFetching(SEARCHED_GROUPS);
      bridge
        .send('VKWebAppCallAPIMethod', {
          method: 'groups.search',
          params: {
            q: text,
            ...filters,
            count,
            offset,
            fields: 'id,members_count,photo_50',
            access_token: this.bridgeToken,
            v: '5.130',
          },
        })
        .then((res) => {
          if (offset > 0) {
            if (offset > res.response.count) return;
            this.setFetchedList(SEARCHED_GROUPS, this.searchedGroups.list.concat(res.response.items));
          } else {
            this.setFetchedList(SEARCHED_GROUPS, res.response.items);
          }
          this.extractIdc(res.response.items, SEARCHED_GROUPS);
        })
        .catch((err) => this.setErrorFetch(SEARCHED_GROUPS, err));
    }
  }
}
