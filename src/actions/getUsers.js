'use strict';

import Reflux           from 'reflux';
import {
  Schema
} from 'normalizr';

import {
  baseRequest,
  getNextPageUrl,
  normalizeArray
} from '../utils/APIUtils';

const getUsers = Reflux.createAction({ asyncResult: true });
const userSchema = new Schema('users', { idAttribute: 'login' });



function normalizeUsers(response) {
  return normalizeArray(response, userSchema);
}

function usersByRepo(repo) {
  const listName = "USERS_BY_REPO_"+repo;
  
  const request = function(nextPageUrl) {
    if (nextPageUrl) {
      return baseRequest(nextPageUrl, normalizeUsers);
    } else {
      const url = "http://api.github.com/repos/" + repo + "/stargazers";
      return baseRequest(url, normalizeUsers);
    }
  };

  return {
    listName: listName,
    request: request
  };
}


module.exports = {
  action: getUsers,
  strategies: {
    usersByRepo: usersByRepo
  }
};
