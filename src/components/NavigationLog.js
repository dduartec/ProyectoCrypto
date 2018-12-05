import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import '../styles/App.css';

class NavigationLog extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark">
          <NavLink to="/" className="navbar-brand">
            Knowledge Community
          </NavLink>
         {/*} <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#buttons">
            <span className="navbar-toggler-icon"></span>
          </button>

            <div className="collapse navbar-collapse" id="buttons">
              <div className="navbar-nav ml-auto">
              <NavLink to="/signup" className="btn btn-warning d-lg-inline-block mb-3 mb-md-1 ml-md-3" >REGISTRATE</NavLink>
              <NavLink to="/login" className="btn btn-info d-lg-inline-block mb-3 mb-md-1 ml-md-3">INGRESAR</NavLink>
              </div>
    </div>   */}
      </nav>
    );
  }
}

export default NavigationLog;