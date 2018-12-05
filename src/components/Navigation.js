import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navbar.css';
import LogoutButton from './LogoutButton';
import { Redirect } from 'react-router-dom'


class Navigation extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            redirect: false,
            search:''
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.keyPress = this.keyPress.bind(this);
        this.setRedirect = this.setRedirect.bind(this);
        this.renderRedirect = this.renderRedirect.bind(this);


    }

    setRedirect() {
        this.setState({
            redirect: true
        })

    }

    renderRedirect() {
        if (this.state.redirect) {
            return <Redirect to={{
                pathname: "/search",
                state: { search: this.state.search }
            }} />
        }
    }



    onSubmit(history) {
    }
    onChange(e) {
        this.setState({search: e.target.value});
      }

    keyPress(e) {
        if (e.keyCode===13) {
            this.setRedirect();
        }

    }
    render() {
        return (
            <div>
                <nav className="navbar navbar-icon-top navbar-expand-lg navbar-dark ">
                    <NavLink to="/" className="navbar-brand" >KC</NavLink>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="far fa-bell">
                                        <span className="badge badge-danger">11</span>
                                    </i>
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a className="dropdown-item" >Action</a>
                                    <a className="dropdown-item" >Another action</a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" >Something else here</a>
                                </div>
                            </li>
                        </ul>
                        <div className="container test">
                            <div className="form-group has-search test">
                                {this.renderRedirect()}
                                <span className="fa fa-search form-control-feedback" onClick={this.onSubmit}></span>
                                <input type="text" className="form-control" placeholder="Search" onKeyDown={this.keyPress} onChange={this.onChange} />
                            </div>
                        </div>
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown menu">
                                <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fas fa-bars">
                                    </i>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                    <a className="dropdown-item">Registro de Actividad</a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item drop-logout" ><LogoutButton /></a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navigation;