import React, { Component } from 'react';

const breakpoints = {
  desktop: 992,
  tablet: 768
};

export default class Dropdown extends Component {
  
  constructor(props) {
    super(props);
    this.handleClick = this.props.handleClick;
  }
  
  getStyleInfo() {
    if(window.innerWidth > breakpoints.desktop) { 
      return {width: "30vw", 
              height: "100vh",
              right: "0",
              top: "0",
              bottom: "0"}
    } else if(window.innerWidth > breakpoints.tablet){
      return {width: "100vw", 
              height: "50vh", 
              bottom: "0"}
    } else {
      console.log("mobile");
      return {position: "fixed",
              width: "100vw", 
              height: "100vh", 
              right: "0",
              left: "0",
              top: "3vh",
              bottom: "0",
              zIndex: "99"};
    }
  }

  renderButton(){
    let button = null;
    if(this.props.showInfo) {
      button = <button onClick={e => this.handleClick(e)}>Cerrar</button>;
    }
    return button;
  }

  render() {
      return <section className={"App-info hero is-primary" + this.props.classMobileInfo}
                    style={this.getStyleInfo()}>
                 <div className="hero-body">
                   <h1 className="title">{this.props.selection == null?"":this.props.selection.properties[this.props.name]}</h1>
                   {this.renderButton()}
                 </div>
             </section>
  }
}