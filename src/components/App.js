// This component handles the App template used on every page.
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router,Route,Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PrivateRoute from './PrivateRoute';

import Login from './Login';
import Error from './Error';
import Registro from './Registro';
import groups from './groups';
import search from './search';
import members from './members';
import msgs from './msgs';
import profile from './profile';
import Landingpage from './Landingpage';
import Home from './Home';
import editprofile from './editprofile';
import Service from './Service';
import Services from './Services';
const App = ({ authenticated, checked }) => (
  <Router>
    {checked &&
      <div>
        <Switch>
        <PrivateRoute exact path="/" component={Home} authenticated={authenticated} />
        <Route path="/login" component={Login} exact />
        <Route path="/welcome" component={Landingpage} exact />
        <Route path="/signup" component={Registro} exact />
        <PrivateRoute path='/groups/:group_name' component={groups} authenticated={authenticated} exact />
        <PrivateRoute path='/search' component={search} authenticated={authenticated} exact />
        <PrivateRoute path='/members' component={members} authenticated={authenticated} exact />
        <PrivateRoute path='/msgs' component={msgs} authenticated={authenticated} exact />
        <PrivateRoute path='/profile/:user_id' component={profile} authenticated={authenticated} exact />
        <PrivateRoute path='/editprofile' component={editprofile} authenticated={authenticated} exact />
        <PrivateRoute path='/services' component={Services} authenticated={authenticated} exact />
        <PrivateRoute path='/service/:service_id' component={Service} authenticated={authenticated} exact />
        <PrivateRoute path='/*' authenticated={authenticated} component={Error}/>
        </Switch>
      </div>
    }
  </Router>
);

const { bool } = PropTypes;

App.propTypes = {
  authenticated: bool.isRequired,
  checked: bool.isRequired
};

const mapState = ({ session }) => ({
  checked: session.checked,
  authenticated: session.authenticated
});

export default connect(mapState)(App);