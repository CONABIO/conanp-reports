import React, { Component } from 'react';
import './App.css';
import Responsive from 'react-responsive';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import * as turf from '@turf/turf';

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
      ready: false,
      boundBox: null
    };
  }

  componentDidMount() {
    fetch(API)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({geojson:data,
                       ready:true});
        console.log(this.state.geojson);
      });
    this.getBoundingBoxFromMap();
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
    let boundBoxPolygon = turf.bboxPolygon(this.state.boundBox);
    let names = slice.features.filter(element => {
                      let aux = turf.bboxPolygon(turf.bbox(element));
                      return turf.intersect(boundBoxPolygon, aux) != null;
                    })
                .map((element, index) => <li key={index}>{element.properties["NOMBRE"]}</li>);
    return names;
  }

  handleOnZoomLevelsChange(event) {
    this.getBoundingBoxFromMap();
  }

  getBoundingBoxFromMap() {
    let bounds = this.leafletMap.leafletElement.getBounds();
    let boundBox = [[
                    [bounds.getWest(), bounds.getNorth()],
                    [bounds.getEast(), bounds.getNorth()],
                    [bounds.getEast(), bounds.getSouth()],
                    [bounds.getWest(), bounds.getSouth()],
                    [bounds.getWest(), bounds.getNorth()]
                   ]];
    let alternative = [bounds.getWest(), bounds.getNorth(), bounds.getEast(), bounds.getSouth()];

    console.log("test");
    console.log(bounds);
    console.log(alternative);
    console.log(turf.bboxPolygon(alternative));
    console.log(turf.polygon(boundBox));

    this.setState({boundBox:alternative});
  }

  render() {
    let geom = null;
    let list = null;
    if (this.state.ready) {
      console.log("I am ready to paint!");
      geom = <GeoJSON data={this.getGeoJson()} style={this.getStyle} />
      list = this.getList();
    }

    return (
      <div className="App-container">
        <div className="App-info">
          <h1>Reporte ANP</h1>
        </div>
        <Map 
            className="App-map"
            center={position} 
            ref={map => { this.leafletMap = map; }} 
            zoom={zoom} 
            maxZoom={15} 
            minZoom={3}
            onZoom={(e)=>this.handleOnZoomLevelsChange(e)} 
            onMoveend={(e)=>this.handleOnZoomLevelsChange(e)} >
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
              url='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}' />
            {geom}
        </Map>
        <Desktop>
          <div className="App-list">
            <ul>
              {list}
            </ul>
          </div>
        </Desktop>
      </div>
    );
  }
}



export default App;
