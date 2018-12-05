import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sessionActions from '../actions/sessionActions';
import '../styles/Log.css';
import { sessionService } from 'redux-react-session';
import axios from 'axios';
import Navigation from './Navigation';
import { loadState, saveState } from './localStorage.js';
import store from '../store';


class editprofile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            email: "",
            hasError: 0,
            errors: "email, nombre o contraseña incorrecto",
            errors1: "El email ya se encuentra en uso",
            errors2: "La contraseña no coincide",
            file: '',
            imagePreviewUrl: '',
            base64img: '',
            persons: {},
            user: {
                name: '',
                email: '',
                password: '',
                password_confirmation: ''
            },
            session: {}
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this._handleImageChange = this._handleImageChange.bind(this);
        this.saveStateEditProfile = this.saveStateEditProfile.bind(this);
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result,
                base64img: reader.result
            });
        }
        reader.readAsDataURL(file);

    }

    onDrop(picture) {
        this.setState({
            profile_pic: URL.createObjectURL(picture),
        });
    }



    saveStateEditProfile() {
        saveState(this.state, 'editprofile');
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.saveStateEditProfile)

        // saves if component has a chance to unmount
        this.saveStateEditProfile();
    }

    componentDidMount() {
        const state = loadState('editprofile');
        this.setState(state);
        window.addEventListener('beforeunload', this.saveStateEditProfile);
        if (store.getState().session.user.email !== undefined) {
            this.setState({ session: store.getState().session.user },()=>{
            axios.defaults.headers.common['Authorization'] = `${this.state.session.authentication_token}`;
            axios.defaults.headers.common['ID'] = `${this.state.session.id}`;
            })
        }
        if (this.props.location.params !== undefined) {
            this.setState({ email: this.props.location.params.email }, function () {
                //console.log(data);
                axios.get('https://knowledge-community-back-end.herokuapp.com/users?email=' + this.state.email)
                    .then(res => {
                        console.log(this.state);
                        this.setState({ id: res.data[0].id, groups: res.data[0].groups, persons: res.data[0] })
                    })
            });
        }
    }

    onSubmit(history) {
        const { user } = this.state;
        let { imagePreviewUrl } = this.state;
        if (imagePreviewUrl) {

            //console.log(data); 
            axios.post(`https://knowledge-community-back-end.herokuapp.com/app_files`, { ruta: imagePreviewUrl, file_type_id: 1, user_id: this.state.id, post_id: "", description: "foto_perfil", titulo: "foto.png" })

        }
        //console.log(data);
        axios.put('https://knowledge-community-back-end.herokuapp.com/users/' + this.state.id, { user })
            .then(response => {
                const { token } = response.data.authentication_token;
                sessionService.saveSession({ token })
                    .then(() => {
                        sessionService.saveUser(response.data)
                            .then(() => {
                                history.push('/profile');
                            }).catch(err => console.error(err));
                    }).catch(err => console.error(err));
            }).catch(function (error) {
                if (user.name === "" || user.email === "" || user.password === "" || user.password_confirmation === "") {
                    this.setState({
                        hasError: 1,
                    });
                }
                else if (user.password !== user.password_confirmation) {
                    this.setState({
                        hasError: 3,
                    });
                }
                else if (error.message.indexOf('422') !== -1) {
                    this.setState({
                        hasError: 2,
                    });
                }
            }.bind(this))

    }

    onChange(e) {
        const { value, name } = e.target;
        const { user } = this.state;
        user[name] = value;
        this.setState({ user });
    }

    render() {
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} alt="" />);
        }
        const SubmitButton = withRouter(({ history }) => (
            <button className="mybtn"
                onClick={() => this.onSubmit(history)}
                type="submit">Guardar Cambios
        </button>
        ));

        return (
            <div>
                <Navigation />
                <div className="container">
                    <div className="left">
                        <div className="container container-login2">
                            <div className="row">
                                <div className="col-sm-12 log-text">
                                    <h2>Modifica tus datos</h2>
                                </div>
                            </div>
                            <div className="row">

                                <div className="col-sm-8 offset-sm-2 myform-cont">
                                    {this.state.hasError === 1 &&
                                        <div className="alert alert-danger">
                                            <strong>Error:</strong> {this.state.errors}
                                        </div>
                                    }

                                    {this.state.hasError === 2 &&
                                        <div className="alert alert-danger">
                                            <strong>Error:</strong> {this.state.errors1}
                                        </div>
                                    }
                                    {this.state.hasError === 3 &&
                                        <div className="alert alert-danger">
                                            <strong>Error:</strong> {this.state.errors2}
                                        </div>
                                    }
                                    <div className="form-group">
                                        <input type="text" name="name" placeholder={this.state.persons.name} className="form-control" id="form-name" onChange={this.onChange} />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" name="email" placeholder={this.state.persons.email} className="form-control" id="form-email" onChange={this.onChange} />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" name="password" placeholder="Contraseña" className="form-control" id="form-password" onChange={this.onChange} />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" name="password_confirmation" placeholder="Confirmar contraseña" className="form-control" id="form-password_confirmation" onChange={this.onChange} />
                                    </div>
                                    <div>
                                        <h4>Cambiar foto</h4>
                                        {/*<ImageUploader
                                            withIcon={false}
                                            buttonText='Seleccionar foto'
                                            onChange={this.onDrop}
                                            imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                            maxFileSize={5242880}
                                            withLabel={false}
                                            singleImage={true}
                                        />
                                        <img src={this.state.file} />*/}
                                        <div>
                                            <input type="file" onChange={this._handleImageChange} />
                                            {$imagePreview}

                                        </div>
                                    </div>
                                    <SubmitButton />
                                    <div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const { object, bool } = PropTypes;

editprofile.propTypes = {
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

export default connect(mapState, mapDispatch)(editprofile);