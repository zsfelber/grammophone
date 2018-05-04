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
      <div>
        <ul>
          {sentences}
        </ul>
      </div>
    );
  }
}

export default Sentences;
