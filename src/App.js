import React, { Component } from 'react';
import './App.css';
import Responsive from 'react-responsive';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import * as turf from '@turf/turf';

const Desktop = props => <Responsive {...props} minWidth={992} />;


const breakpoints = {
  desktop: 992,
  tablet: 768
};

//const Tablet = props => <Responsive {...props} minWidth={768} maxWidth={991} />;
//const Mobile = props => <Responsive {...props} maxWidth={767} />;
//const Default = props => <Responsive {...props} minWidth={768} />;
const position = [23.950464, -102.532867];
const zoom = 5;
const API = "http://127.0.0.1:8080/anps.geojson";
const CODE = "ID_07";
const NAME = "NOMBRE";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geojson: null,
      ready: false,
      boundBox: null,
      selection: null,
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
        console.log(new Set(this.state.geojson.features.map(element=>element.properties["ID_07"]).sort()));
      });
    this.getBoundingBoxFromMap();
  }

  getGeoJson() {
    return this.state.geojson;
  }

  getStyle(feature, layer) {
    return {
      color: '#006400',
      weight: 1,
      opacity: 0.65
    }
  }

  onEachFeature(feature, layer) {
    layer.on({
      click: this.clickToFeature.bind(this)
    });
  }

  clickToFeature(e) {
     let layer = e.target;
     this.setState({selection:layer.feature.properties});
  }

  getList() {
    let slice = this.state.geojson;
    let boundBoxPolygon = turf.bboxPolygon(this.state.boundBox);
    let names = slice.features.filter(element => {
                      let aux = turf.bboxPolygon(turf.bbox(element));
                      return turf.intersect(boundBoxPolygon, aux) != null;
                    })
                .map((element, index) => <li key={index} 
                                             value={element.properties[CODE]}
                                             onClick={e => this.changeSelection(e)}>{element.properties[NAME]}</li>);
    return names;
  }

  handleBoundingBoxChange(event) {
    this.getBoundingBoxFromMap();
  }

  getBoundingBoxFromMap() {
    let bounds = this.leafletMap.leafletElement.getBounds();
    let boundBox = [bounds.getWest(), 
                       bounds.getNorth(), 
                       bounds.getEast(), 
                       bounds.getSouth()];
    this.setState({boundBox: boundBox});
  }

  changeSelection(event){
    let code = event.target.value;
    let geojson = this.state.geojson;
    let selection = {}
    if(geojson != null) {
      geojson.features.forEach(element => {
        if(element.properties[CODE] == code){
          selection = element.properties;
        }
      });
    }
    console.log(selection);
    this.setState({selection: selection});
  }

  getStyleInfo() {
    if(window.innerWidth > breakpoints.desktop) { 
      return {width:"30vw", 
              height:"100vh",
              right: "0",
              top: "0",
              bottom: "0"}
    } else {
      return {width:"100vw", height:"50vh", bottom:"0"}
    }
  }

  getStyleMap() {

    if(window.innerWidth > breakpoints.desktop) { 
      return {width:"50vw", 
              height:"100vh",
              left:"20vw"};
    } else {
      return {width:"100vw", height:"50vh"};
    }
  }

  getStyleList() {
    if(window.innerWidth > breakpoints.desktop) { 
      return {width: "20vw", 
              height: "100vh",
              left: "0",
              top: "0",
              bottom: "0"};
    } else {
      return {display:"none"};
    }
  }

  render() {
    let geom = null;
    let list = null;
    console.log("this.state.selection");
    console.log(this.state.selection);
    if(this.state.ready) {
      console.log("I am ready to paint!");
      geom = <GeoJSON data={this.getGeoJson()} 
                      style={this.getStyle} 
                      onEachFeature={this.onEachFeature.bind(this)} />
      if(window.innerWidth > breakpoints.desktop) {
        console.log("Filtering list of polygons.");
        list = this.getList();
      }
    }

    return (
      <div className="App-container">
        <div className="App-info"
             style={this.getStyleInfo()}>
          <h1>{this.state.selection == null?"":this.state.selection[NAME]}</h1>
        </div>
        
        <Map 
              className="App-map"
              center={position} 
              ref={map => { this.leafletMap = map; }} 
              zoom={zoom} 
              maxZoom={15} 
              style={this.getStyleMap()}
              minZoom={3}
              onZoom={(e)=>this.handleBoundingBoxChange(e)} 
              onMoveend={(e)=>this.handleBoundingBoxChange(e)} >
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                url='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}' />
              {geom}
        </Map>
        <div className="App-list"
             style={this.getStyleList()} >
          <ul>
            {list}
          </ul>
        </div>
      </div>
    );
  }
}



export default App;
