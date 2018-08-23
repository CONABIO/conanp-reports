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
        name: 'Año 2013'
      };
    }

    return (
      <article className={"App-info"} style={this.getStyleInfo()}>
        <div className="">
          {this.props.selection == null?"":this.props.selection.properties[NAME]}
          {this.renderButton()}
        </div>
        <div className="" style={{overflow: "scroll"}}>
          <h1>{name}</h1>
          <h2>Información de anp</h2>
          <Plot
            style={{ width:"100%" }}
            useResizeHandler
            data={[traceAnp1, traceAnp2, traceAnp3, traceAnp4, traceAnp5, traceAnp6, traceAnp7]}
            layout={ {autosize: "true", title: 'Area Natural Protegida'} }
            config={ {displayModeBar: false} }
          />
          <h2>Información de anillo</h2>
          <Plot
            style={{ width:"100%" }}
            useResizeHandler
            data={[traceRing1, traceRing2, traceRing3, traceRing4, traceRing5, traceRing6, traceRing7]}
            layout={ {autosize: "true", title: 'Anillo'} }
            config={ {displayModeBar: false} }
          />
        </div>
      </article>);
  }
}
