import React, { Component } from 'react';
import './App.css';
import Responsive from 'react-responsive';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';

const Desktop = props => <Responsive {...props} minWidth={992} />;
//const Tablet = props => <Responsive {...props} minWidth={768} maxWidth={991} />;
//const Mobile = props => <Responsive {...props} maxWidth={767} />;
//const Default = props => <Responsive {...props} minWidth={768} />;
const position = [23.950464, -102.532867];
const zoom = 5;
const API = "http://127.0.0.1:8080/anps.geojson";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geojson: null,
      ready:false
    };
  }

  componentDidMount() {
    fetch(API)
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(data => {
        this.setState({geojson:data,
                       ready:true});
      });
  }

  getGeoJson() {
    return this.state.geojson;
  }

  getStyle(feature, layer) {
    return {
      color: '#006400',
      weight: 5,
      opacity: 0.65
    }
  }

  getList() {
    let slice = this.state.geojson;
  }

  render() {
    let geom = null;
    if (this.state.ready) {
      console.log("I am ready to paint!");
      geom = <GeoJSON data={this.getGeoJson()} style={this.getStyle} />
    }

    return (
      <div className="App-container">
        <div className="App-info">
          <h1>Reporte ANP</h1>
        </div>
        <Map 
            className="App-map"
            center={position} 
            zoom={zoom} 
            maxZoom={15} 
            minZoom={3}>
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
              url='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}' />
            {geom}
        </Map>
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
