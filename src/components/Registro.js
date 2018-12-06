import React, { Component } from 'react';
import '../styles/Log.css';
import Navigation from './NavigationLog';
import { Link, withRouter } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sessionActions from '../actions/sessionActions';
import { sessionService } from 'redux-react-session';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import LoadingSpinner from './LoadingSpinner';
import * as CryptoJS from 'crypto-js';

class Registro extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      hasError: 0,
      errors: "email, nombre o contraseña incorrecto",
      errors1: "El email ya se encuentra en uso",
      errors2: "La contraseña no coincide",
      errors3: "Contraseña muy facil izi",
      user: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      loading: false,
      passwords: {},
      validPass: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.readTextFile = this.readTextFile.bind(this);
    this.prueba = this.prueba.bind(this);
    this.verifyPassword = this.verifyPassword.bind(this);


  }

  verifyPassword() {
    const { user, passwords } = this.state;
    var i;
    for (i = 0; i < 10001; i++) {
      if (user.password == passwords[i].substring(0, passwords[i].length - 1)) {
        this.setState({ validPass: true })
      }
    }
  }

  onSubmit(history) {
    var key = 'knowledgeCo';
    var { user } = this.state;
    this.verifyPassword();
    if (this.validPass) {
      console.log(user.password);
      console.log(user.password_confirmation);
      user.password = CryptoJS.HmacSHA1(this.state.user.password, key).toString();
      user.password_confirmation = CryptoJS.HmacSHA1(this.state.user.password_confirmation, key).toString();
      console.log(user.password);
      console.log(user.password_confirmation);
      this.setState({ loading: true }, () => {
        axios.post(`https://knowledge-community-back-end.herokuapp.com/users`, { user })
          .then(response => {
            this.setState({
              loading: false,
            })
            const { token } = response.data.authentication_token;
            sessionService.saveSession({ token })
              .then(() => {
                sessionService.saveUser(response.data)
                  .then(() => {
                    history.push('/');
                  }).catch(err => console.error(err));
              }).catch(err => console.error(err));
          }).catch(function (error) {
            if (user.name === "" || user.email === "" || user.password === "" || user.password_confirmation === "") {
              this.setState({
                hasError: 1,
                loading: false,
              });
            }
            else if (user.password !== user.password_confirmation) {
              this.setState({
                hasError: 3,
                loading: false,
              });
            }
            else if (error.message.indexOf('422') !== -1) {
              this.setState({
                hasError: 2,
                loading: false,
              });
            }
          }.bind(this))
      })
    } else {
      this.setState({
        hasError: 4,
        loading: false,
      });
    }
  }

  onChange(e) {
    const { value, name } = e.target;
    const { user } = this.state;
    user[name] = value;
    this.setState({ user });
  }

  responseGoogle = (response, history) => {
    const { id_token } = response.tokenObj;

    const { email } = response.profileObj
    const { name } = response.profileObj;
    let query = { "id_token": id_token, "email": email, "name": name };
    this.setState({ loading: true }, () => {
      axios.post(`https://knowledge-community-back-end.herokuapp.com/auth/request`, query)
        .then(response => {
          this.setState({
            loading: false,
          })
          const { authentication_token } = response.data;
          let user = { email: email }
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
    console.log(response);
  }

  componentDidMount() {
    this.readTextFile('https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10k-most-common.txt');
  }

  readTextFile = file => {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = () => {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          var allText = rawFile.responseText;
          var words = allText.split("\n")
          this.setState({
            passwords: words
          });
        }
      }
    };
    rawFile.send(null);
  };

  prueba() {
    const { passwords } = this.state
    console.log(typeof passwords);
    console.log(passwords);
  }

  render() {

    const SubmitButton = withRouter(({ history }) => (
      <button className="mybtn"
        onClick={() => this.onSubmit(history)}
        type="submit">Registrar
      </button>
    ));
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
          {this.state.loading ? <LoadingSpinner /> :
            <div className="container">
              <div className="container container-login">
                <div className="row">
                  <div className="col-sm-12 log-text">
                    <h2>Registrate</h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-8 offset-sm-2 myform-cont">
                    {this.state.hasError === 1 &&
                      <div className="alert alert-danger">
                        <strong>Error:</strong> {this.state.errors}
                      </div>
                    }

                    {this.state.hasError === 2 &&
                      <div className="alert alert-danger">
                        <strong>Error:</strong> {this.state.errors1}
                      </div>
                    }
                    {this.state.hasError === 3 &&
                      <div className="alert alert-danger">
                        <strong>Error:</strong> {this.state.errors2}
                      </div>
                    }
                    {this.state.hasError === 4 &&
                      <div className="alert alert-danger">
                        <strong>Error:</strong> {this.state.errors3}
                      </div>
                    }
                    <div className="form-group">
                      <input type="text" name="name" placeholder="Nombre" className="form-control" id="form-name" onChange={this.onChange} />
                    </div>
                    <div className="form-group">
                      <input type="text" name="email" placeholder="Email" className="form-control" id="form-email" onChange={this.onChange} />
                    </div>
                    <div className="form-group">
                      <input type="password" name="password" placeholder="Contraseña" className="form-control" id="form-password" onChange={this.onChange} />
                    </div>
                    <div className="form-group">
                      <input type="password" name="password_confirmation" placeholder="Confirmar contraseña" className="form-control" id="form-password_confirmation" onChange={this.onChange} />
                    </div>
                    <SubmitButton />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 mysocial-login log-text">
                    <h3> Ó registrate con: </h3>
                    <div className="mysocial-login-buttons">
                      <GoogleLogin className="mybtn-social" tag="a" type=""
                        clientId="373142330185-sv6n2fga4rjtqbjre1cr8hlcj7md8u8h.apps.googleusercontent.com"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                      >
                        <i className="fab fa-google"></i>
                      </GoogleLogin>
                      <FacebookLogin
                        appId="337250857041345"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={this.responseFacebook}
                        cssclassName="mybtn-social-f"
                        icon="fab fa-facebook-square"
                        textButton=""
                      ></FacebookLogin>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 log-text">
                    <hr></hr>
                  </div>
                  <div className="col-sm-8 offset-sm-2 myform-cont">
                    <Link className="link" to="/login">
                      <button type="submit" className="mybtn">Iniciar Sesion</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

const { bool } = PropTypes;

Registro.propTypes = {
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

export default connect(mapState, mapDispatch)(Registro);
