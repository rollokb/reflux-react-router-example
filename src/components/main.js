'use strict';

import { Router, Route }              from 'react-router';
import HashHistory from 'react-router/lib/HashHistory';

import React                          from 'react';
import RefluxReactRouterExampleApp    from './RefluxReactRouterExampleApp';
import UserList     from './UserList.react';
import RepoList     from './RepoList.react';


React.render((
  <Router history={new HashHistory()}>
    <Route path="/" component={RefluxReactRouterExampleApp}>
      <Route path=":login/:repo" name="users"  component={UserList}/>
      <Route path=":login" name="repos"  component={RepoList}/>
    </Route>
  </Router>
), document.body);
