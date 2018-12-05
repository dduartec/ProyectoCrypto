import React, { Component } from 'react';


class Marker extends Component {

    render() {

        return (
            <div>
                <div className="pin">
                    <i className="fas fa-map-marker-alt"></i>                    
                </div>
                <h4>{this.props.text}</h4>
            </div>
        );
    }
}


export default Marker;