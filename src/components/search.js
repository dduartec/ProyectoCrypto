import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sessionActions from '../actions/sessionActions';
import Search_posts from './Search_posts';
import Navigation from './Navigation';
import '../styles/Home.css';
import { Link, withRouter } from 'react-router-dom'
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import { loadState, saveState } from './localStorage.js';
import store from '../store';


class search extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            user_id: -1,
            post_id: -1,
            file: "",
            namefile: "",
            pdfPreviewUrl: "",
            tag: {
                name: "",
            },
            post: {
                title: "",
                body: "",
                solicitud: 0,
                user_id: -1,
            },
            groups: [],
            picture: "",
            loading: false,
            search: "",
            session: {}
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this._handleImageChange = this._handleImageChange.bind(this);



        this.saveStateSearch = this.saveStateSearch.bind(this);
    }

    saveStateSearch() {
        saveState(this.state, 'search');
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.saveStateSearch)

        // saves if component has a chance to unmount
        this.saveStateSearch();
    }

    componentDidMount() {

        const state = loadState('search');
        this.setState(state);
        window.addEventListener('beforeunload', this.saveStateSearch);
        if (store.getState().session.user.email !== undefined) {
            this.setState({ session: store.getState().session.user },()=>{
            axios.defaults.headers.common['Authorization'] = `${this.state.session.authentication_token}`;
            axios.defaults.headers.common['ID'] = `${this.state.session.id}`;
            })
        }
        this.setState({ loading: true }, () => {
            //console.log(data);
            axios.get('https://knowledge-community-back-end.herokuapp.com/users?email=' + this.state.session.email)
                .then(res => {
                    console.log(this.state);
                    let post = Object.assign({}, this.state.post);
                    post.user_id = res.data[0].id;
                    this.setState({
                        user_id: res.data[0].id,
                        post: post,
                        groups: res.data[0].groups,
                    });
                    //console.log(data);
                    axios.get('https://knowledge-community-back-end.herokuapp.com/app_files?ProfilePhoto=1&user_id=' + this.state.user_id)
                        .then(response => {
                            this.setState({
                                picture: response.data,
                            })
                        })
                    this.setState({
                        loading: false
                    })
                }).catch(function (error) {
                    console.error(error);
                    console.error(error);
                    this.setState({
                        loading: false,
                    })
                })
        })
    }

    onSubmit(history) {
        this.setState({ loading: true }, () => {
            //console.log(data);
            axios.post(`https://knowledge-community-back-end.herokuapp.com/posts`, this.state.post)
                .then(response => {
                    alert("Publicacion Satisfactoria");
                    this.setState({
                        loading: false,
                    })
                    //console.log(data);
                    axios.post('https://knowledge-community-back-end.herokuapp.com/posts/' + response.data.id + '/tags', this.state.tag)
                        .then(response => {
                            this.forceUpdate();
                        })
                        .catch(function (error) {
                            console.error(error);
                        })
                })
        })
            .catch(function (error) {
                console.error(error);
                this.setState({
                    loading: false,
                })
            })
    }
    onPDF(history) {
        let { pdfPreviewUrl } = this.state;
        if (pdfPreviewUrl) {
            //console.log(data);
            axios.post(`https://knowledge-community-back-end.herokuapp.com/app_files`, { ruta: pdfPreviewUrl, file_type_id: 2, user_id: this.state.user_id, post_id: "", description: "pdf", titulo: this.state.namefile })
                .then(response => {
                    history.push('/')
                })
        }
    }

    onChange(e) {
        const { value, name } = e.target;
        const { post } = this.state;
        const { tag } = this.state;
        post[name] = value;
        tag[name] = value;
        this.setState({ post });
        this.setState({ tag });
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                pdfPreviewUrl: reader.result,
                namefile: file.name,
            });
        }
        reader.readAsDataURL(file);

    }
    render() {
        const st = this.props.location.state.search
        //var res = st.replace(" ", "%");
        const Pdfbutton = withRouter(({ history }) => (
            <button className="btn btn-default btn-lg posd"
                onClick={() => this.onPDF(history)}
                type="submit">Subir
      </button>
        ));
        let { picture } = this.state;
        let $picture = null;
        if (!picture.error) {
            $picture = (<img src={picture.ruta} alt="" />);
        } else {
            $picture = (<img src="http://recursospracticos.com/wp-content/uploads/2017/10/Sin-foto-de-perfil-en-Facebook.jpg" alt="" />);
        }
        return (
            <div>
                <Navigation />
                {this.state.loading ? <LoadingSpinner /> :
                    <div className='container'>
                        <div className="row">
                            <div className="col-6 col-md-4 ">
                                <div className="row">
                                    <div className='container-home'>
                                        <div className="col-md-12">
                                            <Link className="link" to="/profile">
                                                <div className="home-profile-img">
                                                    {$picture}
                                                </div>
                                            </Link>
                                            <p>{this.props.user.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='container-home'>
                                        <div className="col-md-12">
                                            <div className="panel panel-default">
                                                <div className="panel-heading">
                                                    <h3 className="panel-title">Grupos<a className="items">
                                                        <i className="fas fa-users"></i>
                                                    </a></h3>
                                                </div>
                                                <div className="panel-body">
                                                    {this.state.groups.map(group => <p>{group.name}</p>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='container-home'>
                                        <div>
                                            <h4>Subir PDF</h4>
                                            <div>
                                                <input type="file" onChange={this._handleImageChange} />
                                                <Pdfbutton />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-8">
                                <div className="row">
                                </div>

                                <Search_posts user_id={this.state.user_id} searchm={st} />
                            </div>
                        </div>
                    </div>
                }
            </div>)
    }
}
const { object, bool } = PropTypes;

search.propTypes = {
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

export default connect(mapState, mapDispatch)(search);