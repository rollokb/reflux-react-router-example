'use strict';
import request          from 'superagent';
import {
  normalize,
  arrayOf
} from 'normalizr';


const getNextPageUrl = function(response) {
  const link = response.headers.link;
  
  if (!link) {
    return null;
  }

  const nextLink = link.split(',').filter(s => s.indexOf('rel="next"') > -1)[0];
  if (!nextLink) {
    return null;
  }

  return nextLink.split(';')[0].slice(1, -1);
};

const baseRequest = function(url, normalizeCallback) {
  return new Promise( 
    function(resolve, reject) {
      request.get(url)
        .end(function (error, response) {
          if (!response.ok) {
            reject(error);
          }
        
          const normalizedResults = normalizeCallback(response);
          resolve(normalizedResults);
        });
    });
};

const normalizeArray = function(response, schema) {
  const nextPageUrl = getNextPageUrl(response) || undefined;
  const normalized = normalize(response.body, arrayOf(schema));
  normalized.nextPageUrl = nextPageUrl;
  return normalized;
};


module.exports = { 
  getNextPageUrl: getNextPageUrl, 
  baseRequest: baseRequest,
  normalizeArray: normalizeArray
};
