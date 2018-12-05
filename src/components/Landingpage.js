import React, { Component } from 'react';
import '../styles/App.css';
import Navigation from './NavigationLog';
import { Redirect } from 'react-router-dom'
import Loginbody from './Loginbody';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sessionActions from '../actions/sessionActions';

class Landingpage extends Component {
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
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <div className="left ">
                <div className="container">
                  <div className="container container-info">
                    <h1> Unete a la nueva comunidad para compartir conocimiento!!</h1>
                    <div className="container container-items">
                      <div className="mt-5 mb-3">
                        <a className="items">
                          <i className="fas fa-search"></i>   Busca nuevas disciplinas o habilidades que desees aprender
                  </a><br></br>
                      </div>
                      <div className="mt-3 mb-3">
                        <a className="items">
                          <i className="fas fa-poll-h"></i>   Publica lo que quieras aprender o enseñar
                  </a>
                      </div>
                      <div className="mt-3 mb-3">
                        <a className="items">
                          <i className="fas fa-users"></i>   Unete a grupos con tus mismos intereses de aprendizaje y enseñanza
                  </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="right">
                <div className="container mt-5">
                  <Loginbody />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

const { bool } = PropTypes;

Landingpage.propTypes = {
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

export default connect(mapState, mapDispatch)(Landingpage);
