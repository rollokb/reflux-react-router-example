'use strict';

import React        from 'react';
import Reflux       from 'reflux';
import {
  Button,
  Thumbnail,
  Grid,
  Row,
  Col
} from 'react-bootstrap';

import UserStore    from '../stores/UserStore';
import { action as getUsers }  from '../actions/getUsers';
import { strategies }          from '../actions/getUsers';


function parseRepo(params) {
  return params.login + '/' + params.repo
}

module.exports = React.createClass({
  mixins: [Reflux.listenTo(UserStore, 'onMakeUserRequestCompleted')],
  
  getStrategy() {
      return strategies.usersByRepo(parseRepo(this.props.params));
  },

  getInitialState() {
    return {
      users: []
    };
  },

  onMakeUserRequestCompleted(store) {
    this.setState({
      users: store.getByStrategy(this.getStrategy())
    });
  },

  componentDidMount() {
    getUsers(this.getStrategy());
  },
  
  onLoadMore() {
    getUsers(this.getStrategy());
  },
  
  componentWillReceiveProps(newProps) {
    if (parseRepo(newProps.params) !== parseRepo(this.props.params)) {
      getUsers(strategies.usersByRepo(parseRepo(newProps.params)));
    }
  },

  renderRows() {
    const users = this.state.users;
    const rows = [];

    for (var i=0; i<users.length; i=i+2) {
      const user1 = users[i];
      const user2 = users[i+1];

      const row = (
         <Row className="users">
            <Col md={12}>
              <Thumbnail src={user1.avatar_url}>
                <h1>{user1.login}</h1>
              </Thumbnail>
            </Col>
          </Row>
      );

      rows.push(row);
    }
    
    return rows;
  },
  
  render() {
    const users = this.state.users;
    return (
      <Grid>
        {this.renderRows()}     
        <Button onClick={this.onLoadMore}>load more</Button>
      </Grid>
    );
  },
});
