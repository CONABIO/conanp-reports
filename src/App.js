import React, { Component } from 'react';
import './App.css';
import List from './List.js';
import Dropdown from './Dropdown.js';
import Content from './Content.js';
//import Responsive from 'react-responsive';
import { Map, TileLayer, LayersControl, WMSTileLayer, GeoJSON, Polygon } from 'react-leaflet';
import * as turf from '@turf/turf';
import 'bulma/css/bulma.css';

import { breakpoints, CODE, NAME, PRESERVATIONS_URL, ANPS_URL, KERNELS_URL, RINGS_URL, REGIONS_URL } from './util.js';

const { BaseLayer, Overlay } = LayersControl;

//const Desktop = props => <Responsive {...props} minWidth={992} />;
//const Tablet = props => <Responsive {...props} minWidth={768} maxWidth={991} />;
//const Mobile = props => <Responsive {...props} maxWidth={767} />;
//const Default = props => <Responsive {...props} minWidth={768} />;
const position = [23.950464, -102.532867];
const zoom = 5;
const opacity = 0.7;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anp: null,
      preservation: null,
      kernel: null,
      ring: null,
      region: null,
      boundBox: null,
      selection: null,
      showInfo: false
    };
  }

  componentDidMount() {
    this.loadUrl(ANPS_URL, this.setAnp.bind(this));
    this.loadUrl(KERNELS_URL, this.setKernel.bind(this));
    this.loadUrl(REGIONS_URL, this.setRegion.bind(this));
    this.loadUrl(RINGS_URL, this.setRing.bind(this));
    this.loadUrl(PRESERVATIONS_URL, this.setPreservation.bind(this));
    this.getBoundingBoxFromMap();
  }

  loadUrl(url, callback) {
    console.log("Loading url.")
    fetch(url,{
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Accept-Encoding": "gzip,deflate",
        }})
      .then(response => {
        return response.json();
      })
      .then(data => {
        callback(data[0]);
    });
  }

  setAnp(data){
    this.setState({anp: data});
  }

  setKernel(data) {
    this.setState({kernel: data});
  }

  setRing(data) {
    this.setState({ring: data});
  }

  setPreservation(data) {
    this.setState({preservation: data});
  }

  setRegion(data) {
    this.setState({region: data});
  }

  isReady(){
    return this.state.anp != null &&
           this.state.kernel != null &&
           this.state.ring != null &&
           this.state.region != null &&
           this.state.preservation != null;
  }

  getGeoJson() {
    return this.state.anp;
  }

  getRing() {
    return this.state.ring;
  }

  getPreservation() {
    return this.state.preservation;
  }

  getRegion() {
    return this.state.region;
  }

  getKernel() {
    return this.state.kernel;
  }

  getStyleFactory(color){
    return function getStyle(feature, layer) {
        return {
          color: color,
          weight: 1,
          opacity: opacity
        }
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
    let slice = this.state.anp;
    let bounds = this.state.boundBox;
    let boundBox = [bounds.getWest(), 
                      bounds.getNorth(), 
                      bounds.getEast(), 
                      bounds.getSouth()];
    let boundBoxPolygon = turf.bboxPolygon(boundBox);
    let options = slice.features.filter(element => {
                      let aux = turf.bboxPolygon(turf.bbox(element));
                      return turf.intersect(boundBoxPolygon, aux) != null;
                    });
    
    return <List anps={options}
                 handleClick={e => this.changeSelectionHelper(e)} />
  }

  getDropDown() {
    let slice = this.state.anp;
    return <Dropdown anps={slice.features}
                     handleClick={e => this.changeSelection(e)} />
  }

  handleBoundingBoxChange(event) {
    this.getBoundingBoxFromMap();
  }

  handleCloseInfo(event) {
    this.setState({selection:null, showInfo:false});
    let leafletBbox = this.state.boundBox;
    this.leafletMap.leafletElement.fitBounds(leafletBbox);
  }

  getBoundingBoxFromMap() {
    let selection =  this.state.selection;
    if(selection == null) {
      let bounds = this.leafletMap.leafletElement.getBounds();
      this.setState({boundBox: bounds});
    }

  }

  changeSelection(event){
    let code = parseInt(event.target.value, 10);
    this.changeSelectionHelper(code);

  }

  changeSelectionHelper(newSelection) {
    let anp = this.state.anp;
    let selection = null;
    let showInfo = false;
    if(anp != null) {
      anp.features.forEach(element => {
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

    let anpLayer = null;
    let ringLayer = null;
    let kernelLayer = null;
    let regionLayer = null;
    let preservationLayer = null;

    if(content != null) { 
      //anpLayer, regionLayer, ringLayer, preservationLayer, kernelLayer
      anpLayer = content[0];
      regionLayer = content[1];
      ringLayer = content[2];
      preservationLayer = content[3];
      kernelLayer = content[4];
    }
    

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
                  attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                  url='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}' />
                <BaseLayer name="None">
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
                <BaseLayer name="Cobertura de Suelo">
                    <WMSTileLayer
                      transparent
                      format='image/png'
                      layers='MEX_LC_Landsat_8C:MEX_LC_2015_Landsat_8C'
                      attribution='CONABIO'
                      url='http://webportal.conabio.gob.mx:8085/geoserver/MEX_LC_Landsat_8C/wms?' />
                </BaseLayer>
                <Overlay checked name="ANPs">
                  {anpLayer}
                </Overlay>
                <Overlay checked name="Regiones">
                  {regionLayer}
                </Overlay>
                <Overlay checked name="Anillos">
                  {ringLayer}
                </Overlay>
                <Overlay checked name="Nucleos">
                  {kernelLayer}
                </Overlay>
                <Overlay checked name="Preservaciones">
                  {preservationLayer}
                </Overlay>
              </LayersControl>
                
            </Map>;
  }


  render() {
    let anpLayer = null;
    let regionLayer = null;
    let ringLayer = null;
    let kernelLayer = null;
    let list = null;
    let dropdown = null;
    let selectedAnp = null;
    let rightContent = null;
    let preservationLayer = null;
    let mainContent = this.getMap(null);

    if(this.isReady()) {
      anpLayer = <GeoJSON data={this.getGeoJson()} 
                          style={this.getStyleFactory("red")} 
                          onEachFeature={this.onEachFeature.bind(this)} />
      regionLayer = <GeoJSON data={this.getRegion()} 
                             style={this.getStyleFactory("white")} />
      ringLayer = <GeoJSON data={this.getRing()} 
                            style={this.getStyleFactory("blue")} />
      kernelLayer = <GeoJSON data={this.getKernel()} 
                             style={this.getStyleFactory("green")} />
      preservationLayer = <GeoJSON data={this.getPreservation()} 
                             style={this.getStyleFactory("black")} />

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
          let bbox = turf.bbox(polygon2);
          let leafletBbox = [[bbox[1], bbox[0]],
                             [bbox[3], bbox[2]]];

          console.log(bbox);

          selectedAnp = <Polygon color="black"
                                 fillOpacity={opacity}
                                 positions={turf.flip(diff).geometry.coordinates} />
          rightContent = <Content selection={this.state.selection}
                                  handleClick={e=>this.handleCloseInfo(e)}
                                  showInfo={this.state.showInfo}
                                  />

          console.log("bounds");

          mainContent = this.getMap([selectedAnp]);
          this.leafletMap.leafletElement.fitBounds(leafletBbox);
        } else {
          console.log("This is the content for a tablet or desktop.");
          rightContent = this.getList();
          mainContent = this.getMap([anpLayer, regionLayer, ringLayer, preservationLayer, kernelLayer]);
        }
      }
      if(!(window.innerWidth > breakpoints.tablet)) {
        console.log("Mobile.");
        dropdown = this.getDropDown();
        if(this.state.selection != null) {
          mainContent = <Content selection={this.state.selection}
                                 handleClick={e=>this.handleCloseInfo(e)}
                                 showInfo={this.state.showInfo}/>
        } else {
          mainContent = this.getMap([anpLayer, regionLayer, ringLayer, preservationLayer, kernelLayer]);
        }
        
      }
    } else {
      console.log("Not ready yet.");
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
