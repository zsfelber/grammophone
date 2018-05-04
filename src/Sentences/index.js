import React, { Component } from 'react';
import { formatSentence } from '../helpers';

class Sentences extends Component {
  render() {
    const sentences = this.props.grammar.calculate('grammar.sentences').map((sentence, index) => {
      return (
        <li key={`sentence-${index}`}>{formatSentence(sentence, this.props.grammar)}</li>
      );
    });
    
    return (
      <article id="sentences">
        <h1>Example Sentences</h1>
        <ul className="symbols">
          {sentences}
        </ul>
      </article>
    );
  }
}

export default Sentences;
