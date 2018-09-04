import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import { NAME } from './util.js';
import { loadUrl, BOX_PLOTS_URL } from './util.js';

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
    console.log("Content will mount.");
    let id = this.props.selection.properties.id_07;
    let url = BOX_PLOTS_URL + id;
    loadUrl(url, this.setData.bind(this));
  }

  setData(data) {
    this.setState({data: data["chart"], dataReady:true});
  }

  renderButton(){
    let button = null;
    if(this.props.showInfo) {
      button = <button className="delete" onClick={e => this.handleClick(e)}></button>;
    }
    return button;
  }

  render() {

    let name = null;
    let plotAnp = null;
    let plotRing = null;

    if(this.state.dataReady && this.state.data != null) {
      let anpData = [];
      let ringData = [];

      this.state.data.forEach(function(element) {
        if(element["tipo"] === "Anillo") {
          ringData.push({y: element["idoneidad"],
                     type: 'box',
                     name: "Año " + element["anio"],
                     marker: {color: '#FF4136'},
                    });
        }

        if(element["tipo"] === "ANP") {
          anpData.push({y: element["idoneidad"],
                     type: 'box',
                     name: "Año " + element["anio"],
                     marker: {color: '#FF4136'},
                    });
        }
      });

      console.log(anpData);

      plotAnp = <Plot
        style={{ width:"100%" }}
        useResizeHandler
        data={anpData}
        layout={ {autosize: "true", title: 'Area Natural Protegida'} }
        config={ {displayModeBar: false} }
      />

      plotRing = <Plot
        style={{ width:"100%" }}
        useResizeHandler
        data={ringData}
        layout={ {autosize: "true", title: 'Area Natural Protegida'} }
        config={ {displayModeBar: false} }
      />

    }

    return (
      <article className={"App-info"}>
        <div className="">
          {this.props.selection === null?"":this.props.selection.properties[NAME]}
          {this.renderButton()}
        </div>
        <div className="" style={{overflow: "scroll"}}>
          <h1>{name}</h1>
          <h2>Información de anp</h2>
          {plotAnp}
          <h2>Información de anillo</h2>
          {plotRing}
        </div>
      </article>);
  }
}
