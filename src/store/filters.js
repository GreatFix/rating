import { makeAutoObservable, runInAction } from 'mobx';
import bridge from '@vkontakte/vk-bridge';

class Filters {
  country = 0;
  city = 0;
  sex = 0;
  age_from = 14;
  age_to = 80;
  listCountries = [];
  listCities = [];
  constructor() {
    makeAutoObservable(this);
  }

  setCountry(country) {
    this.country = country;
  }

  setCity(city) {
    this.city = city;
  }

  setSex(sex) {
    this.sex = sex;
  }

  setAge_from(age_from) {
    this.age_from = age_from;
  }

  setAge_to(age_to) {
    this.age_to = age_to;
  }

  getCountries(token) {
    bridge
      .send('VKWebAppCallAPIMethod', {
        method: 'database.getCountries',
        params: {
          need_all: 1,
          count: 1000,
          access_token: token,
          v: '5.130',
        },
      })
      .then((res) => {
        runInAction(() => {
          this.listCountries = res.response.items;
        });
      })
      .catch((err) => console.error(err));
  }

  getCities(token, text = '') {
    bridge
      .send('VKWebAppCallAPIMethod', {
        method: 'database.getCities',
        params: {
          q: text,
          need_all: 1,
          count: 10,
          country_id: this.country.id,
          access_token: token,
          v: '5.130',
        },
      })
      .then((res) => {
        runInAction(() => {
          this.listCities = res.response.items;
        });
      })
      .catch((err) => console.error(err));
  }

  filterClear() {
    this.country = 0;
    this.city = 0;
    this.sex = 0;
    this.age_from = 14;
    this.age_to = 80;
    this.listCountries = [];
    this.listCities = [];
  }
}

export default new Filters();
