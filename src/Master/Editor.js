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
      <section id="edit">
        <div className="spec-wrap">
          <textarea className="spec" value={this.props.src} onChange={this.handleChange} />
        </div>
      </section>
    );
  }
}

export default Editor;
