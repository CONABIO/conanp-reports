import React, { Component } from 'react';
import './App.css';
import List from './List.js';
import Dropdown from './Dropdown.js';
import Overview from './Overview.js';
import Content from './Content.js';
import { BounceLoader } from 'react-spinners';
import { Polygon } from 'react-leaflet';
import * as turf from '@turf/turf';
import 'bulma/css/bulma.css';

import { breakpoints, loadUrl, CODE, ANPS_URL, REGIONS_URL, KERNEL_URL, PRESERVATION_URL, RING_URL } from './util.js';

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
      preservationReady: false,
      kernelReady: false,
      ringReady: false,
      boundBox: null,
      selection: null,
      level: 1,
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

  getStyleFactory(color){
    return function getStyle(feature, layer) {
        return {
          color: color,
          weight: 1,
          opacity: opacity
        };
      };
  }

  onEachFeature(feature, layer) {
    layer.on({
      click: this.clickToFeature.bind(this)
    });
  }

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

  clickToFeature(e) {
     let layer = e.target;
     this.setState({selection:layer.feature, showInfo:true});
     this.loadOtherObjects();
  }

  getList() {
    let slice = this.getCurrentObjects();
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
                 handleClick={e => this.changeSelectionHelper(e)} />;
  }

  getDropDown() {
    let slice = this.getCurrentObjects();
    return <Dropdown anps={slice.features}
                     handleClick={e => this.changeSelection(e)} />;
  }

  handleCloseInfo(event) {
    this.setState({selection:null,
                   kernel:null,
                   ring:null,
                   preservation:null,
                   showInfo:false,
                   preservationReady: false,
                   kernelReady: false,
                   ringReady: false});
    //let leafletBbox = this.state.boundBox;
    //this.leafletMap.leafletElement.fitBounds(leafletBbox);
  }

  changeBounds(bounds){
    this.setState({boundBox: bounds});
  }

  changeSelection(event){
    let code = parseInt(event.target.value, 10);
    this.changeSelectionHelper(code);

  }

  handleLevel(level) {
    let title = level === 0 ? "Local":
                level === 1 ? "Regional":
                               "Nacional";
    this.setState({level:level, title:title});

  }

  changeSelectionHelper(newSelection) {
    let currentObjects = this.getCurrentObjects();
    let selection = null;
    let showInfo = false;
    if(currentObjects != null) {
      currentObjects.features.forEach(element => {
        if(element.properties[CODE] === newSelection){
          selection = element;
        }
      });
    }
    if(selection != null) {
      showInfo = true;
      this.loadOtherObjects();
    }
    this.setState({selection: selection,
                   showInfo: showInfo,
                   anpReady: true});
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
    let selectedAnp = null;
    let rightContent = null;
    let mainContent = null;
    let shapes = this.getCurrentObjects();
    if(this.isReady()) {
      mainContent = <Overview center={position}
                              onEachFeature={this.onEachFeature.bind(this)}
                              zoom={zoom}
                              title={this.state.title}
                              level={this.state.level}
                              maxZoom={15}
                              minZoom={3}
                              objects={shapes}
                              changeBounds={this.changeBounds.bind(this)}
                              selection={[this.state.selection,
                                          this.state.kernel,
                                          this.state.ring,
                                          this.state.preservation]} />;
      if(window.innerWidth >= breakpoints.tablet) {
        if(this.state.selection != null){
          if(!this.isZoomReady()) {
            mainContent = <div className='App-spinner'>
                            <BounceLoader color='#72a052' />
                          </div>;
          }
          rightContent = <Content selection={this.state.selection}
                                  handleClick={e=>this.handleCloseInfo(e)}
                                  showInfo={this.state.showInfo}
                                  />;
          //this.leafletMap.leafletElement.fitBounds(leafletBbox);
        } else {
          if(this.state.boundBox != null){
            rightContent = this.getList();
          }
        }
      }
      if(!(window.innerWidth > breakpoints.tablet)) {
        dropdown = this.getDropDown();
        if(this.state.selection != null) {
          mainContent = <Content selection={this.state.selection}
                                 handleClick={e=>this.handleCloseInfo(e)}
                                 showInfo={this.state.showInfo}/>;
        } else {
        }

      }
    } else {
      return <div className='App-spinner'>
               <BounceLoader color='#72a052' />
             </div>;
    }

    return (
      <div>
        <nav className="navbar" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item">Reportes CONANP</a>
          </div>
          <div className="navbar-item tabs is-right is-toggle is-toggle-rounded">
            <ul>
              <li onClick={e=>this.handleLevel(0)} className={this.state.level === 0 ? "is-active": ""}><a>Local</a></li>
              <li onClick={e=>this.handleLevel(1)} className={this.state.level === 1 ? "is-active": ""}><a>Regional</a></li>
              <li className={this.state.level === 2 ? "is-active": ""}><a>Nacional</a></li>
            </ul>
          </div>
          <span className="navbar-item">{dropdown}</span>
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
