import React, { Component } from 'react';
import './App.css';
import List from './List.js';
import Dropdown from './Dropdown.js';
import Overview from './Overview.js';
import Content from './Content.js';
import { BounceLoader } from 'react-spinners';
import * as turf from '@turf/turf';

import { breakpoints, loadUrl, CODE, ANPS_URL, REGIONS_URL, KERNEL_URL, PRESERVATION_URL, RING_URL } from './util.js';

const position = [23.950464, -102.532867];
const zoom = 5;
//const opacity = 0.7;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anp: null,
      preservation: null,
      kernel: null,
      ring: null,
      region: null,
      preservationReady: false,
      kernelReady: false,
      ringReady: false,
      boundBox: null,
      selection: null,
      level: 0,
      showInfo: false
    };
  }

  componentDidMount() {
    let title = (this.state.level === 0 ? "Local": (this.state.level === 1 ? "Regional": "Nacional"));
    this.setState({title:title});
    loadUrl(ANPS_URL, this.setAnp.bind(this));
    loadUrl(REGIONS_URL, this.setRegion.bind(this));
  }

  setAnp(data) {
    this.setState({anp: data});
  }

  setRegion(data) {
    this.setState({region: data,
      regionReady: true});
  }

  setRing(data) {
    this.setState({ring: data,
      ringReady: true});
  }

  setPreservation(data) {
    this.setState({preservation: data,
      preservationReady: true});
  }

  setKernel(data) {
    this.setState({kernel: data,
      kernelReady: true});
  }

  isReady() {
    return this.state.anp != null &&
      this.state.region != null;
  }

  isZoomReady() {
    return this.state.regionReady &&
           this.state.ringReady &&
           this.state.preservationReady &&
           this.state.kernelReady;
  }

  /**
   * Method to attach the correct function to the click
   * listener in the feature layer.
   **/
  onEachFeature(feature, layer) {
    layer.on({
      click: this.clickToFeature.bind(this)
    });
  }

  /**
   * Helper function to obtain the current polygon array
   * depending on the selection in the menu.
   **/
  getCurrentObjects() {
    let level = this.state.level;
    if(level === 0) {
      return this.state.anp;
    } else if (level === 1) {
      return this.state.region;
    } else {
      return null;
    }
  }

  /**
   * This will be called when the origin of the event is
   * the click on a feature in the map. It will obtain the
   * selected feature and call the helper function.
   **/
  clickToFeature(e) {

    let layer = e.target;
    this.changeSelectionHelper(layer.feature);
  }

  /**
   * This will be called when the origin of the event is
   * the click on an element in the list. It will obtain the
   * selected feature from the list element id, and call the
   * helper function.
   **/
  changeSelection(code){
    let selection = this.getSelectionFromId(code);
    this.changeSelectionHelper(selection);
  }

  getList() {
    let slice = this.getCurrentObjects();
    let bounds = this.state.boundBox;

    let boundBox = [
      bounds.getWest(),
      bounds.getNorth(),
      bounds.getEast(),
      bounds.getSouth()];
    let boundBoxPolygon = turf.bboxPolygon(boundBox);

    let options = slice.features.filter(
      element => {
        let aux = turf.bboxPolygon(turf.bbox(element));
        return turf.intersect(boundBoxPolygon, aux) != null;
      });
    return <List
      anps={options}
      handleClick={e => this.changeSelection(e)}
    />;
  }

  getDropDown() {
    let slice = this.getCurrentObjects();
    return <Dropdown
      anps={slice.features}
      handleClick={e => this.changeSelection(e)}
    />;
  }

  handleCloseInfo() {
    this.setState({
      selection:null,
      kernel:null,
      ring:null,
      preservation:null,
      showInfo:false,
      preservationReady: false,
      kernelReady: false,
      ringReady: false});
    let leafletBbox = this.state.boundBox;
    this.overview.leafletMap.leafletElement.fitBounds(leafletBbox);
  }

  changeBounds(bounds){
    //console.log("The new bounds are:");
    //console.log(bounds);
    this.setState({boundBox: bounds});
  }

  handleLevel(level) {
    let title = level === 0 ? "Local":
      level === 1 ? "Regional": "Nacional";
    this.setState({level:level, title:title});
  }

  changeSelectionHelper(feature) {
    let showInfo = false;
    if(feature != null) {
      showInfo = true;
    }
    this.setState(
      {
        selection: feature,
        showInfo: showInfo,
        anpReady: true}, () => this.loadOtherObjects());
  }

  getSelectionFromId(id) {
    let selection = null;
    let currentObjects = this.getCurrentObjects();
    if (currentObjects != null){
      currentObjects.features.forEach(element => {
        if(element.properties[CODE] === id){
          selection = element;
        }
      });
    }
    return selection;
  }

  loadOtherObjects() {
    let selection = this.state.selection;
    if(selection != null) {
      if(selection.properties != null) {
        let id = selection.properties[CODE];
        if(selection.properties != null) {
          loadUrl(KERNEL_URL + id, this.setKernel.bind(this));
          loadUrl(RING_URL + id, this.setRing.bind(this));
          loadUrl(PRESERVATION_URL + id, this.setPreservation.bind(this));
        }
      }
    }
  }

  render() {
    let dropdown = null;
    let rightContent = null;
    let mainContent = null;
    let shapes = this.getCurrentObjects();
    if(this.isReady()) {
      mainContent = <Overview
        ref={map => { this.overview = map; }}
        center={position}
        onEachFeature={this.onEachFeature.bind(this)}
        zoom={zoom}
        title={this.state.title}
        level={this.state.level}
        maxZoom={15}
        minZoom={3}
        objects={shapes}
        bounds={this.state.boundBox}
        changeBounds={this.changeBounds.bind(this)}
        selection={[
          this.state.selection,
          this.state.kernel,
          this.state.ring,
          this.state.preservation]}
      />;
      if(this.state.selection != null){
        if(!this.isZoomReady()) {
          mainContent = (
            <div className='App-spinner'>
              <BounceLoader color='#72a052' />
            </div>);
        }
        rightContent = (
          <Content
            selection={this.state.selection}
            handleClick={e=>this.handleCloseInfo(e)}
            showInfo={this.state.showInfo}
          />);
      } else {
        if(this.state.boundBox != null){
          if(window.innerWidth >= breakpoints.tablet) {
            rightContent = this.getList();
          }
          else {
            dropdown = this.getDropDown();
          }
        }
      }

    } else {
      // Not ready yet.
      return (
        <div className="App-loading">
          <div className='App-spinner'>
            <BounceLoader color='#72a052' />
          </div>
        </div>);
    }

    return (
      <div className="App">
        <nav className="App-header" aria-label="main navigation">
          <div className="">
            <a className="">Reportes CONANP</a>
          </div>
          <div className="">
            <ul>
              <li onClick={()=>this.handleLevel(0)} className={this.state.level === 0 ? "is-active": ""}><a>Local</a></li>
              <li onClick={()=>this.handleLevel(1)} className={this.state.level === 1 ? "is-active": ""}><a>Regional</a></li>
              <li className={this.state.level === 2 ? "is-active": ""}><a>Nacional</a></li>
            </ul>
          </div>
          <span className="navbar-item">{dropdown}</span>
        </nav>
        <div className="App-container">
          <div className={"App-aside"}>
            <p>Aside</p>
            {rightContent}
          </div>
          <div className={"App-map-container"}>
            <p>Map</p>
            {mainContent}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
