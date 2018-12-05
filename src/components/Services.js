import React, { Component } from 'react';
import '../styles/Log.css';
import Navigation from './Navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sessionActions from '../actions/sessionActions';
import '../styles/profile.css';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { loadState, saveState } from './localStorage.js';
import LoadingSpinner from './LoadingSpinner';
import store from '../store';

class Service extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session: {},
            loading: false,
            services_aux: [],
            services: []
        };
        this.saveStateService = this.saveStateService.bind(this);
    }

    saveStateService() {
        saveState(this.state, 'service');
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.saveStateService)

        // saves if component has a chance to unmount
        this.saveStateService();
    }

    componentDidMount() {
        console.log(this.props);
        const state = loadState('service');
        this.setState(state);
        window.addEventListener('beforeunload', this.saveStateService);
        if (store.getState().session.user.email !== undefined) {
            this.setState({ session: store.getState().session.user }, () => {
                axios.defaults.headers.common['Authorization'] = `${this.state.session.authentication_token}`;
                axios.defaults.headers.common['ID'] = `${this.state.session.id}`;
            })
        }
        this.setState({ loading: true, services: [] }, () => {
            this.setState({ loading: true, map: false }, () => {
                //console.log(data);
                axios.get('https://knowledge-community-back-end.herokuapp.com/users/' + this.state.session.id)
                    .then(res => {
                        this.setState({
                            services_aux: res.data.services
                        });
                        this.state.services_aux.forEach(element => {
                            //console.log(data);
                            axios.get('https://knowledge-community-back-end.herokuapp.com/services/' + element.id)
                                .then(response => {
                                    var services = this.state.services;
                                    services.push(response.data.post)
                                    this.setState({
                                        services: services,
                                    })
                                })

                        });
                        this.setState({
                            loading: false
                        })
                    }).catch(function (error) {
                        console.error(error);
                        console.error(error);
                    })
            })
            setTimeout(() => this.setState({ loading: false }), 500);
        })

    }

    /*componentWillReceiveProps() {
        console.log(store.getState());
        
    }*/

    render() {
        console.log(this.state);
        return (
            <div>
                <Navigation />
                {this.state.loading ? <LoadingSpinner /> :
                    <div> EN PROCESOfdfd</div>
                }
            </div >

        )
    }
}
const { object, bool } = PropTypes;

Service.propTypes = {
    actions: object.isRequired,
    user: object.isRequired,
    authenticated: bool.isRequired
};

const mapState = (state) => ({
    user: state.session.user,
    authenticated: state.session.authenticated
});

const mapDispatch = (dispatch) => {
    return {
        actions: bindActionCreators(sessionActions, dispatch)
    };
};

export default connect(mapState, mapDispatch)(Service);