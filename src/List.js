import React, { Component } from 'react';
import './List.css';
import { breakpoints, CODE, NAME } from './util.js';

export default class List extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.props.handleClick;
  }

  getStyleList() {
    /**
    if(window.innerWidth >= breakpoints.desktop) {
      return {
        width: "40vw",
        height: "100vh",
        right: "0",
        top: "0",
        bottom: "0"};
    } else if(window.innerWidth >= breakpoints.tablet) {
      return {
        width: "100vw",
        height: "100vh",
        right: "0",
        top: "0",
        bottom: "0"};
    }
    else {
      return {display:"none"};
    }
    **/
  }

  render() {
    const anps = this.props.anps.map(
      (element, index) => (
        <li key={index}>
          <a onClick={() => this.handleClick(element.properties[CODE])}>
            {element.properties[NAME]}
          </a>
        </li>));

    return (
      <aside className="List" style={this.getStyleList()}>
        <p className="">
          Areas Naturales Protegidas
        </p>
        <ul className="">
          {anps}
        </ul>
      </aside>);
  }
}
