import React, { Component } from 'react';
import '../styles/Log.css';
import '../styles/App.css';
import Navigation from './NavigationLog';

class msgs extends Component {
    render() {
        return (
          <div>
            <Navigation/>
            <p>Ruta mensajes</p>
          </div>
        )
    }  
}
export default msgs;