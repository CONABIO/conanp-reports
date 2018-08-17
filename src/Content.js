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
    this.setState({data: data["anp_terrestres_2017_NOMBRE_Sacromonte_ring"], dataReady:true});
  }

  getStyleInfo() {
    // console.log("This is the style info.")
    if (window.innerWidth > breakpoints.desktop) {
      return {
        width: "40vw",
        height: "100vh",
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

    let length = 50;
    let y0 = new Array(length);
    let y1 = new Array(length);

    for (let i = 0; i < length; i ++) {
        y0[i] = Math.random();
        y1[i] = Math.random() + 1;
    }
    
    let trace1 = {
      y: y0,
      type: 'box'
    };
    
    let trace2 = {
      y: y1,
      type: 'box'
    };

    let trace3, trace4, trace5, trace6, trace7;

    if(this.state.dataReady) {
      trace1 = {
        y: this.state.data["anio_2008"],
        type: 'box',
        name: 'Año 2008',
        jitter: 0.3,
        pointpos: -1.8,
        marker: {
          color: 'rgb(7,40,89)'
        },
        boxpoints: 'Outliers'
      };
      trace2 = {
        y: this.state.data["anio_2009"],
        type: 'box',
        name: 'Año 2009'
      };
      trace3 = {
        y: this.state.data["anio_2010"],
        type: 'box',
        name: 'Año 2010'
      };
      trace4 = {
        y: this.state.data["anio_2011"],
        type: 'box',
        name: 'Año 2011'
      };
      trace5 = {
        y: this.state.data["anio_2012"],
        type: 'box',
        name: 'Año 2012'
      };
      trace6 = {
        y: this.state.data["anio_2013"],
        type: 'box',
        name: 'Año 2013'
      };
      trace7 = {
        y: this.state.data["anio_2014"],
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
        <div className="message-body max-height">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque risus mi, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum felis venenatis efficitur. Aenean ac eleifend lacus, in mollis lectus. Donec sodales, arcu et sollicitudin porttitor, tortor urna tempor ligula, id porttitor mi magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.
        </div>
        <Plot
          data={[trace1, trace2, trace3, trace4, trace5, trace6, trace7]}
          layout={ {width: "100%", title: 'A Box Plot'} }
        />
      </article>);
  }
}
