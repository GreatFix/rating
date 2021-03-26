import { makeAutoObservable, runInAction } from 'mobx';
import bridge from '@vkontakte/vk-bridge';

class DetailsUser {
  id = null;
  info = null;
  constructor() {
    makeAutoObservable(this);
  }

  getInfo(token) {
    bridge
      .send('VKWebAppCallAPIMethod', {
        method: 'users.get',
        params: {
          user_ids: `${this.id}`,
          fields: 'domain,photo_50,city,activities',
          access_token: token,
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

export default new DetailsUser();
