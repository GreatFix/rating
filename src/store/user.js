import { makeAutoObservable, runInAction, when } from 'mobx';
import bridge from '@vkontakte/vk-bridge';
export default class User {
  userID = null;
  firstName = null;
  lastName = null;
  backendToken = null;
  bridgeToken = null;
  bridgeTokenFG = {
    token: null,
    permission: null,
  };
  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    when(
      () => !this.userID,
      () => this.getUserInfo()
    );
    when(
      () => !this.bridgeToken,
      () => this.getBridgeToken()
    );
    when(
      () => !this.bridgeTokenFG.fetched,
      () => this.getBridgeTokenFG()
    );
  }

  getUserInfo() {
    bridge
      .send('VKWebAppGetUserInfo')
      .then((res) => {
        runInAction(() => {
          this.userID = String(res.id);
          this.firstName = res.first_name;
          this.lastName = res.last_name;
        });
      })
      .catch(toErrorLog);
  }

  setBackendToken(token) {
    this.backendToken = token;
  }

  getBridgeTokenFG() {
    bridge
      .send('VKWebAppGetAuthToken', {
        app_id: 7799989,
        scope: 'friends,groups',
      })
      .then((res) => {
        runInAction(() => {
          if ((res.access_token && !res.scope) || (res.access_token && res.scope === 'friends,groups')) {
            this.bridgeTokenFG.token = res.access_token;
            this.bridgeTokenFG.permission = 'allowed';
          }
        });
      })
      .catch((err) => {
        runInAction(() => {
          if (err.error_data.error_code === 4) {
            this.bridgeTokenFG.permission = 'denied';
          }
          console.error(err);
        });
      });
  }

  getBridgeToken() {
    bridge
      .send('VKWebAppGetAuthToken', {
        app_id: 7799989,
        scope: '',
      })
      .then((res) => {
        runInAction(() => {
          this.bridgeToken = res.access_token;
        });
      })
      .catch(toErrorLog);
  }
}

function toErrorLog(err) {
  console.error(err);
}
