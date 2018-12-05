import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sessionActions from '../actions/sessionActions';
import '../styles/Log.css';
import { sessionService } from 'redux-react-session';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import LoadingSpinner from './LoadingSpinner';


class Loginbody extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      hasError: false,
      errors: "email o contraseña incorrecto",
      user: {
        email: '',
        password: ''
      },
      loading: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);



  }
  onSubmit(history) {
    const { user } = this.state;
    this.setState({ loading: true }, () => {
      axios.post(`https://knowledge-community-back-end.herokuapp.com/sessions`, { email: user.email, password: user.password })
        .then(response => {
          this.setState({
            loading: false,
          })
          const { token } = response.data.data.user.authentication_token;
          sessionService.saveSession({ token })
            .then(() => {
              sessionService.saveUser(response.data.data.user)
                .then(() => {
                  history.push({ pathname: '/', state: { detail: response.data.data.user }});
                }).catch(err => console.error(err));
            }).catch(err => console.error(err));
        }).catch(function (error) {
          this.setState({
            loading: false,
          })
          if (error.message.indexOf('500') !== -1) {
            this.setState({
              hasError: true,
              loading: false,
            });
          }
        }.bind(this))
    });
  }


  onChange(e) {
    const { value, name } = e.target;
    const { user } = this.state;
    user[name] = value;
    this.setState({ user });
  }
  responseGoogle = (response,history) => {
    const {id_token} = response.tokenObj;
    
    const {email}=response.profileObj
    const {name}=response.profileObj;
    let query={"id_token":id_token,"email":email,"name":name};
    this.setState({ loading: true }, () => {
      axios.post(`https://knowledge-community-back-end.herokuapp.com/auth/request`, query)
        .then(response => {
          this.setState({
            loading: false,
          })        
          const { authentication_token } = response.data;
          let user={email:email, id:response.data.id}
          sessionService.saveSession({ authentication_token })
            .then(() => {
              sessionService.saveUser(user)
            }).catch(err => console.error(err));
        }).catch(function (error) {
          console.error(error);
          this.setState({
            loading: false,
          })
        }.bind(this))
    })
  }

  responseFacebook = (response) => {
  }

  render() {
    const SubmitButton = withRouter(({ history }) => (
      <button className="mybtn"
        onClick={() => this.onSubmit(history)}
        type="submit">Ingresar
      </button>
    ));

    return (
      <div>
        {this.state.loading ? <LoadingSpinner /> :
          <div className="container">
            <div className="container container-login">
              <div className="row">
                <div className="col-sm-12 log-text">
                  <h2>Ingresa</h2>
                </div>
              </div>
              <div className="row">

                <div className="col-sm-8 offset-sm-2 myform-cont">
                  {this.state.hasError &&
                    <div className="alert alert-danger">
                      <strong>Error:</strong> {this.state.errors}
                    </div>
                  }
                  <div className="form-group">
                    <input
                      className="form-control"
                      name="email"
                      label="Email"
                      type="email"
                      placeholder="e-mail"
                      onChange={this.onChange}
                    />

                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="Contraseña"
                      onChange={this.onChange}
                    />
                  </div>
                  <SubmitButton />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 mysocial-login log-text">
                  <h3> Ó ingresa con: </h3>
                  <div className="mysocial-login-buttons">
                    <GoogleLogin className="mybtn-social" tag="a" type=""
                      clientId="373142330185-hko54qc5fakooerj23p6n1494vj768h4.apps.googleusercontent.com"
                      onSuccess={this.responseGoogle}
                      onFailure={this.responseGoogle}                    >
                      <i className="fab fa-google"></i>
                    </GoogleLogin>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 log-text">
                  <hr></hr>
                </div>
                <div className="col-sm-8 offset-sm-2 myform-cont">
                  <Link className="link" to="/signup">
                    <button type="submit" className="mybtn">Registrate</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

const { object } = PropTypes;

Loginbody.propTypes = {
  actions: object.isRequired
};

const mapDispatch = (dispatch) => {
  return {
    actions: bindActionCreators(sessionActions, dispatch)
  };
};

export default connect(null, mapDispatch)(Loginbody);