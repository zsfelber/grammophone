import React, { Component } from 'react';

class Editor extends Component {
  constructor(props) {
    super(props);
    
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event) {
    let src = event.target.value;
    
    this.props.onChange(src);
  }
  
  render() {
    return (
      <React.Fragment>
        <h1>Editor</h1>
        <textarea className="editor" value={this.props.src} onChange={this.handleChange} />
      </React.Fragment>
    );
  }
}

export default Editor;
