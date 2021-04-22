import { makeAutoObservable } from 'mobx'
import BRIDGE_API from '../API/bridge'

export default class Filters {
  country = { id: 0, title: '' }
  city = { id: 0, title: '' }
  sex = 0
  age_from = 14
  age_to = 80
  listCountries = []
  listCities = []
  rootStore = null

  constructor(rootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  setCountry(country) {
    this.country = country
  }

  setCity(city) {
    this.city = city
  }

  setSex(sex) {
    this.sex = sex
  }

  setAge_from(age_from) {
    this.age_from = age_from
  }

  setAge_to(age_to) {
    this.age_to = age_to
  }

  setCountries(list) {
    this.listCountries = list
  }

  setCities(list) {
    this.listCities = list
  }

  async getCountries() {
    const params = {
      need_all: 1,
      count: 1000,
    }
    try {
      const result = await BRIDGE_API.DB_GET_COUNTRIES(params)
      this.setCountries(result.response.items)
    } catch (err) {
      console.error(err)
    }
  }

  async getCities(q = '') {
    const params = {
      q,
      need_all: 1,
      count: 10,
      country_id: this.country.id,
    }
    try {
      const result = await BRIDGE_API.DB_GET_CITIES(params)
      this.setCities(result.response.items)
    } catch (err) {
      console.error(err)
    }
  }

  filterClear() {
    this.country = { id: 0, title: '' }
    this.city = { id: 0, title: '' }
    this.sex = 0
    this.age_from = 14
    this.age_to = 80
    this.listCities = []
  }
}
