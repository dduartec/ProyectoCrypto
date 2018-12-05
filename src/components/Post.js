import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sessionActions from '../actions/sessionActions';
import '../styles/Home.css';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import Comment from './Comment.js'
import Map from './Map';
import store from '../store';
import { loadState, saveState } from './localStorage.js';

class Post extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            loading: false,
            picture: "",
            comment: {
                user_id: this.props.user_id,
                body: "",
            },
            session: {},
            post: {
                body: "",
                title: "",
                user: [],
                comments: [],
                comment: {
                    user_id: this.props.user_id,
                    body: "",
                },
                tags: [],
                lat: 4.6381938,
                lng: -74.0840464,
            }

        };

        this.onSubmitComment = this.onSubmitComment.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmitContact = this.onSubmitContact.bind(this);

        this.saveStatePost = this.saveStatePost.bind(this);
    }

    saveStatePost() {
        saveState(this.state, 'post' + this.props.id);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.saveStatePost)

        // saves if component has a chance to unmount
        this.saveStatePost();
    }

    componentDidMount() {
        const state = loadState('post' + this.props.id);
        this.setState(state);
        window.addEventListener('beforeunload', this.saveStatePost);
        if (store.getState().session.user.email !== undefined) {
            this.setState({ session: store.getState().session.user },()=>{
            axios.defaults.headers.common['Authorization'] = `${this.state.session.authentication_token}`;
            axios.defaults.headers.common['ID'] = `${this.state.session.id}`;
            })
        }
        this.setState({ post: this.props.post }, () => {
            //console.log(this.state.post);
            axios.get('https://knowledge-community-back-end.herokuapp.com/app_files?ProfilePhoto=1&user_id=' + this.state.post.user.id)
            .then(response => {
                this.setState({ picture: response.data })
            })
        });

        /* this.setState({ loading: true }, () => {              
                 axios.get('https://knowledge-community-back-end.herokuapp.com/posts/' + this.props.id)
                     .then(res => {
                         console.log(data);
                         console.log(res)
                         this.setState({
                             body: res.data.body,
                             title: res.data.title,
                             user: res.data.user,
                             comments: res.data.comments,
                             tags: res.data.tags,
                             lat: res.data.lat,
                             lng: res.data.lng
                         });
                             //console.log(data);
                            
                     })
         })*/
    }

    onSubmitComment(history) {
        const { comment } = this.state;
        comment.user_id = this.props.user_id;
        //console.log(data);
        axios.post('https://knowledge-community-back-end.herokuapp.com/pos+-ts/' + this.props.id + '/comments', this.state.comment)
            .then(response => {
                alert("Comentario publicado");
                this.setState({
                    loading: false,
                })
                let comments = this.state.comments;
                comments.push(comment);
                this.setState({ comments: comments })
                this.forceUpdate();
            })
            .catch(function (error) {
                console.error(error);
                console.error(error);
            })

    }
    onSubmitContact(history) {
        const service = {
            post_id: this.props.id,
            user1_id: this.state.post.user.id,
            user2_id: this.props.id
        }
        //history.push('/service/'+this.props.id);
        //console.log(data);
        axios.post('https://knowledge-community-back-end.herokuapp.com/services/', this.state.comment)
            .then(response => {
                alert("Servicio creado");
                this.setState({
                    loading: false,
                })
                history.push('/service/' + this.props.id);
            })
            .catch(function (error) {
                console.error(error);
            })

    }

    onChange(e) {
        const { value, name } = e.target;
        const { comment } = this.state;
        comment[name] = value;
        this.setState({ name });
        console.log(this.state.comment);
    }




    render() {
        //console.log(this.state);
        const ComentarButton = withRouter(({ history }) => (
            <button className="btn btn-default btn-lg posd"
                onClick={() => this.onSubmitComment(history)}
                type="submit">Comentar
            </button>
        ));
        const ContactarButton = withRouter(({ history }) => (
            <button className="btn btn-default btn-lg"
                onClick={() => this.onSubmitContact(history)}
                type="submit">Contactar
            </button>
        ));

        let { lat, lng, picture } = this.state;
        let $picture = null;
        if (!picture.error) {
            $picture = (<img src={picture.ruta} alt="" />);
        } else {
            $picture = (<img src="http://recursospracticos.com/wp-content/uploads/2017/10/Sin-foto-de-perfil-en-Facebook.jpg" alt="" />);
        }
        const listItems = this.state.post.comments.map((d, i) => <Comment key={i} user_id={d.user_id} body={d.body} id={d.id}></Comment>);
        const center = { lat: parseFloat(lat), lng: parseFloat(lng) };

        return (

            <div className='container-home2' >
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div className="post-profile-img">
                            {$picture}
                        </div>
                        <div className="title">
                            <h3 className="panel-title">
                                <Link className="link" to={{ pathname: '/profile/' + this.state.post.user.id, params: { email: this.state.post.user.email } }}>
                                    {this.state.post.user.name}
                                </Link> : {this.state.post.title} {this.state.post.tags.map((person, i) => <p key={i}>{person.name}</p>)} </h3>

                        </div>
                    </div>
                    <div className="container panel-body pb">
                        {this.state.post.body}
                    </div>
                    <hr></hr>
                    <div className="buttons test">
                        <input
                            className="form-control comment-txt"
                            name="body"
                            label="Body"
                            type="body"
                            placeholder="Comenta algo"
                            onChange={this.onChange}
                        />
                        <ContactarButton></ContactarButton>
                        <ComentarButton></ComentarButton>
                    </div>

                </div>
                {this.state.post.comments.length > 0 &&
                    <div>
                        <br></br>
                        <hr></hr>
                        <h5>Comentarios</h5>
                    </div>
                }
                <div>
                    {lat != null && lat != '' && <Map center={center} username={this.state.post.user.name} type='vista' />
                    }

                </div>
                <div className="container">
                    {listItems}
                </div>
            </div >
        )
    }

}
const { object, bool } = PropTypes;

Post.propTypes = {
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

export default connect(mapState, mapDispatch)(Post);
//export default Post;