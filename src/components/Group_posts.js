import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sessionActions from '../actions/sessionActions';
import '../styles/Home.css';
//import { Link } from 'react-router-dom';
import axios from 'axios';
import Post from './Post';
import store from '../store';
import { loadState, saveState } from './localStorage.js';

class Group_posts extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      posts: [],
      loading: false,
      session: {}
    };
    this.saveStateGroupPosts = this.saveStateGroupPosts.bind(this);
  }

  saveStateGroupPosts() {
    saveState(this.state, 'posts_group');
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.saveStateGroupPosts)

    // saves if component has a chance to unmount
    this.saveStateGroupPosts();
  }

  componentDidMount() {
    const state = loadState('posts_group');
    this.setState(state);
    window.addEventListener('beforeunload', this.saveStateGroupPosts);
    if (store.getState().session.user.email !== undefined) {
      this.setState({ session: store.getState().session.user }, () => {
        axios.defaults.headers.common['Authorization'] = `${this.state.session.authentication_token}`;
        axios.defaults.headers.common['ID'] = `${this.state.session.id}`;
      })
    }
    this.setState({ loading: true }, () => {
      //console.log(data);
      axios.get('https://knowledge-community-back-end.herokuapp.com/groups/' + this.props.group_id + '/posts')
        .then(res => {
          this.setState({
            posts: res.data,
            loading: false,
          });
        }).catch(function (error) {
          console.error(error);
          console.error(error);
          this.setState({
            loading: false,
          })
        })
    })
  }
  render() {

    const listItems = this.state.posts.map((d, i) => <Post key={i} id={d.id} user_id={this.props.user_id} post={d}>{d.title}</Post>);
    return (
      <div>
        {listItems}
      </div>
    )
  }

}
const { object, bool } = PropTypes;

Group_posts.propTypes = {
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

export default connect(mapState, mapDispatch)(Group_posts);
//export default Group_posts;