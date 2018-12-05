import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sessionActions from '../actions/sessionActions';
import '../styles/Home.css';
//import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import store from '../store';
import { loadState, saveState } from './localStorage.js';

class Comment extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            user: [],
            picture: "",
            session: {}
        };


        this.saveStateComment = this.saveStateComment.bind(this);
    }

    saveStateComment() {
        saveState(this.state, 'comment' + this.props.id);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.saveStateComment)

        // saves if component has a chance to unmount
        this.saveStateComment();
    }

    componentDidMount() {
        const state = loadState('comment' + this.props.id);
        this.setState(state);
        window.addEventListener('beforeunload', this.saveStateComment);
        if (store.getState().session.user.email !== undefined) {
            this.setState({ session: store.getState().session.user },()=>{
            axios.defaults.headers.common['Authorization'] = `${this.state.session.authentication_token}`;
            axios.defaults.headers.common['ID'] = `${this.state.session.id}`;
            })
        }
        this.setState({ loading: true }, () => {
            //console.log(data);
            axios.get('https://knowledge-community-back-end.herokuapp.com/users/' + this.props.user_id)
                .then(response => {
                    this.setState({ user: response.data })
                })
            //console.log(data);
            axios.get('https://knowledge-community-back-end.herokuapp.com/app_files?ProfilePhoto=1&user_id=' + this.props.user_id)
                .then(response => {
                    this.setState({ picture: response.data })
                })
        })
    }
    render() {
        let { picture } = this.state;
        let $picture = null;
        if (!picture.error) {
            $picture = (<img src={picture.ruta} alt="" />);
        } else {
            $picture = (<img src="http://recursospracticos.com/wp-content/uploads/2017/10/Sin-foto-de-perfil-en-Facebook.jpg" alt="" />);
        }
        return (
            <div className='container-comments'>
                <div className="panel-heading">
                    <div className="post-profile-img">
                        {$picture}
                    </div>
                    <div className="title">
                        <h3 className="panel-title">{this.state.user.name}</h3>
                    </div>
                </div>
                <div className="container panel-body pb">
                    {this.props.body}
                </div>
            </div>
        )
    }

}
const { object, bool } = PropTypes;

Comment.propTypes = {
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

export default connect(mapState, mapDispatch)(Comment);
//export default Comment;