import React, { Component } from 'react';
import './App.css';
import List from './List.js';
import Dropdown from './Dropdown.js';
import Content from './Content.js';
//import Responsive from 'react-responsive';
import { Map, TileLayer, LayersControl, WMSTileLayer, GeoJSON, Polygon } from 'react-leaflet';
import * as turf from '@turf/turf';
import 'bulma/css/bulma.css';

import { breakpoints, CODE, NAME, API } from './util.js';

const { BaseLayer, Overlay } = LayersControl;

//const Desktop = props => <Responsive {...props} minWidth={992} />;
//const Tablet = props => <Responsive {...props} minWidth={768} maxWidth={991} />;
//const Mobile = props => <Responsive {...props} maxWidth={767} />;
//const Default = props => <Responsive {...props} minWidth={768} />;
const position = [23.950464, -102.532867];
const zoom = 5;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geojson: null,
      ready: false,
      boundBox: null,
      selection: null,
      showInfo: false
    };
  }

  componentDidMount() {
    fetch(API)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({geojson: data,
                       ready: true});
        //console.log(this.state.geojson);
        //console.log(new Set(this.state.geojson.features.map(element=>element.properties[CODE]).sort()));
      });
    this.getBoundingBoxFromMap();
  }

  getGeoJson() {
    return this.state.geojson;
  }

  getStyle(feature, layer) {
    return {
      color: 'black',
      weight: 1,
      opacity: 0.9
    }
  }

  onEachFeature(feature, layer) {
    layer.on({
      click: this.clickToFeature.bind(this)
    });
  }

  clickToFeature(e) {
     let layer = e.target;
     this.setState({selection:layer.feature, showInfo:true});
  }

  getList() {
    let slice = this.state.geojson;
    let boundBoxPolygon = turf.bboxPolygon(this.state.boundBox);
    let options = slice.features.filter(element => {
                      let aux = turf.bboxPolygon(turf.bbox(element));
                      return turf.intersect(boundBoxPolygon, aux) != null;
                    });
    
    return <List anps={options}
                 handleClick={e => this.changeSelection(e)} />
  }

  getDropDown() {
    let slice = this.state.geojson;
    return <Dropdown anps={slice.features}
                     handleClick={e => this.changeSelection(e)} />
  }

  handleBoundingBoxChange(event) {
    this.getBoundingBoxFromMap();
  }

  handleCloseInfo(event) {
    this.setState({selection:null, showInfo:false});
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
    let code = parseInt(event.target.value, 10);
    this.changeSelectionHelper(code);

  }

  changeSelectionHelper(newSelection) {
    let geojson = this.state.geojson;
    let selection = null;
    let showInfo = false;
    if(geojson != null) {
      geojson.features.forEach(element => {
        if(element.properties[CODE] === newSelection){
          selection = element;
        }
      });
    }
    if(selection != null) {
      showInfo = true;
    }
    this.setState({selection: selection, showInfo: showInfo});
  }

  getStyleMap() {
    console.log(window.innerWidth);
    if(window.innerWidth > breakpoints.desktop) { 
      return {width: "60vw", 
              height: "100vh"};
    } else if(window.innerWidth > breakpoints.tablet){
      return {width: "100vw", 
              height: "50vh"};
    } else {
      return {right: "0",
              left: "0",
              top: "0",
              bottom: "0"};
    }
  }

  getMap(content){
    return <Map className="App-map"
                center={position} 
                ref={map => { this.leafletMap = map; }} 
                zoom={zoom} 
                maxZoom={15} 
                style={this.getStyleMap()}
                minZoom={3}
                onZoom={(e)=>this.handleBoundingBoxChange(e)} 
                onMoveend={(e)=>this.handleBoundingBoxChange(e)} >
              <LayersControl position="topright">
                <TileLayer
                      attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                      url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />
                <BaseLayer checked name="None">
                    <TileLayer
                      attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                      url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />
                </BaseLayer>
                <BaseLayer checked name="Integridad Ecológica">
                    <WMSTileLayer
                      transparent
                      format='image/png'
                      layers='MEX_IE3C_250m:ie3c_2014_250m'
                      attribution='CONABIO'
                      url='http://webportal.conabio.gob.mx:8085/geoserver/MEX_IE3C_250m/wms?' />
                </BaseLayer>
                <BaseLayer checked name="Cobertura de Suelo">
                    <WMSTileLayer
                      transparent
                      format='image/png'
                      layers='MEX_LC_Landsat_8C:MEX_LC_2015_Landsat_8C'
                      attribution='CONABIO'
                      url='http://webportal.conabio.gob.mx:8085/geoserver/MEX_LC_Landsat_8C/wms?' />
                </BaseLayer>
                {content}
              </LayersControl>
                
            </Map>;
  }


  render() {
    let geoJsonLayer = null;
    let list = null;
    let dropdown = null;
    let selectedAnp = null;
    let rightContent = null;
    let mainContent = this.getMap(null);

    if(this.state.ready) {
      geoJsonLayer = <GeoJSON data={this.getGeoJson()} 
                              style={this.getStyle} 
                              onEachFeature={this.onEachFeature.bind(this)} />
      if(window.innerWidth >= breakpoints.tablet) {
        console.log("Not mobile.");
        list = this.getList();
        if(this.state.selection != null){
          let polygon1 = turf.flip(turf.polygon([[
                               [90, -180],
                               [90, 180],
                               [-90, 180],
                               [-90, -180],
                               [90, -180]
                            ]]));
          let polygon2 = this.state.selection;
          let diff = turf.difference(polygon1, polygon2);
          selectedAnp = <Polygon color="black"
                                 fillOpacity={.9}
                                 positions={turf.flip(diff).geometry.coordinates} />
          rightContent = <Content selection={this.state.selection}
                                  handleClick={e=>this.handleCloseInfo(e)}
                                  showInfo={this.state.showInfo}
                                  />
          mainContent = this.getMap(selectedAnp);
        } else {
          console.log("This is the content for a tablet or desktop.");
          rightContent = this.getList();
          mainContent = this.getMap(geoJsonLayer);
        }
      }
      if(!(window.innerWidth > breakpoints.tablet)) {
        console.log("Mobile.");
        dropdown = this.getDropDown();
        if(this.state.selection != null) {
          mainContent = <Content selection={this.state.selection}
                                 handleClick={e=>this.handleCloseInfo(e)}
                                 showInfo={this.state.showInfo}
                                  />
        } else {
          mainContent = this.getMap(geoJsonLayer);
        }
        
      }
    }

    return (
      <div>
        <nav className="navbar" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item">Reportes CONANP</a>
            <span className="navbar-item">{dropdown}</span>
          </div>
        </nav>
        <div className="App-container">
          <div className="App-aside">
            {rightContent}
          </div>
          <div className={"App-map-container"}>
            {mainContent}
          </div>
        </div>
      </div>
    );
  }
}



export default App;
