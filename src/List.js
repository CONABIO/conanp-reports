import React, { Component } from 'react';
import './List.css';
import { CODE, NAME } from './util.js';

export default class List extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.props.handleClick;
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
      <aside className="List">
        <p className="">
          Areas Naturales Protegidas
        </p>
        <ul className="">
          {anps}
        </ul>
      </aside>);
  }
}
