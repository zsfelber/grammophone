import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Sanity from './Sanity';
import Sentences from './Sentences';
import Nonterminals from './Nonterminals';
import Parsing from './Parsing';

class Analysis extends Component {
  render() {
    return (
      <div>
        <h1>Analysis</h1>
      
        <h2>Sanity Checks</h2>
        
        <Sanity grammar={this.props.grammar} />
      
        <h2>Example Sentences</h2>
        
        <Sentences grammar={this.props.grammar} />
    
        <p><Link to="/sentences">More example sentences</Link></p>
      
        <h2>Nonterminals</h2>
        
        <Nonterminals grammar={this.props.grammar} />
      
        <h2>Parsing Algorithms</h2>
        
        <Parsing grammar={this.props.grammar} />
      </div>
    );
  }
}

export default Analysis;
