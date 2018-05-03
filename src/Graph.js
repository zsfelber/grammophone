import React, { Component } from 'react';
import Viz from 'viz.js';
import worker from 'viz.js/full.js.opaque';

let viz = new Viz({ worker });

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.containerRef = React.createRef();
  }
  
  updateOutput() {
    viz.renderSVGElement(this.props.src)
    .then(element => {
      this.setState({ element });
    });
  }
  
  componentDidMount() {
    this.updateOutput();
  }
  
  componentWillUnmount() {
  }
  
  componentDidUpdate(prevProps, prevState) {
    const { src } = this.props;
    
    // Only update output if input the relevant props changed.
    
    if (src !== prevProps.src) {
      this.updateOutput();
    }
    
    // Only change the container if the element changed and we have a reference to the container's element.
    
    if (this.state.element !== prevState.element && this.containerRef.current) {
      let container = this.containerRef.current;
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      
      if (this.state.element) {
        this.containerRef.current.appendChild(this.state.element);
      }
    }
  }
  
  render() {
    return <div ref={this.containerRef} />;
  }
}

export default Graph;
