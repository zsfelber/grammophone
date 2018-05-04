import React, { Component } from 'react';
import Grammar from '../grammar';
import Editor from './Editor';
import Transform from './Transform';

class Master extends Component {
  constructor(props) {
    super(props);
    
    this.state = { mode: 'edit' };
    
    this.handleChangeMode = this.handleChangeMode.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleTransformChange = this.handleTransformChange.bind(this);
  }
  
  handleEditorChange(src) {
    let grammar;
    let error;
    
    try {
      grammar = Grammar.parse(src);
    } catch (e) {
      error = e;
    }
    
    this.props.onChange({ src, grammar, error });
  }
  
  handleTransformChange(grammar) {
    let src = grammar.toString();
    
    this.props.onChange({ src, grammar });
  }
  
  handleChangeMode(event) {
    let mode = event.target.value;
    
    this.setState({ mode });
  }
  
  render() {
    let content;
    
    if (this.state.mode === 'edit') {
      content = <Editor src={this.props.src} onChange={this.handleEditorChange} />;
    } else {
      content = <Transform grammar={this.props.grammar} onChange={this.handleTransformChange} />;
    }
    
    return (
      <div id="master">
        <section id="mode">
          <input type="radio" id="mode-edit" name="mode" value="edit" checked={this.state.mode === 'edit'} onChange={this.handleChangeMode} />
          <label htmlFor="mode-edit" className="left">Edit</label>
      
          <input type="radio" id="mode-transform" name="mode" value="transform" checked={this.state.mode === 'transform'} onChange={this.handleChangeMode} />
          <label htmlFor="mode-transform" className="right">Transform</label>
        </section>
      
        {content}
      </div>
    )
  }
}

export default Master;
