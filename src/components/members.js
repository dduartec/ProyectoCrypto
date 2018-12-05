import React, { Component } from 'react';
import '../styles/Log.css';
import '../styles/App.css';
import Navigation from './NavigationLog';

class members extends Component {
    render() {
        return (
          <div>
            <Navigation/>
            <p>Ruta miembros de un grupo</p>
          </div>
        )
    }  
}
export default members;