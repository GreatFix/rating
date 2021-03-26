import { makeAutoObservable, runInAction } from 'mobx';
import bridge from '@vkontakte/vk-bridge';

class User {
  id = localStorage.getItem('USER_ID');
  firstName = localStorage.getItem('USER_FIRST_NAME');
  lastName = localStorage.getItem('USER_LAST_NAME');
  token = localStorage.getItem('USER_TOKEN');
  tokenFG = {
    token: localStorage.getItem('USER_TOKEN_FG'),
    permission: localStorage.getItem('USER_TOKEN_FG_ACCESS'),
  };
  friends = { fetched: false, list: [] };
  groups = { fetched: false, list: [] };
  searchedUsers = { fetched: false, list: [] };
  searchedGroups = { fetched: false, list: [] };
  constructor() {
    makeAutoObservable(this);
  }

  getUserInfo() {
    bridge
      .send('VKWebAppGetUserInfo')
      .then((res) => {
        runInAction(() => {
          this.id = res.id;
          this.firstName = res.first_name;
          this.lastName = res.last_name;
          localStorage.setItem('USER_ID', res.id);
          localStorage.setItem('USER_FIRST_NAME', res.first_name);
          localStorage.setItem('USER_LAST_NAME', res.last_name);
        });
      })
      .catch((err) => console.error(err));
  }

  getTokenFG() {
    bridge
      .send('VKWebAppGetAuthToken', {
        app_id: 7799989,
        scope: 'friends,groups',
      })
      .then((res) => {
        runInAction(() => {
          if (
            (res.access_token && !res.scope) ||
            (res.access_token && res.scope === 'friends,groups')
          ) {
            this.tokenFG.token = res.access_token;
            this.tokenFG.permission = 'allowed';
            localStorage.setItem('USER_TOKEN_FG', res.access_token);
            localStorage.setItem('USER_TOKEN_FG_ACCESS', 'allowed');
          }
        });
      })
      .catch((err) => {
        runInAction(() => {
          if (err.error_data.error_code === 4) {
            this.tokenFG.permission = 'denied';
            localStorage.setItem('USER_TOKEN_FG_ACCESS', 'denied');
          }
          console.error(err);
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
          localStorage.setItem('USER_TOKEN', res.access_token);
        });
      })
      .catch((err) => console.error(err));
  }

  fetchFriends(count = 50, offset = 0) {
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
            this.friends.list = res.response.items;
            this.friends.fetched = true;
            console.log(res.response);
          });
        })
        .catch((err) => console.error(err));
    }
  }

  fetchGroups(count = 20, offset = 0) {
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
            this.groups.list = res.response.items;
            this.groups.fetched = true;
            console.log(res.response);
          });
        })
        .catch((err) => console.error(err));
    }
  }

  searchUsers(text, filters, count = 20, offset = 0) {
    if (this.token) {
      bridge
        .send('VKWebAppCallAPIMethod', {
          method: 'users.search',
          params: {
            q: text,
            ...filters,
            count,
            offset,
            fields: 'id,nickname,domain,photo_50,city,activities',
            access_token: this.token,
            v: '5.130',
          },
        })
        .then((res) => {
          runInAction(() => {
            this.searchedUsers.list = res.response.items;
            this.searchedUsers.fetched = true;
            console.log(res.response);
          });
        })
        .catch((err) => console.error(err));
    }
  }

  searchGroups(text, filters, count = 20, offset = 0) {
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
            this.searchedGroups.list = res.response.items;
            this.searchedGroups.fetched = true;
            console.log(res.response);
          });
        })
        .catch((err) => console.error(err));
    }
  }
}

export default new User();
