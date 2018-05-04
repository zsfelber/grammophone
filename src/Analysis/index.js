import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Sanity from './Sanity';
import Sentences from './Sentences';
import Nonterminals from './Nonterminals';
import Parsing from './Parsing';

class Analysis extends Component {
  render() {
    return (
      <React.Fragment>
        <article id="sanity">
          <h1>Sanity Checks</h1>
          <Sanity grammar={this.props.grammar} />
        </article>

        <article id="sentences">
          <h1>Example Sentences</h1>
          <Sentences grammar={this.props.grammar} />
          <p><Link to="/sentences">More example sentences</Link></p>
        </article>

        <article id="nonterminals">
          <h1>Nonterminals</h1>
          <Nonterminals grammar={this.props.grammar} />
        </article>

        <article id="parsing">
          <h1>Parsing Algorithms</h1>
          <Parsing grammar={this.props.grammar} />
        </article>
      </React.Fragment>
    );
  }
}

export default Analysis;
