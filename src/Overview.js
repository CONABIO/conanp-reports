import React, { Component } from 'react';
import { Map, TileLayer, LayersControl, WMSTileLayer, GeoJSON, Polygon } from 'react-leaflet';
import { breakpoints, getColor } from './util.js';
import * as turf from '@turf/turf';
import './Overview.css';

const { BaseLayer, Overlay } = LayersControl;
const opacity = 0.7;

export default class Overview extends Component {

  constructor(props) {
    super(props);
    this.leafletMap = null;
    this.changeBounds = this.props.changeBounds;
  }

  componentWillMount() {
    let finalMask = null;
    let leafletBbox = null;
    let polygons = this.props.selection.filter(element => element!=null);
    // console.log(polygons);

    if(polygons.length > 0) {
      let clonePolygons = polygons.slice(0);
      let union = clonePolygons.shift();

      clonePolygons.forEach(function(polygon){
        // check for kinks in the drawn feature
        let kinks = turf.kinks(polygon);
        if(kinks.features.length > 0) {
          // console.log(polygon);
          // if there are self-intersections, buffer by 0 to get rid of them
          polygon = turf.buffer(polygon, 0, {units: "meters"});
        }
        union = turf.union(union, polygon);
      });

      // console.log(union);
      let bbox = turf.bbox(union);
      leafletBbox = [
        [bbox[1], bbox[0]],
        [bbox[3], bbox[2]]];

      let world = turf.flip(turf.polygon([[
        [90, -180],
        [90, 180],
        [-90, 180],
        [-90, -180],
        [90, -180]]]));

      let mask = turf.difference(world, union);
      finalMask = turf.flip(mask).geometry.coordinates;
    }

    this.setState({
      bounds: leafletBbox,
      mask: finalMask});
  }

  componentDidMount() {
    //console.log("Map did mount.");
    this.getBoundingBoxFromMap();
    let leafletBbox = this.state.bounds;

    if(leafletBbox != null) {
      this.leafletMap.leafletElement.fitBounds(leafletBbox);
    }
  }

  comoponentDidUpdate(prevProps) {
    if (prevProps.selection !== this.props.selection) {
      //console.log("The data changed");
    }
    else {
      //console.log("Nofing changed");
    }
  }

  handleBoundingBoxChange() {
    this.getBoundingBoxFromMap();
  }

  getBoundingBoxFromMap() {
    let polygons = this.props.selection.filter(element => element!=null);

    if(!(polygons.length > 0)) {
      let bounds = this.leafletMap.leafletElement.getBounds();
      this.changeBounds(bounds);
    }
  }

  getStyleFactory(color){
    return function getStyle() {
      return {
        color: color,
        weight: 1,
        opacity: opacity};
    };
  }

  render() {
    let objectLayer = null;
    let maskLayer = null;
    let polygons = this.props.selection.filter(element => element!=null);
    let finalMask = this.state.mask;

    if(polygons.length > 0) {
      objectLayer = polygons.map(function(polygon, index) {
        let tipo = polygon.properties['tipo'];

        return (
          <Overlay key={index} checked name={tipo}>
            <Polygon
              color={getColor(tipo)}
              fillOpacity={opacity}
              positions={turf.flip(polygon).geometry.coordinates}
            />
          </Overlay>);
      });

      maskLayer = (
        <Polygon
          key={this.props.level}
          color="black"
          fillOpacity={opacity}
          positions={finalMask}
        />);

    } else {
      objectLayer = (
        <Overlay key={this.props.level} checked name={this.props.title}>
          <GeoJSON
            data={this.props.objects}
            style={this.getStyleFactory("black")}
            onEachFeature={this.props.onEachFeature}
          />
        </Overlay>);
    }

    return (
      <Map
        className="Overview"
        center={this.props.center}
        ref={map => { this.leafletMap = map; }}
        zoom={this.props.zoom}
        maxZoom={this.props.maxZoom}
        style={this.getMapStyle()}
        minZoom={this.props.minZoom}
        onZoom={(e)=>this.handleBoundingBoxChange(e)}
        onMoveend={(e)=>this.handleBoundingBoxChange(e)}
      >

        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
          url='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        />

        <LayersControl position="topright">

          <BaseLayer name="None">
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            />
          </BaseLayer>

          <BaseLayer checked name="Integridad Ecológica">
            <WMSTileLayer
              transparent
              format='image/png'
              layers='MEX_IE3C_250m:ie3c_2014_250m'
              attribution='CONABIO'
              url='http://webportal.conabio.gob.mx:8085/geoserver/MEX_IE3C_250m/wms?'
            />
          </BaseLayer>

          <BaseLayer name="Cobertura de Suelo">
            <WMSTileLayer
              transparent
              format='image/png'
              layers='MEX_LC_Landsat_8C:MEX_LC_2015_Landsat_8C'
              attribution='CONABIO'
              url='http://webportal.conabio.gob.mx:8085/geoserver/MEX_LC_Landsat_8C/wms?'
            />
          </BaseLayer>

          {objectLayer}
        </LayersControl>

        {maskLayer}
      </Map>);
  }
}
