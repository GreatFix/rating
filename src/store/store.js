import { makeAutoObservable } from 'mobx'
import React from 'react'
import User from './User'
import Find from './Find'
import Backend from './Backend'
import Filters from './Filters'
import Target from './Target'
import Feedback from './Feedback'
import Comment from './Comment'
import Navigation from './Navigation'
import Interesting from './Interesting'
import Profile from './Profile'
import { enableLogging } from 'mobx-logger'

const config = {
  predicate: () => true,
  action: true,
  reaction: false,
  transaction: true,
  compute: true,
}

enableLogging(config)

export class Store {
  constructor() {
    makeAutoObservable(this)
    this.User = new User(this)
    this.Find = new Find(this)
    this.Backend = new Backend(this)
    this.Filters = new Filters(this)
    this.Target = new Target(this)
    this.Feedback = new Feedback(this)
    this.Comment = new Comment(this)
    this.Navigation = new Navigation(this)
    this.Interesting = new Interesting(this)
    this.Profile = new Profile(this)
  }
}

export const StoreContext = React.createContext()
