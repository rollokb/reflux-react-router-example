'use strict';

import React        from 'react'; 
import {
  Navbar,
  Nav,
  NavItem,
  Panel,
  Input,
  Button
} from 'react-bootstrap';
import UserList     from './UserList.react';

import { TransitionHook, Navigation, Link }     from 'react-router';


const App = React.createClass({
  mixins: [Navigation, TransitionHook],

  routerWillLeave() {
    console.log("routerWillLeave");
  },

  render: function() {
    return (
      <div>
        <div className="container">
          <Navbar>
            <Nav>
              <NavItem eventKey={1} href='#'>Reflux React Router Example</NavItem>
            </Nav>
          </Navbar>
          <Panel>
            <Input  
                   placeholder='Enter user or repo'
                   hasFeedback
                   ref='input'
                   type='text'
                   onChange={this.goToResource}
                />
            <Button onClick={this.goToResource} bsStyle='primary'>Go</Button>
          </Panel>
        </div>
        
        {this.props.children}
        
      </div>
    );
  },

  goToResource() {
    this.transitionTo(this.refs.input.getValue());
  }
});

module.exports = App;
