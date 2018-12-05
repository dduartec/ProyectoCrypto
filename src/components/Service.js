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
import Post from './Post';

class Service extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session: {},
            loading: false,
            solicitud: {
                post_id: -1,
                score: 5,
                state: 0,
                users: []
            },
            picture: "",
            lat: "",
            lng: "",
            service: {
                post: {
                    body: "",
                    title: "",
                    user: {
                        id: -1
                    },
                    comments: [],
                    comment: {
                        user_id: this.props.user_id,
                        body: "",
                    },
                    tags: [],
                    lat: 4.6381938,
                    lng: -74.0840464,
                },
                users: [{
                    id: -1,
                    email: "",
                    name: ""
                }]
            },
            post: {
                comments: [],
                tags: []
            }
        };
        this.saveStateService = this.saveStateService.bind(this);
        this.startsChange = this.startsChange.bind(this);
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
        //console.log(this.props);
        const state = loadState('service');
        this.setState(state);
        window.addEventListener('beforeunload', this.saveStateService);
        if (store.getState().session.user.email !== undefined) {
            this.setState({ session: store.getState().session.user },()=>{
            axios.defaults.headers.common['Authorization'] = `${this.state.session.authentication_token}`;
            axios.defaults.headers.common['ID'] = `${this.state.session.id}`;
            })
        }
        this.setState({ loading: true }, () => {
            setTimeout(() => this.setState({ loading: false }), 500);
        })
        this.setState({ loading: true }, () => {
            //console.log(data);
            axios.get('https://knowledge-community-back-end.herokuapp.com/services/' + this.props.match.params.service_id)
                .then(response => {
                    this.setState({
                        service: response.data,
                    })
                    axios.get('https://knowledge-community-back-end.herokuapp.com/posts/' + response.data.post.id)
                        .then(res => {
                            console.log(res.data);
                            this.setState({
                                post: res.data,
                                loading: false,
                            });
                        })
                })

        })
        this.setState({ loading: true }, () => {
            setTimeout(() => this.setState({ loading: false }), 5000);
        })

    }

    /*componentWillReceiveProps() {
        console.log(store.getState());
        
    }*/
    startsChange(e) {
        let solicitud = this.state.solicitud;
        solicitud.score = e.target.value;
        this.setState({ solicitud: solicitud })
    }

    render() {
        //console.log(this.state.post)
        let aux = <div></div>;
        if (this.state.post) {
            aux = <Post id={this.state.service.post.id} user_id={this.state.service.post.user_id} post={this.state.post} ></Post>
        }
        return (
            <div>
                <Navigation />
                {this.state.loading ? <LoadingSpinner /> :
                    aux
                }
                <div className="container cal-panel">
                    <p className="clasificacion" >
                        <input id="radio1" type="radio" name="estrellas" value="5" checked={this.state.solicitud.score === "5"} onChange={this.startsChange} />
                        <label className="lb" for="radio1">★</label>
                        <input id="radio2" type="radio" name="estrellas" value="4" checked={this.state.solicitud.score === "4"} onChange={this.startsChange} />
                        <label className="lb" for="radio2">★</label>
                        <input id="radio3" type="radio" name="estrellas" value="3" checked={this.state.solicitud.score === "3"} onChange={this.startsChange} />
                        <label className="lb" for="radio3">★</label>
                        <input id="radio4" type="radio" name="estrellas" value="2" checked={this.state.solicitud.score === "2"} onChange={this.startsChange} />
                        <label className="lb" for="radio4">★</label>
                        <input id="radio5" type="radio" name="estrellas" value="1" checked={this.state.solicitud.score === "1"} onChange={this.startsChange} />
                        <label className="lb" for="radio5">★</label>
                    </p>
                </div>
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