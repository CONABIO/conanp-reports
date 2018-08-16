import React, { Component } from 'react';

import { breakpoints, NAME } from './util.js';

export default class Dropdown extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.props.handleClick;
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
    return (
      <article className={"App-info message is-info"} style={this.getStyleInfo()}>
        <div className="message-header">
          {this.props.selection == null?"":this.props.selection.properties[NAME]}
          {this.renderButton()}
        </div>
        <div className="message-body max-height">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque risus mi, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum felis venenatis efficitur. Aenean ac eleifend lacus, in mollis lectus. Donec sodales, arcu et sollicitudin porttitor, tortor urna tempor ligula, id porttitor mi magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.
        </div>
      </article>);
  }
}
