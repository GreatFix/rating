import { makeAutoObservable } from 'mobx'

export default class Navigation {
  history = []

  constructor(rootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  get last() {
    return this.history[this.history.length - 1]
  }

  add(hash) {
    this.history.push(hash)
  }
  back() {
    return this.history.pop()
  }

  clear() {
    this.history = []
  }
}
