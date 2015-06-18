'use strict';

import PaginatedList          from './PaginatedList';


const PROXIED_PAGINATED_LIST_METHODS = [
  'getIds', 'getPageCount', 'getNextPageUrl',
  'isExpectingPage', 'isLastPage'
]

export default {

  init() {
    this._list = new PaginatedList();
    
    PROXIED_PAGINATED_LIST_METHODS.forEach(method => {
      const list = this._list;

      this[method] = function (...args) {
        return list[method].call(list, args);
      }
    }.bind(this));
  },

  onLoadPage() {
    this._list.expectPage();
    this.trigger(this);
  },
  
  onLoadPageCompleted(action) {
    this._list.receivePage(
      action.result,
      action.nextPageUrl
    );
    this.trigger(this);
  },

  onLoadPageFailed(action) {
    this._list.cancelPage();
    this.trigger(this);
  },

  getList() {
    return this._list;
  },

}
