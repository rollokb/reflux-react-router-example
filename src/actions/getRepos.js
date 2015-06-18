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


const userSchema = new Schema('users', { idAttribute: 'login' });
const getRepos = Reflux.createAction({ asyncResult: true });
const repoSchema = new Schema('repos', { idAttribute: 'full_name' });
repoSchema.define({
    owner: userSchema
});


function normalizeRepos(response) {
  return normalizeArray(response, repoSchema);
}

function reposByUser(user) {
  const listName = "REPOS_BY_USER_"+user;
  
  const request = function(nextPageUrl) {
    if (nextPageUrl) {
      return baseRequest(nextPageUrl, normalizeRepos);
    } else {
      const url = "http://api.github.com/users/" + user + "/repos";
      return baseRequest(url, normalizeRepos);
    }
  };

  return {
    listName: listName,
    request: request
  };
}

module.exports = {
  action: getRepos,
  strategies: {
    reposByUser: reposByUser
  }
};
