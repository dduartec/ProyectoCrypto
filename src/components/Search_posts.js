import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sessionActions from '../actions/sessionActions';
import '../styles/Home.css';
import axios from 'axios';
import Post from './Post';
//import LoadingSpinner from './LoadingSpinner';
import store from '../store';
import { loadState, saveState } from './localStorage.js';
class Search_posts extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      posts: [],
      loading: false,
      session: {}
    };
    this.saveStateSearchPost = this.saveStateSearchPost.bind(this);
  }

  saveStateSearchPost() {
    saveState(this.state, 'search_posts');
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.saveStateSearchPost)

    // saves if component has a chance to unmount
    this.saveStateSearchPost();
  }

  componentDidMount() {
    const state = loadState('search_posts');
    this.setState(state);
    window.addEventListener('beforeunload', this.saveStateSearchPost);
    if (store.getState().session.user.email !== undefined) {
      this.setState({ session: store.getState().session.user },()=>{
      axios.defaults.headers.common['Authorization'] = `${this.state.session.authentication_token}`;
      axios.defaults.headers.common['ID'] = `${this.state.session.id}`;
      })
  }
    this.setState({ loading: true }, () => {
      //console.log(data);
      axios.get('https://knowledge-community-back-end.herokuapp.com/posts?body=' + this.props.searchm)
        .then(res => {
          console.log(this.state)
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

Search_posts.propTypes = {
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

export default connect(mapState, mapDispatch)(Search_posts);
//export default Search_posts;