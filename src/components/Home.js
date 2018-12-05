import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sessionActions from '../actions/sessionActions';
import Posts from './Posts';
import Navigation from './Navigation';
import '../styles/Home.css';
import { Link, withRouter } from 'react-router-dom'
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import Map from './Map';
import { loadState, saveState } from './localStorage.js';
import store from '../store';


class Home extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            user_id: -1,
            email: "",
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
                lat: null,
                lng: null
            },
            groups: [],
            picture: "",
            loading: false,
            map: false,
            session: {},
            group_name: "",
            services: []
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onGroup = this.onGroup.bind(this);
        this.onChange = this.onChange.bind(this);
        this.check = this.check.bind(this);
        this._handleImageChange = this._handleImageChange.bind(this);
        this.handleLoc = this.handleLoc.bind(this);
        this.saveStateHome = this.saveStateHome.bind(this);


    }
    saveStateHome() {
        saveState(this.state, 'home');
    }

    componentWillMount() {
        if (this.props.history.location.state !== undefined) {
            this.setState({ email: this.props.history.location.state.detail.email })
        }

    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.saveStateHome)

        // saves if component has a chance to unmount
        this.saveStateHome();
    }

    componentDidMount() {
        const state = loadState('home');
        if (state) {
            this.setState(state);
            window.addEventListener('beforeunload', this.saveStateHome);
        }


    }

    onSubmit(history) {
        this.setState({ loading: true, }, () => {
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
                .catch(function (error) {
                    console.error(error);
                    this.setState({
                        loading: false,
                    })
                })
        })
    }

    onPDF(history) {
        this.setState({ loading: true }, () => {
            let { pdfPreviewUrl } = this.state;
            if (pdfPreviewUrl) {
                //console.log(data);
                axios.post(`https://knowledge-community-back-end.herokuapp.com/app_files`, { ruta: pdfPreviewUrl, file_type_id: 2, user_id: this.state.user_id, post_id: "", description: "pdf", titulo: this.state.namefile })
                    .then(response => {
                        history.push('/')
                        this.setState({
                            loading: false,
                        })
                    })
            }
        })
    }


    onGroup(history) {
        console.log(this.state.group_name)
        const group = { name: this.state.group_name }
        this.setState({ loading: true }, () => {
            //console.log(data);
            axios.post('https://knowledge-community-back-end.herokuapp.com/groups', group)
                .then(response => {
                    history.push('/')
                    this.setState({
                        loading: false,
                    })
                })
        })
    }
    onChange(e) {
        const { value, name } = e.target;
        const { post } = this.state;
        const { tag } = this.state;
        post[name] = value;
        tag[name] = value;
        this.setState({ post });
        this.setState({ tag });
        this.setState({ group_name: value });
    }
    check(e) {
        let val = !this.state.map;
        this.setState({ map: val });
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

    handleLoc(marker) {
        const { post } = this.state;
        post.lat = marker.lat;
        post.lng = marker.lng;
        this.setState({
            post: post
        });
    }

    componentWillReceiveProps() {
        if (store.getState().session.user.email !== undefined) {
            this.setState({ session: store.getState().session.user });
            axios.defaults.headers.common['Authorization'] = `${this.state.session.authentication_token}`;
            axios.defaults.headers.common['ID'] = `${this.state.session.id}`;
            this.setState({ loading: true, map: false, services: [] }, () => {
                axios.get('https://knowledge-community-back-end.herokuapp.com/users?email=' + this.state.session.email)
                    .then(res => {
                        let post = Object.assign({}, this.state.post);
                        post.user_id = res.data[0].id;
                        this.setState({
                            user_id: res.data[0].id,
                            post: post,
                            groups: res.data[0].groups,
                        });
                        //console.log(data);
                        axios.get('https://knowledge-community-back-end.herokuapp.com/app_files?ProfilePhoto=1&user_id=' + res.data[0].id)
                            .then(response => {
                                this.setState({
                                    picture: response.data,
                                })
                            })

                        
                        res.data[0].services.forEach(element => {
                            axios.get('https://knowledge-community-back-end.herokuapp.com/services/' + element.id)
                                .then(response => {
                                    console.log(element);
                                    console.log(response);
                                    var services = this.state.services;
                                    services.push(response.data)
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
        }
    }
    render() {
        //console.log(this.state)
        const Pdfbutton = withRouter(({ history }) => (
            <button className="btn btn-default btn-lg posd"
                onClick={() => this.onPDF(history)}
                type="submit">Subir
      </button>
        ));
        const Groupbutton = withRouter(({ history }) => (
            <button className="btn btn-default btn-lg posd"
                onClick={() => this.onGroup(history)}
                type="submit">Crear
      </button>
        ));
        const SubmitButton = withRouter(({ history }) => (
            <button className="btn btn-default btn-lg posd"
                onClick={() => this.onSubmit(history)}
                type="submit">Postear
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
                                            <Link to={{ pathname: '/profile/' + this.props.user.id, params: { email: this.props.user.email } }}>
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
                                                    {this.state.groups.map((group, i) =>
                                                        <Link key={i} className="link" to={{ pathname: '/groups/' + group.name, params: { group_id: group.id, name: group.name } }}>
                                                            {group.name}<br></br>
                                                        </Link>)}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='container-home'>
                                        <div className="col-md-12">
                                            <div className="panel panel-default">
                                                <div className="panel-heading">
                                                    <h3 className="panel-title">Servicios<a className="items">
                                                        <i class="fas fa-atlas"></i>
                                                    </a></h3>
                                                </div>
                                                <div className="panel-body">
                                                    {this.state.services.map((service, i) =>
                                                        <Link key={i} className="link" to={{ pathname: '/service/' + service.id }}>
                                                            {service.id}<br></br>
                                                        </Link>
                                                    )}

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
                                <div className="row">
                                    <div className='container-home'>
                                        <div>
                                            <h4>Crear Grupo</h4>
                                            <div>
                                                <input
                                                    className="form-control in-pos"
                                                    name="group_name"
                                                    label="group_name"
                                                    type="group_name"
                                                    placeholder="Nombre del Grupo"
                                                    onChange={this.onChange}
                                                />
                                                <Groupbutton />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-8">
                                <div className="row">
                                    <div className=' container-home2'>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <input
                                                    className="form-control in-pos"
                                                    name="title"
                                                    label="Title"
                                                    type="title"
                                                    placeholder="¿Qué te interesa aprender o enseñar?"
                                                    onChange={this.onChange}
                                                />
                                                <textarea
                                                    className="form-control in-pos"
                                                    name="body"
                                                    label="Body"
                                                    type="body"
                                                    placeholder="Detalla lo que requieres u ofreces"
                                                    onChange={this.onChange}
                                                />
                                                <textarea
                                                    className="form-control in-pos"
                                                    name="name"
                                                    label="name"
                                                    type="name"
                                                    placeholder="Agregar etiqueta"
                                                    onChange={this.onChange}
                                                />

                                            </div>
                                            <select className="form-control sel" id="sel1" onChange={this.onChange}>
                                                <option value="1">Solicitud</option>
                                                <option value="0  ">Ofrecimiento</option>
                                            </select>
                                            <div className="posd" >
                                                <label><input type="checkbox" name="map" onChange={this.check} value={!this.state.map} />Mapa?</label>
                                            </div>

                                            {this.state.map !== false && <div className="map"><Map type='editar' onSelectLoc={this.handleLoc} /></div>}
                                            <br></br>
                                            <br></br>

                                            <SubmitButton />
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                </div>
                                <Posts user_id={this.state.user_id} />
                            </div>
                        </div>
                    </div>
                }
            </div>)
    }
}
const { object, bool } = PropTypes;

Home.propTypes = {
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

export default connect(mapState, mapDispatch)(Home);
