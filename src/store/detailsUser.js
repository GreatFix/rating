import { makeAutoObservable, runInAction } from 'mobx';
import bridge from '@vkontakte/vk-bridge';

export default class DetailsUser {
  id = null;
  info = null;

  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  get bridgeToken() {
    return this.rootStore.user.bridgeToken.token;
  }

  getInfo() {
    bridge
      .send('VKWebAppCallAPIMethod', {
        method: 'users.get',
        params: {
          user_ids: `${this.id}`,
          fields: 'domain,photo_50,city,activities',
          access_token: this.bridgeToken,
          v: '5.130',
        },
      })
      .then((res) => {
        runInAction(() => {
          this.info = res.response[0];
          console.log(res);
        });
      })
      .catch((err) => console.error(err));
  }

  setId(id) {
    this.id = id;
  }
  infoClear() {
    this.id = null;
    this.info = null;
  }
}
