import React, { Component } from 'react';
import { Marker, Popup, Map, TileLayer, LayersControl, WMSTileLayer, GeoJSON, Polygon, Circle } from 'react-leaflet';
import { breakpoints, getColor } from './util.js';
import * as turf from '@turf/turf';

const { BaseLayer, Overlay } = LayersControl;
const opacity = 0.7;

const CONGLOMERADOS = [
  {
    "grabadora": [
      -92.93694444444445,
      15.711388888888887
    ],
    "id": 995,
    "sitio": [
      -92.93694444444445,
      15.711388888888887
    ]
  },
  {
    "grabadora": [
      -100.35166666666666,
      21.953055555555554
    ],
    "id": 1094,
    "sitio": [
      -100.35166666666666,
      21.953055555555554
    ]
  },
  {
    "grabadora": [
      -97.73666666666666,
      17.01
    ],
    "id": 615,
    "sitio": [
      -97.73722222222223,
      17.01
    ]
  },
  {
    "grabadora": [
      -98.39527777777778,
      20.513333333333332
    ],
    "id": 1064,
    "sitio": [
      -98.39527777777778,
      20.513055555555557
    ]
  },
  {
    "grabadora": [
      -97.04055555555556,
      19.524166666666666
    ],
    "id": 1003,
    "sitio": [
      -97.035,
      19.522222222222222
    ]
  },
  {
    "grabadora": [
      -100.23805555555556,
      19.503055555555555
    ],
    "id": 1068,
    "sitio": [
      -100.23777777777778,
      19.503055555555555
    ]
  },
  {
    "grabadora": [
      -100.28861111111111,
      19.464444444444442
    ],
    "id": 1070,
    "sitio": [
      -100.28833333333333,
      19.46472222222222
    ]
  },
  {
    "grabadora": [
      -97.685,
      16.81861111111111
    ],
    "id": 1007,
    "sitio": [
      -97.685,
      16.81861111111111
    ]
  },
  {
    "grabadora": [
      -97.7388888888889,
      17.001666666666665
    ],
    "id": 1008,
    "sitio": [
      -97.73388888888888,
      17.001666666666665
    ]
  },
  {
    "grabadora": [
      -97.08472222222221,
      19.47861111111111
    ],
    "id": 1075,
    "sitio": [
      -97.08444444444444,
      19.47861111111111
    ]
  },
  {
    "grabadora": [
      -98.34944444444444,
      20.421666666666667
    ],
    "id": 1012,
    "sitio": [
      -98.35027777777778,
      20.42138888888889
    ]
  },
  {
    "grabadora": [
      -96.86027777777777,
      19.108611111111113
    ],
    "id": 1080,
    "sitio": [
      -96.86027777777777,
      19.10888888888889
    ]
  },
  {
    "grabadora": [
      -96.9088888888889,
      19.065555555555555
    ],
    "id": 1081,
    "sitio": [
      -96.90916666666668,
      19.065555555555555
    ]
  },
  {
    "grabadora": [
      -98.58583333333333,
      20.60777777777778
    ],
    "id": 634,
    "sitio": [
      -98.58555555555554,
      20.60777777777778
    ]
  },
  {
    "grabadora": [
      -98.34916666666666,
      20.466944444444444
    ],
    "id": 1011,
    "sitio": [
      -98.34916666666666,
      20.466666666666665
    ]
  },
  {
    "grabadora": [
      -101.33444444444444,
      20.055833333333332
    ],
    "id": 1076,
    "sitio": [
      -101.34416666666667,
      20.055833333333332
    ]
  },
  {
    "grabadora": [
      -96.90583333333333,
      19.15583333333333
    ],
    "id": 1022,
    "sitio": [
      -96.90583333333333,
      19.155555555555555
    ]
  },
  {
    "grabadora": [
      -91.50083333333333,
      17.36861111111111
    ],
    "id": 1087,
    "sitio": [
      -91.50083333333333,
      17.36861111111111
    ]
  }
];


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

  getMapStyle() {
    if(window.innerWidth > breakpoints.desktop) {
      return {
        width: "60vw",
        height: "100vh"};

    } else if(window.innerWidth > breakpoints.tablet){
      return {
        width: "100vw",
        height: "50vh"};

    } else {
      return {
        right: "0",
        left: "0",
        top: "0",
        bottom: "0"};
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

    let grabadoras = CONGLOMERADOS.map(
      (data) => (
        <Marker position={{'lat': data['grabadora'][1], 'lon': data['grabadora'][0]}}>
          <Popup>
            {'Conglomerado ' + data['id']}
          </Popup>
          <Circle radius={1.1} color='blue' center={{'lat': data['grabadora'][1], 'lon': data['grabadora'][0]}}></Circle>
        </Marker>)
    );

    let sitios = CONGLOMERADOS.map(
      (data) => (
        <Marker position={{'lat': data['sitio'][1], 'lon': data['sitio'][0]}}>
          <Popup>
            {'Conglomerado ' + data['id']}
          </Popup>
          <Circle radius={1} color='red' center={{'lat': data['sitio'][1], 'lon': data['sitio'][0]}}></Circle>
        </Marker>)
    );

    return (
      <Map
        className="App-map"
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

        {grabadoras}

        {sitios}

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
