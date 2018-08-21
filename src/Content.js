import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import { breakpoints, NAME } from './util.js';
import { loadUrl } from './util.js';

export default class Dropdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      dataReady: false
    };
    this.handleClick = this.props.handleClick;
  }

  componentDidMount() {
    console.log("Content will mount.")
    loadUrl("http://localhost:8080/data_anps.json", 
                this.setData.bind(this));
  }

  setData(data) {
    this.setState({data: data, dataReady:true});
  }

  getStyleInfo() {
    // console.log("This is the style info.")
    if (window.innerWidth > breakpoints.desktop) {
      return {
        width: "40vw",
        maxHeight: "calc(100vh -  3.25rem)",
        overflow: "auto",
        right: "0",
        top: "0",
        bottom: "0"};
    } else if (window.innerWidth > breakpoints.tablet) {
      // console.log("tablet from content");
      return {
        width: "100vw",
        height: "50vh",
        bottom: "0"};
    } else {
      // console.log("mobile");
      return {};
    }
  }

  renderButton(){
    let button = null;
    if(this.props.showInfo) {
      button = <button className="delete" onClick={e => this.handleClick(e)}></button>;
    }
    return button;
  }

  render() {

    let traceAnp1,
        traceAnp2,
        traceAnp3,
        traceAnp4,
        traceAnp5,
        traceAnp6,
        traceAnp7;

    let traceRing1,
        traceRing2,
        traceRing3,
        traceRing4,
        traceRing5,
        traceRing6,
        traceRing7;

    let name = null;

    if(this.state.dataReady) {

      name = this.state.data["nombre"];

      traceAnp1 = {
        y: this.state.data["anp"]["anio_2008"],
        type: 'box',
        name: 'Año 2008',
      };
      traceAnp2 = {
        y: this.state.data["anp"]["anio_2009"],
        type: 'box',
        name: 'Año 2009'
      };
      traceAnp3 = {
        y: this.state.data["anp"]["anio_2010"],
        type: 'box',
        name: 'Año 2010'
      };
      traceAnp4 = {
        y: this.state.data["anp"]["anio_2011"],
        type: 'box',
        name: 'Año 2011'
      };
      traceAnp5 = {
        y: this.state.data["anp"]["anio_2012"],
        type: 'box',
        name: 'Año 2012'
      };
      traceAnp6 = {
        y: this.state.data["anp"]["anio_2013"],
        type: 'box',
        name: 'Año 2013'
      };
      traceAnp7 = {
        y: this.state.data["anp"]["anio_2014"],
        type: 'box',
        name: 'Año 2014'
      };

      traceRing1 = {
        y: this.state.data["ring"]["anio_2008"],
        type: 'box',
        name: 'Año 2008',
      };
      traceRing2 = {
        y: this.state.data["ring"]["anio_2009"],
        type: 'box',
        name: 'Año 2009'
      };
      traceRing3 = {
        y: this.state.data["ring"]["anio_2010"],
        type: 'box',
        name: 'Año 2010'
      };
      traceRing4 = {
        y: this.state.data["ring"]["anio_2011"],
        type: 'box',
        name: 'Año 2011'
      };
      traceRing5 = {
        y: this.state.data["ring"]["anio_2012"],
        type: 'box',
        name: 'Año 2012'
      };
      traceRing6 = {
        y: this.state.data["ring"]["anio_2013"],
        type: 'box',
        name: 'Año 2013'
      };
      traceRing7 = {
        y: this.state.data["ring"]["anio_2014"],
        type: 'box',
        name: 'Año 2014'
      };
    }

    return (
      <article className={"App-info message is-info"} style={this.getStyleInfo()}>
        <div className="message-header">
          {this.props.selection == null?"":this.props.selection.properties[NAME]}
          {this.renderButton()}
        </div>
        <div className="message-body container" style={{overflow: "scroll"}}>
          <h1>{name}</h1>
          <h2>Información de anp</h2>
          <Plot
            data={[traceAnp1, traceAnp2, traceAnp3, traceAnp4, traceAnp5, traceAnp6, traceAnp7]}
            layout={ {width: "300px", title: 'A Box Plot'} }
          />
          <h2>Información de anillo</h2>
          <Plot
            data={[traceRing1, traceRing2, traceRing3, traceRing4, traceRing5, traceRing6, traceRing7]}
            layout={ {title: 'A Box Plot'} }
          />
        </div>
        
      </article>);
  }
}
