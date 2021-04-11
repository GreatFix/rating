import { makeAutoObservable } from 'mobx';
import React from 'react';
import User from './user';
import Bridge from './bridge';
import Backend from './backend';
import Filters from './filters';
import DetailsGroup from './detailsGroup';
import DetailsUser from './detailsUser';
import { enableLogging } from 'mobx-logger';

const config = {
  predicate: () => true,
  action: true,
  reaction: false,
  transaction: true,
  compute: true,
};

enableLogging(config);

export class Store {
  constructor() {
    makeAutoObservable(this);
    this.user = new User(this);
    this.bridge = new Bridge(this);
    this.backend = new Backend(this);
    this.filters = new Filters(this);
    this.detailsGroup = new DetailsGroup(this);
    this.detailsUser = new DetailsUser(this);
  }
}

export const StoreContext = React.createContext();
