import React, { Component } from 'react';
import { Map, TileLayer, LayersControl, WMSTileLayer, GeoJSON, Polygon } from 'react-leaflet';
import { breakpoints } from './util.js';

const { BaseLayer, Overlay } = LayersControl;
const opacity = 0.7;

export default class Overview extends Component {

  constructor(props) {
    super(props);
    this.leafletMap = null;
    this.changeBounds = this.props.changeBounds;
  }

  componentDidMount() { 
    console.log("Map did mount.")

    this.getBoundingBoxFromMap();
    ;
  }

  getMapStyle() {
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

  handleBoundingBoxChange(event) {
    this.getBoundingBoxFromMap();
  }



  getBoundingBoxFromMap() {
    
    let selection =  this.props.selection;
    
    if(selection == null) {
      let bounds = this.leafletMap.leafletElement.getBounds();
      this.changeBounds(bounds)
    }
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

  render() {


    let anpLayer = null;

    if(this.props.selection == null) {
      console.log("Selection is " + this.props.selection);
      console.log(this.props.anps);
      anpLayer = <Overlay checked 
                          name="ANPs">
                    <GeoJSON data={this.props.anps}
                             style={this.getStyleFactory("black")}
                             onEachFeature={this.props.onEachFeature} />
                 </Overlay>
    }

    return <Map className="App-map"
                center={this.props.center} 
                ref={map => { this.leafletMap = map; }} 
                zoom={this.props.zoom} 
                maxZoom={this.props.maxZoom} 
                style={this.getMapStyle()}
                minZoom={this.props.minZoom}
                onZoom={(e)=>this.handleBoundingBoxChange(e)} 
                onMoveend={(e)=>this.handleBoundingBoxChange(e)} >
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                url='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}' />
              <LayersControl position="topright">
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
                {anpLayer}
              </LayersControl>
            </Map>;
  }

}