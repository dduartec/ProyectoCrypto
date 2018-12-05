import React, { Component } from 'react';
import '../styles/Log.css';
import Navigation from './NavigationLog';
import { Redirect } from 'react-router-dom'
import Loginbody from './Loginbody';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sessionActions from '../actions/sessionActions';

class Login extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      user: {
        email: '',
        password: ''
      }
    };
  }
  checkSession() {
    if (this.props.authenticated) {
      () => {
        <Redirect to={{
          pathname: '/welcome',
        }} />
      }
    }

  }
  render() {
    if (this.props.authenticated) {
      return (
        <Redirect to={{
          pathname: '/',
        }} />);
    }
    return (
      <div>
        <Navigation />
        <div className="body-login">
          <Loginbody />
        </div>
      </div>
    );
  }
}

const { bool } = PropTypes;

Login.propTypes = {
  authenticated: bool.isRequired
};

const mapState = (state) => ({
  authenticated: state.session.authenticated
});

const mapDispatch = (dispatch) => {
  return {
    actions: bindActionCreators(sessionActions, dispatch)
  };
};

export default connect(mapState, mapDispatch)(Login);