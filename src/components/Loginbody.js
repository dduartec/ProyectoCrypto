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
import ReCAPTCHA from "react-google-recaptcha";
import AuthMail from './AuthMail';
import * as CryptoJS from 'crypto-js';


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
      loading: false,
      captcha: false,
      ingreso_datos: false,
      horas: 0,
      minutos: 0,
      now: 0,
      wasDate: 0,
      intentos: 1,
      intentos2: 2,
      penaliza: 0
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
    this.captchaReady = this.captchaReady.bind(this);
    this.fib = this.fib.bind(this)
  }




  onSubmit(history) {
    console.log(this.state)
    const ahora = new Date().getTime();
    console.log(ahora)
    if (ahora - this.state.wasDate >= this.state.penaliza) {
      if (this.state.captcha) {
        var { user } = this.state;
        var key = 'knowledgeCo';
        user.password = CryptoJS.HmacSHA1(this.state.user.password, key).toString();
        this.setState({ loading: true }, () => {
          axios.post(`https://knowledge-community-back-end.herokuapp.com/sessions`, { email: user.email, password: user.password })
            .then(response => {
              this.setState({
                token: response.data.data.user.authentication_token,
                user: response.data.data.user,
                loading: false,
                ingreso_datos: true,
              })
            }).catch(function (error) {
              this.setState({
                loading: false,
              })
              if (error.message.indexOf('500') !== -1) {
                this.setState({
                  errors: "email o contraseña incorrecto",
                  hasError: true,
                  loading: false,
                });
                if (this.state.intentos < 1) {
                  var intentos = this.state.intentos + 1;
                  this.setState({
                    intentos: intentos,
                  })
                } else {
                  const wasDate = new Date().getTime();
                  var intentos2 = this.state.intentos2;
                  this.setState({
                    wasDate: wasDate,
                    penaliza: this.fib(intentos2) * 60000,
                    intentos2: intentos2 + 1,
                    intentos: 0
                  })
                }
              }
            }.bind(this))
        });
      } else {
        console.log(this.state);
        this.setState({
          hasError: true,
          errors: 'Captcha fallido',
        });
      }
    } else {
      console.log(this.state);
      const restante = ((this.state.penaliza - (ahora - this.state.wasDate)) / 60000) % 60;
      this.setState({
        hasError: true,
        errors: 'Aun tiene que esperar ' + restante.toFixed(2) + ' minutos',
      });
    }
  }

  fib(n) {
    let arr = [0, 1];
    for (let i = 2; i < n + 1; i++) {
      arr.push(arr[i - 2] + arr[i - 1])
    }
    return arr[n]
  }

  onChange(e) {
    const { value, name } = e.target;
    const { user } = this.state;
    user[name] = value;
    this.setState({ user });
  }
  responseGoogle = (response, history) => {
    console.log(response);
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
          let user = { email: email, id: response.data.id }
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
  captchaReady(value) {
    this.setState({ captcha: value })
    console.log(value)
  }

  render() {
    now: new Date()
    const SubmitButton = withRouter(({ history }) => (
      <button className="mybtn"
        onClick={() => this.onSubmit(history)}
        type="submit">Ingresar
      </button>
    ));

    return (
      <div>
        {this.state.loading ? <LoadingSpinner /> :
          !this.state.ingreso_datos ?
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
                    <ReCAPTCHA
                      sitekey="6LcX934UAAAAALOU8sh9OLYMalikkAswZrWLduDw"
                      onChange={this.captchaReady}
                    />
                    <SubmitButton />
                    <div class="g-recaptcha" data-sitekey="6LcX934UAAAAALOU8sh9OLYMalikkAswZrWLduDw"></div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 mysocial-login log-text">
                    <h3> Ó ingresa con: </h3>
                    <div className="mysocial-login-buttons">
                      <GoogleLogin className="mybtn-social" tag="a" type=""
                        clientId="373142330185-39dd5o5sne1sdn312i3dpsmhe4f9nhs0.apps.googleusercontent.com"
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
            </div> :
            <AuthMail user={this.state.user} />
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
