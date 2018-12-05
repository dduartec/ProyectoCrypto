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
import Archivo from './archivo';
import { Bar } from 'react-chartjs-2';
import { loadState, saveState } from './localStorage.js';
import LoadingSpinner from './LoadingSpinner';
import store from '../store';

class profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            email: "",
            posts: [],
            comments: [],
            files: [],
            groups: [],
            persons: [],
            picture: "",
            loading: false,
            session: {}
        };
        this.saveStateProfile = this.saveStateProfile.bind(this);
    }

    saveStateProfile() {
        saveState(this.state, 'profile');
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.saveStateProfile)

        // saves if component has a chance to unmount
        this.saveStateProfile();
    }

    componentDidMount() {
        console.log(this.props);
        const state = loadState('profile');
        this.setState(state);
        window.addEventListener('beforeunload', this.saveStateProfile);
        if (this.props.location.params !== undefined) {
            this.setState({ email: this.props.location.params.email })
        }
        if (store.getState().session.user.email !== undefined) {
            this.setState({ session: store.getState().session.user },()=>{
            axios.defaults.headers.common['Authorization'] = `${this.state.session.authentication_token}`;
            axios.defaults.headers.common['ID'] = `${this.state.session.id}`;
            })
        }
        this.setState({ loading: true }, () => {
            //console.log(data);
            axios.get('https://knowledge-community-back-end.herokuapp.com/users/' + this.props.match.params.user_id)
                .then(res => {
                    console.log(res);
                    this.setState({ id: res.data.id, groups: res.data.groups, persons: res.data })
                    //console.log(data);
                    axios.get('https://knowledge-community-back-end.herokuapp.com/app_files?ProfilePhoto=1&user_id=' + this.state.id)
                        .then(response => {
                            this.setState({ picture: response.data })
                        })
                    //console.log(data);
                    axios.get('https://knowledge-community-back-end.herokuapp.com/app_files?FileType=2&user_id=' + this.state.id)
                        .then(response => {
                            this.setState({ files: response.data })
                        })

                    //console.log(data);
                    axios.get('https://knowledge-community-back-end.herokuapp.com/users/' + this.state.id + '?statistics=1')
                        .then(response => {
                            this.setState({ posts: response.data })
                        })
                })
            //console.log(data);
            axios.get('https://knowledge-community-back-end.herokuapp.com/users/' + this.state.id + '?statistics=2')
                .then(response => {
                    this.setState({ comments: response.data })
                })
            setTimeout(() => this.setState({ loading: false }), 500);
        })

    }

    /*componentWillReceiveProps() {
        console.log(store.getState());
        
    }*/

    render() {
        var post = Object.keys(this.state.posts)
        const label = []
        const d = []
        for (let i = 0; i < post.length; i++) {
            label.push(post[i])
            d.push(this.state.posts[post[i]])
        }

        const data = {
            labels: label,
            datasets: [
                {
                    label: 'Post de los ultimos 7 dias',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: d
                }
            ]
        };
        var comment = Object.keys(this.state.comments)
        const label2 = []
        const d2 = []
        for (let i = 0; i < comment.length; i++) {
            label2.push(comment[i])
            d2.push(this.state.comments[comment[i]])

        }
        const data2 = {
            labels: label2,
            datasets: [
                {
                    label: 'Comments de los ultimos 7 dias',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: d2
                }
            ]
        };
        let { picture } = this.state;
        let $picture = null;
        if (!picture.error) {
            $picture = (<img src={picture.ruta} alt="" />);
        } else {
            $picture = (<img src="http://recursospracticos.com/wp-content/uploads/2017/10/Sin-foto-de-perfil-en-Facebook.jpg" alt="" />);
        }
        const i = 0;
        const link = "http://knowledge-community-back-end.herokuapp.com/users/" + this.state.id + ".pdf"
        const listItems = this.state.files.map((d) => <Archivo ruta={d.ruta} titulo={d.titulo}></Archivo>);
        return (
            <div>
                <Navigation />
                {this.state.loading ? <LoadingSpinner /> :
                    <div className="container emp-profile">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="profile-img">
                                    {$picture}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="profile-head">
                                    <h5>
                                        {this.state.persons.name}
                                    </h5>
                                    <p className="proile-rating">RANKINGS : <span>{this.state.persons.score}/5</span></p>
                                    <div className="ratings">
                                        <ul className="list-inline">
                                            <li className="list-inline-item selected"><i className="fa fa-star"></i></li>
                                            <li className="list-inline-item selected"><i className="fa fa-star"></i></li>
                                            <li className="list-inline-item selected"><i className="fa fa-star"></i></li>
                                            <li className="list-inline-item selected"><i className="fa fa-star"></i></li>
                                            <li className="list-inline-item selected"><i className="fa fa-star"></i></li>

                                        </ul>
                                    </div>
                                    <div className="bottom bottom1">
                                        <a className="btn2 btn-primary btn-twitter btn-sm" href="https://twitter.com/Brayan_10Garzon">
                                            <i className="fa fa-twitter"></i>
                                        </a>
                                        <a className="btn3 btn-danger btn-sm" rel="publisher"
                                            href="https://plus.google.com/u/0/108558213338022499177">
                                            <i className="fa fa-google-plus"></i>
                                        </a>
                                        <a className="btn3 btn-primary btn-sm" rel="publisher"
                                            href="https://www.facebook.com/BRAYAN.E.GARZON">
                                            <i className="fa fa-facebook"></i>
                                        </a>
                                    </div>
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        <li className="nav-item">
                                            <a style={{ color: "#4d636f" }} className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Informacion</a>
                                        </li>
                                        <li className="nav-item">
                                            <a style={{ color: "#4d636f" }} className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Estadisticas y Reportes</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-2">
                                {this.state.persons.email !== this.props.user.email ? <div></div> :
                                    <Link className="link" to={{ pathname: '/editprofile', params: { email: this.state.email } }}>
                                        <input type="submit" className="profile-edit-btn" name="btnAddMore" value="Editar Perfil" />
                                    </Link>
                                }

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="profile-work">
                                    <p>Grupos<a className="items">
                                        <i className="fas fa-users"></i>
                                    </a></p>
                                    {this.state.groups.map((person, i) => <p key={i}>{person.name}</p>)}
                                    <p>Habilidades</p>
                                    <a href="">Guitarra Electrica</a><br />
                                    <a href="">Java, python ,c++</a><br />
                                    <a href="">Comida japonesa</a><br />
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="tab-content profile-tab" id="myTabContent">
                                    <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Nombre</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{this.state.persons.name}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Email</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{this.state.persons.email}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Contraseña</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{this.state.persons.password}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                        <div className="row">
                                            <div className="col-md-2 text-right">
                                                <li className="list-inline-item selected"><i className="fa fa-star"></i></li>5
                    </div>
                                            <div className="col-md-8">
                                                <div className="progress progress-striped">
                                                    <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="20"
                                                        aria-valuemin="0" aria-valuemax="100" style={{ width: "80%" }}>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-2 text-right">
                                                <li className="list-inline-item selected"><i className="fa fa-star"></i></li>4
                    </div>
                                            <div className="col-md-8">
                                                <div className="progress progress-striped">
                                                    <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="20"
                                                        aria-valuemin="0" aria-valuemax="100" style={{ width: "60%" }}>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-2 text-right">
                                                <li className="list-inline-item selected"><i className="fa fa-star"></i></li>3
                    </div>
                                            <div className="col-md-8">
                                                <div className="progress progress-striped">
                                                    <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="20"
                                                        aria-valuemin="0" aria-valuemax="100" style={{ width: "40%" }}>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-2 text-right">
                                                <li className="list-inline-item selected"><i className="fa fa-star"></i></li>2
                    </div>
                                            <div className="col-md-8">
                                                <div className="progress progress-striped">
                                                    <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="20"
                                                        aria-valuemin="0" aria-valuemax="100" style={{ width: "20%" }}>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-2 text-right">
                                                <li className="list-inline-item selected"><i className="fa fa-star"></i></li>1
                    </div>
                                            <div className="col-md-8">
                                                <div className="progress progress-striped">
                                                    <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="20"
                                                        aria-valuemin="0" aria-valuemax="100" style={{ width: "10%" }}>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h2>Posts</h2>
                                            <Bar
                                                data={data}
                                                width={100}
                                                height={50}
                                                options={{
                                                    maintainAspectRatio: true,
                                                    scales: {
                                                        yAxes: [{
                                                            ticks: {
                                                                beginAtZero: true
                                                            }
                                                        }]
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h2>Comments</h2>
                                            <Bar
                                                data={data2}
                                                width={100}
                                                height={50}
                                                options={{
                                                    maintainAspectRatio: true,
                                                    scales: {
                                                        yAxes: [{
                                                            ticks: {
                                                                beginAtZero: true
                                                            }
                                                        }]
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="row">
                                            <h6>
                                                Registro
                    </h6>
                                        </div>
                                        <div className="row">
                                            <iframe src={link} width="600px" height="300px" seamless /*webkitallowfullscreen mozallowfullscreen*/ allowFullScreen></iframe>
                                        </div>
                                        <div className="row">
                                            {listItems}
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div >

        )
    }
}
const { object, bool } = PropTypes;

profile.propTypes = {
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

export default connect(mapState, mapDispatch)(profile);