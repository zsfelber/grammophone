import React, { Component } from 'react';
import Grammar from '../grammar';
import Editor from './Editor';
import Transform from './Transform';

class Master extends Component {
  constructor(props) {
    super(props);
    
    this.state = { mode: 'editor' };
    
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
    
    if (this.state.mode === 'editor') {
      content = <Editor src={this.props.src} onChange={this.handleEditorChange} />;
    } else {
      content = <Transform grammar={this.props.grammar} onChange={this.handleTransformChange} />;
    }
    
    return (
      <React.Fragment>
        <p>
          <button value="editor" onClick={this.handleChangeMode}>Editor</button>
          <button value="transform" onClick={this.handleChangeMode}>Transform</button>
        </p>
      
        {content}
      </React.Fragment>
    )
  }
}

export default Master;
