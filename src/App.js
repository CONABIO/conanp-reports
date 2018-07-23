import React, { Component } from 'react';
import './App.css';
import Responsive from 'react-responsive';

const Desktop = props => <Responsive {...props} minWidth={992} />;
//const Tablet = props => <Responsive {...props} minWidth={768} maxWidth={991} />;
//const Mobile = props => <Responsive {...props} maxWidth={767} />;
//const Default = props => <Responsive {...props} minWidth={768} />;

class App extends Component {
  render() {
    return (
      <div className="App-container">
        <div className="App-info">
          <h1>Reporte ANP</h1>
        </div>
        <Desktop>
          <div className="App-list">
            <ul>
              <li>Desierto de los leones</li>
              <li>Cañón del Sumidero</li>
              <li>Mineral del chico</li>
            </ul>
          </div>
        </Desktop>
      </div>
    );
  }
}

export default App;
