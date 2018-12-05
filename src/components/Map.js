import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';


class Map extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            marker:{
                lat:this.props.center.lat,
                lng:this.props.center.lng
            },
        };

        this._onClick = this._onClick.bind(this);


    }
    static defaultProps = {
        center: {
            lat: 4.6381938,
            lng: -74.0840464,
        },
        zoom: 13

    };

    _onClick = ({ x, y, lat, lng, event }) => {
        if (this.props.type!=='vista'){
            const {marker}=this.state;
            marker.lat=lat;
            marker.lng=lng;
            this.setState({marker:marker});
            this.props.onSelectLoc(marker);
        }
        
    }
    render() {
        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '500px', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyBO44rZ_b8rP8r1B2hBxkwJZtlPlVR6MEI' }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    onClick={this._onClick}
                >
                    <Marker
                        lat={this.state.marker.lat}
                        lng={this.state.marker.lng}
                        text={this.props.username}
                    />
                </GoogleMapReact>
            </div>
        );
    }
}

export default Map;