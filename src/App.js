import React, { Component } from 'react';
import './App.css';
//import Responsive from 'react-responsive';
import { Map, TileLayer, GeoJSON, Polygon } from 'react-leaflet';
import * as turf from '@turf/turf';
import 'bulma/css/bulma.css';


const breakpoints = {
  desktop: 992,
  tablet: 768
};

//const Desktop = props => <Responsive {...props} minWidth={992} />;
//const Tablet = props => <Responsive {...props} minWidth={768} maxWidth={991} />;
//const Mobile = props => <Responsive {...props} maxWidth={767} />;
//const Default = props => <Responsive {...props} minWidth={768} />;
const position = [23.950464, -102.532867];
const zoom = 5;
const API = "http://snmb.conabio.gob.mx/api_anps/v1/anps";
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
      showInfo: false
    };
  }

  componentDidMount() {
    fetch(API)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);

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
     this.setState({selection:layer.feature, showInfo:true});
  }

  getList() {
    let slice = this.state.geojson;
    let boundBoxPolygon = turf.bboxPolygon(this.state.boundBox);
    let names = slice.features.filter(element => {
                      let aux = turf.bboxPolygon(turf.bbox(element));
                      return turf.intersect(boundBoxPolygon, aux) != null;
                    })
                .map((element, index) => <li key={index} 
                                             onClick={e => this.changeSelection(e)}
                                             value={element.properties[CODE]} >{element.properties[NAME]}</li>);
    return names;
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
    console.log(event.target);

    let code = parseInt(event.target.value, 10);
    console.log("The selected code is: " + code);
    let geojson = this.state.geojson;
    let selection = null;
    let showInfo = false;
    if(geojson != null) {
      geojson.features.forEach(element => {
        if(element.properties[CODE] === code){
          selection = element;
        }
      });
    }
    console.log("The selection.");
    console.log(selection);

    if(selection != null) {
      showInfo = true;
      console.log(selection);
    }

    this.setState({selection: selection, showInfo: showInfo});
  }

  getStyleInfo() {
    if(window.innerWidth > breakpoints.desktop) { 
      return {width:"30vw", 
              height:"100vh",
              right: "0",
              top: "0",
              bottom: "0"}
    } else if(window.innerWidth > breakpoints.tablet){
      return {width:"100vw", 
              height:"50vh", 
              bottom:"0"}
    } else {
      console.log("mobile");
      return {position: "fixed",
              width: "100vw", 
              height: "100vh", 
              right: "0",
              left: "0",
              top: "3vh",
              bottom: "0",
              zIndex: "99"};
    }
  }

  getStyleMap() {
    console.log(window.innerWidth);
    if(window.innerWidth > breakpoints.desktop) { 
      return {width:"50vw", 
              height:"100vh",
              left:"20vw"};
    } else if(window.innerWidth > breakpoints.tablet){
      return {width:"100vw", 
              height:"50vh"};
    } else {
      return {width:"100vw", 
              height:"90vh", 
              right: "0",
              left: "0",
              top: "10vh",
              bottom: "0"};
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

  getDropDown() {
    let slice = this.state.geojson;
    console.log(slice);
    let options = slice.features.map((element, index) => <option key={index} 
                                             value={element.properties[CODE]}>{element.properties[NAME]}</option>);
    return <select className="navbar-item" onChange={e=>this.changeSelection(e)}>{options}</select>;
  }

  renderButton(){
    let button = null;
    if(this.state.showInfo) {
      button = <button onClick={e => this.handleCloseInfo(e)}>Cerrar</button>;
    }
    return button;
  }

  render() {
    let geom = null;
    let list = null;
    let dropdown = null;
    let anpSelected = null;
    console.log("this.state.selection");
    console.log(this.state.selection);




    let classMobileMap = "";
    let classMobileInfo = "";
    if(this.state.ready) {
      console.log("I am ready to paint!");
      geom = <GeoJSON data={this.getGeoJson()} 
                      style={this.getStyle} 
                      onEachFeature={this.onEachFeature.bind(this)} />
      if(window.innerWidth > breakpoints.desktop) {
        console.log("Filtering list of polygons.");
        list = this.getList();
      }
      if(!(window.innerWidth > breakpoints.tablet)) {
        console.log("Building de dropdown.")
        dropdown = this.getDropDown();
        classMobileMap = (this.state.showInfo?" hide":"");
        classMobileInfo = (this.state.showInfo?"":" hide");
      }
    }


    if(this.state.selection != null){
      /**
      let polygon1 = turf.polygon([
                           [90, -180],
                           [90, 180],
                           [-90, 180],
                           [-90, -180],
                           [90, -180]
                        ]);
      let polygon2 = this.state.selection.geometry;
      console.log(turf.difference(polygon1, polygon2));
      **/
      anpSelected = <Polygon color="purple" positions={[[[90, -180],
                                                        [90, 180],
                                                        [-90, 180],
                                                        [-90, -180],
                                                        [90, -180]],[[0, 0], [11.72, -0.1], [21.52, -10.12], [0, 0]]]} />
      console.log(anpSelected);
      geom = null;
    }



    return (
      <div>
        <nav className="navbar" 
             role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item">Reportes CONANP</a>
            {dropdown}
          </div>
        </nav>
        <div className="App-container">
          
          <section className={"App-info hero is-primary" + classMobileInfo}
               style={this.getStyleInfo()}>
            <div className="hero-body">
              <h1 className="title">{this.state.selection == null?"":this.state.selection.properties[NAME]}</h1>
              {this.renderButton()}
            </div>
          </section>
          <div className={"App-map-container" + classMobileMap}>
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
                {anpSelected}
            </Map>
          </div>
          <aside className="App-list menu"
               style={this.getStyleList()} >
            <p className="menu-label">
              Areas Naturales Protegidas
            </p>
            <ul className="menu-list">
              {list}
            </ul>
          </aside>
        </div>
      </div>
    );
  }
}



export default App;
