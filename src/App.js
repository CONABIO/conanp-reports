import React, { Component } from 'react';
import './App.css';
import List from './List.js';
import Dropdown from './Dropdown.js';
import Overview from './Overview.js';
import Content from './Content.js';
import { Polygon } from 'react-leaflet';
import * as turf from '@turf/turf';
import 'bulma/css/bulma.css';

import { breakpoints, loadUrl, CODE, ANPS_URL } from './util.js';

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
    loadUrl(ANPS_URL, this.setAnp.bind(this));
    //loadUrl(KERNELS_URL, this.setKernel.bind(this));
    //loadUrl(REGIONS_URL, this.setRegion.bind(this));
    //loadUrl(RINGS_URL, this.setRing.bind(this));
    //loadUrl(PRESERVATIONS_URL, this.setPreservation.bind(this));
  }

  setAnp(data){
    this.setState({anp: data});
  }

  isReady(){
    return this.state.anp != null ;
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

  handleCloseInfo(event) {
    this.setState({selection:null, showInfo:false});
    //let leafletBbox = this.state.boundBox;
    //this.leafletMap.leafletElement.fitBounds(leafletBbox);
  }

  changeBounds(bounds){
    console.log("The bounds are " + bounds)
    console.log(bounds);
    this.setState({boundBox: bounds});
    console.log(this.state.boundBox);
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

  render() {
    let dropdown = null;
    let selectedAnp = null;
    let rightContent = null;
    let mainContent = null;
    if(this.isReady()) {
      mainContent = <Overview center={position}
                              onEachFeature={this.onEachFeature.bind(this)}
                              zoom={zoom}
                              maxZoom={15}
                              minZoom={3} 
                              anps={this.state.anp}
                              changeBounds={this.changeBounds.bind(this)}
                              selection={this.state.selection} />;
      if(window.innerWidth >= breakpoints.tablet) {
        console.log("Not mobile.");
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
                                 fillOpacity={opacity}
                                 positions={turf.flip(diff).geometry.coordinates} />
          rightContent = <Content selection={this.state.selection}
                                  handleClick={e=>this.handleCloseInfo(e)}
                                  showInfo={this.state.showInfo}
                                  />
          //this.leafletMap.leafletElement.fitBounds(leafletBbox);
        } else {
          console.log("This is the content for a tablet or desktop.");
          if(this.state.boundBox != null){
            rightContent = this.getList();
          }
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
          console.log("Nothing selected and mobile.");
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
