'use strict';

import Reflux           from 'reflux';
import IndexedListStoreMixin    from '../utils/IndexedListStoreMixin';
import assign from  'lodash/object/assign';

import { action as getRepos }  from '../actions/getRepos';

module.exports = Reflux.createStore({
  mixins: [IndexedListStoreMixin],

  init() {
    this._repos = {};
    this.listenTo(getRepos, 'onMakeRepoRequest');
    this.listenTo(getRepos.failed, 'onMakeRepoRequestFailed');
    this.listenTo(getRepos.completed, 'onMakeRepoRequestCompleted');
  },

  onMakeRepoRequest(strategy) {
    const list = this._getList(strategy.listName);

    strategy.request(list.getNextPageUrl()).then(function (result) {
      this.onLoadPageWithId(strategy.listName);
      getRepos.completed(strategy.listName, result);
    }.bind(this));
  },

  onMakeRepoRequestFailed() {

  },

  onMakeRepoRequestCompleted(listId, result) {
    this._repos = assign(this._repos, result.entities.repos);
    this.onLoadPageWithIdCompleted(listId, result);
    this.trigger(this);
  },

  get(id) {
    return this._repos[id];
  },

  getByStrategy(strategy) {
    const list = this._getList(strategy.listName);
    return list.getIds().map(this.get);
  }
});
