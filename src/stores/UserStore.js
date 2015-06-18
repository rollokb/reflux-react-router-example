'use strict';

import Reflux                   from 'reflux';
import IndexedListStoreMixin    from '../utils/IndexedListStoreMixin';
import { action as getUsers }  from '../actions/getUsers';
import assign from  'lodash/object/assign';


module.exports = Reflux.createStore({
  mixins: [IndexedListStoreMixin],

  init() {
    this._users = {};
    this.listenTo(getUsers, 'onMakeUserRequest');
    this.listenTo(getUsers.failed, 'onMakeUserRequestFailed');
    this.listenTo(getUsers.completed, 'onMakeUserRequestCompleted');
  },

  onMakeUserRequest(strategy) {
    const list = this._getList(strategy.listName);

    strategy.request(list.getNextPageUrl()).then(function (result) {
      this.onLoadPageWithId(strategy.listName);
      getUsers.completed(strategy.listName, result);
    }.bind(this));
  },


  onMakeUserRequestFailed() {

  },

  onMakeUserRequestCompleted(listId, result) {
    this._users = assign(this._users, result.entities.users);
    this.onLoadPageWithIdCompleted(listId, result);
    this.trigger(this);
  },
  
  get(id) {
    return this._users[id];
  },

  getByStrategy(strategy) {
    const list = this._getList(strategy.listName);
    return list.getIds().map(this.get);
  },


});
