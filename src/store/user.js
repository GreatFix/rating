import { makeAutoObservable, runInAction } from 'mobx';
import bridge from '@vkontakte/vk-bridge';

class User {
  id = null;
  firstName = null;
  lastName = null;
  token = null;
  tokenFG = {
    token: null,
    permission: null,
  };
  friends = { fetched: false, list: [] };
  groups = { fetched: false, list: [] };
  searchedUsers = { fetched: false, list: [] };
  searchedGroups = { fetched: false, list: [] };
  constructor() {
    makeAutoObservable(this);
  }

  clearFetchedInfo() {
    this.friends = { fetched: false, list: [] };
    this.groups = { fetched: false, list: [] };
  }

  getUserInfo() {
    bridge
      .send('VKWebAppGetUserInfo')
      .then((res) => {
        runInAction(() => {
          this.id = res.id;
          this.firstName = res.first_name;
          this.lastName = res.last_name;
        });
      })
      .catch((err) => console.error(err));
  }

  // getTokenFG() {
  //   bridge
  //     .send('VKWebAppGetAuthToken', {
  //       app_id: 7799989,
  //       scope: 'friends,groups',
  //     })
  //     .then((res) => {
  //       runInAction(() => {
  //         if ((res.access_token && !res.scope) || (res.access_token && res.scope === 'friends,groups')) {
  //           this.tokenFG.token = res.access_token;
  //           this.tokenFG.permission = 'allowed';
  //         }
  //       });
  //     })
  //     .catch((err) => {
  //       runInAction(() => {
  //         if (err.error_data.error_code === 4) {
  //           this.tokenFG.permission = 'denied';
  //         }
  //         console.error(err);
  //       });
  //     });
  // }

  getTokenFG() {
    return new Promise((resolve, reject) => {
      return bridge
        .send('VKWebAppGetAuthToken', {
          app_id: 7799989,
          scope: 'friends,groups',
        })
        .then((res) => {
          runInAction(() => {
            if ((res.access_token && !res.scope) || (res.access_token && res.scope === 'friends,groups')) {
              this.tokenFG.token = res.access_token;
              this.tokenFG.permission = 'allowed';
              resolve('allowed');
            }
          });
        })
        .catch((err) => {
          runInAction(() => {
            if (err.error_data.error_code === 4) {
              this.tokenFG.permission = 'denied';
            }
            reject(err);
            console.error(err);
          });
        });
    });
  }
  getToken() {
    bridge
      .send('VKWebAppGetAuthToken', {
        app_id: 7799989,
        scope: '',
      })
      .then((res) => {
        runInAction(() => {
          this.token = res.access_token;
        });
      })
      .catch((err) => console.error(err));
  }

  fetchFriends(offset = 0, count = 20) {
    if (this.tokenFG.token) {
      bridge
        .send('VKWebAppCallAPIMethod', {
          method: 'friends.get',
          params: {
            count,
            offset,
            fields: 'id,nickname,domain,photo_50,city,activities',
            access_token: this.tokenFG.token,
            v: '5.130',
          },
        })
        .then((res) => {
          runInAction(() => {
            if (offset > 0) {
              if (!(offset > res.response.count)) this.friends.list = this.friends.list.concat(res.response.items);
            } else {
              this.friends.list = res.response.items;
              this.friends.fetched = true;
            }
          });
        })
        .catch((err) => console.error(err));
    }
  }

  fetchGroups(offset = 0, count = 20) {
    if (this.tokenFG.token) {
      bridge
        .send('VKWebAppCallAPIMethod', {
          method: 'groups.get',
          params: {
            extended: 1,
            count,
            offset,
            fields: 'id,members_count,photo_50',
            access_token: this.tokenFG.token,
            v: '5.130',
          },
        })
        .then((res) => {
          runInAction(() => {
            if (offset > 0) {
              if (!(offset > res.response.count)) this.groups.list = this.groups.list.concat(res.response.items);
            } else {
              this.groups.list = res.response.items;
              this.groups.fetched = true;
            }
          });
        })
        .catch((err) => console.error(err));
    }
  }

  searchUsers(text, filters, offset = 0, count = 20) {
    if (this.token) {
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
            access_token: this.token,
            v: '5.130',
          },
        })
        .then((res) => {
          runInAction(() => {
            if (offset > 0) {
              if (!(offset > res.response.count))
                this.searchedUsers.list = this.searchedUsers.list.concat(res.response.items);
            } else {
              this.searchedUsers.list = res.response.items;
              this.searchedUsers.fetched = true;
            }
          });
        })
        .catch((err) => console.error(err));
    }
  }

  searchGroups(text, filters, offset = 0, count = 20) {
    if (this.token) {
      bridge
        .send('VKWebAppCallAPIMethod', {
          method: 'groups.search',
          params: {
            q: text,
            ...filters,
            count,
            offset,
            fields: 'id,members_count,photo_50',
            access_token: this.token,
            v: '5.130',
          },
        })
        .then((res) => {
          runInAction(() => {
            if (offset > 0) {
              if (!(offset > res.response.count))
                this.searchedGroups.list = this.searchedGroups.list.concat(res.response.items);
            } else {
              this.searchedGroups.list = res.response.items;
              this.searchedGroups.fetched = true;
            }
          });
        })
        .catch((err) => console.error(err));
    }
  }
}

export default new User();
