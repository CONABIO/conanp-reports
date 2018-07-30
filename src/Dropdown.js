import React, { Component } from 'react';

export default class Dropdown extends Component {

    constructor(props) {
      super(props);
      this.handleClick = this.props.handleClick;
    }

    render() {
      const code = this.props.code;
      const name = this.props.name;
      const anps = this.props.anps.map((element, index) => <option key={index} 
                                                                   value={element.properties[code]}>{element.properties[name]}</option>);
      return <select className="navbar-item" 
                     onChange={e=>this.handleClick(e)}>{anps}</select>;
    }
}
