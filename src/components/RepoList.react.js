'use strict';

import React        from 'react';
import Reflux       from 'reflux';
import { TransitionHook, Navigation }     from 'react-router';
import {
  Button,
  Thumbnail,
  Grid,
  Row,
  Col,
  Panel
} from 'react-bootstrap';

import RepoStore    from '../stores/RepoStore';
import { action as getRepos }  from '../actions/getRepos';
import { strategies }          from '../actions/getRepos';

function parseLogin(params) {
  return params.login;
}

module.exports = React.createClass({
  mixins: [Navigation, Reflux.listenTo(RepoStore, 'onMakeRepoRequestCompleted')],

  getStrategy() {
      return strategies.reposByUser(parseLogin(this.props.params));
  },

  componentDidMount() {
    getRepos(this.getStrategy());
  },

  componentWillReceiveProps(newProps) {
    if (parseLogin(newProps.params) !== parseLogin(this.props.params)) {
      getRepos(strategies.reposByUser(parseLogin(newProps.params)));
    }
  },
  
  getInitialState() {
    return {
      repos: []
    };
  },

  onMakeRepoRequestCompleted(store) {
    const repos = store.getByStrategy(this.getStrategy());
    this.setState({
      repos: repos
    });
  },
  
  loadMore() {
    getRepos(this.getStrategy());
  },

  render() {
    const repos = this.state.repos;

    return (
      <div  className="container">
        <h1>{this.props.params.login} - starred repos</h1>
        {repos.map( (repo, idx)  => {
          return <Panel key={idx}>{repo.name}</Panel>;
        })}
        <Button onClick={this.loadMore}>load more</Button>
      </div>
    );
  }
});
