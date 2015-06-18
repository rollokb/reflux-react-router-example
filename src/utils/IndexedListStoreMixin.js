'use strict';

import PaginatedList      from './PaginatedList';

const PROXIED_PAGINATED_LIST_METHODS = [
  'getIds', 'getPageCount', 'getNextPageUrl',
  'isExpectingPage', 'isLastPage'
];

const _prefix = 'ID_';


export default {
  _lists: {},

  init() {
    PROXIED_PAGINATED_LIST_METHODS.forEach(function (method) {
      this[method] = function (...args) {
        const id = args.shift();
        if (typeof id === 'undefined') {
          throw new Error('Indexed pagination store methods expect ID as first parameter.');
        }

        const list = this._getList(id);
        return list[method].call(list, args);
    
      }.bind(this);
    }.bind(this));
  },

  onLoadPageWithId(id) {
    const list = this._getList(id);
    list.expectPage();
  },

  onLoadPageWithIdCompleted(id, action) {
    const list = this._getList(id);
    list.receivePage(
      action.result,
      action.nextPageUrl    
    );
  },

  onLoadPageWithIdFailed(id) {
    const list = this._getList(id);
    list.cancelPage();
  },

  _getList(id) {
    const key = _prefix + id;
    
    if (!this._lists[key]) {
      this._lists[key] = new PaginatedList();
    }

    return this._lists[key];
  }
};
