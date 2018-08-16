import React, { Component } from 'react';

import { CODE, NAME } from './util.js';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.props.handleClick;
  }

  render() {
    const anps = this.props.anps.map((element, index) => (
      <option key={index} value={element.properties[CODE]}>
        {element.properties[NAME]}
      </option>));
    return (
      <div className="select">
        <select onChange={e=>this.handleClick(e)}>{anps}</select>
      </div>);
  }
}
