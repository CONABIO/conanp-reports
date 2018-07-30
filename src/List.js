import React, { Component } from 'react';

const breakpoints = {
  desktop: 992,
  tablet: 768
};

export default class List extends Component {

    constructor(props) {
      super(props);
      this.handleClick = this.props.handleClick;
    }



    render() {
      const code = this.props.code;
      const name = this.props.name;
      const anps = this.props.anps.map((element, index) => <li key={index} 
                                                                onClick={e => this.handleClick(e)}
                                                                value={element.properties[code]}>{element.properties[name]}</li>);
      return <ul className="menu-list">
               {anps}
             </ul>;
    }

}
