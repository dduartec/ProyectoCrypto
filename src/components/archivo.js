import React, { Component } from 'react';
import '../styles/Home.css';

class Archivo extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            user: [],
            picture: "",
        };


    }

    render() {
        return (
            <div className='container'>
                <div className="row">
                    <h6>
                        {this.props.titulo}
                    </h6>
                </div>
                <div className="row">
                    <iframe title={this.props.title} src={this.props.ruta} width="600px" height="300px" seamless webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe>
                </div>
            </div>
        )
    }

}
/*const { object, bool } = PropTypes;

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

export default connect(null, mapDispatch)(Post);*/
export default Archivo;