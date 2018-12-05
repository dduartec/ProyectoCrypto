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
import * as emailjs from 'emailjs-com';


class Loginbody extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            hasError: false,
            errors: "codigo incorrecto, intenta nuevamente",
            codigo_ingresado: '',
            codigo_generado: '',
            loading: false,

        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.makeCode = this.makeCode.bind(this);

    }
    onSubmit(history) {
        if (this.state.codigo_generado === this.state.codigo_ingresado) {
            const { token } = this.props.user.authentication_token;
            sessionService.saveSession({ token })
                .then(() => {
                    sessionService.saveUser(this.props.user)
                        .then(() => {
                            history.push({ pathname: '/', state: { detail: this.props.user } });
                        }).catch(err => console.error(err));
                }).catch(err => console.error(err));
        } else {
            this.setState({
                hasError: true
            })
        }
    }


    onChange(e) {
        const { value, name } = e.target;
        var { codigo_ingresado } = this.state;
        codigo_ingresado = value;
        this.setState({ codigo_ingresado });
    }

    makeCode() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }




    componentDidMount() {
        const codigo_generado = this.makeCode();
        this.setState({
            codigo_generado: codigo_generado
        }, () => {
            console.log(this.props);
            emailjs.init("user_nUjLlfw6R6PI6e6Wr9vPF");
            emailjs.send("gmail", "template_SsqVTmXh", { "user_email": this.props.user.email, "message_html": this.state.codigo_generado, "ejs_dashboard__test_template": true })
                .then((response) => {
                    console.log('SUCCESS!', response.status, response.text);
                }, (err) => {
                    console.log('FAILED...', err);
                });
        })


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
                                    <h2>Código</h2>
                                    <p>Por favor ingresa el codigo de verificación que enviamos a tu correo electronico</p>
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
                                            name="codigo"
                                            label="Código"
                                            type="codigo"
                                            placeholder="codigo"
                                            onChange={this.onChange}
                                        />

                                    </div>
                                    <SubmitButton />
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