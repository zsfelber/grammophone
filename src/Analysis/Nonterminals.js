import React, { Component } from 'react';
import { formatSymbol, formatTerminalSet } from '../helpers';

class Nonterminals extends Component {
  render() {
    const info = this.props.grammar.calculate('grammar.symbolInfo');
    const nullable = this.props.grammar.calculate('grammar.nullable');
    const endable = this.props.grammar.calculate('grammar.endable');
    const first = this.props.grammar.calculate('grammar.first');
    const follow = this.props.grammar.calculate('grammar.follow');
    
    const nonterminals = info.productionOrder.map((symbol, i) => {
      return (
        <tr key={`symbol-${i}`}>
          <td>{formatSymbol(symbol, this.props.grammar)}</td>
          <td>{nullable[symbol] ? "Nullable" : null }</td>
          <td>{endable[symbol] ? "Endable" : null }</td>
          <td>{formatTerminalSet(first[symbol] || {}, this.props.grammar)}</td>
          <td>{formatTerminalSet(follow[symbol] || {}, this.props.grammar)}</td>
        </tr>
      );
    });
    
    return (
      <table className="symbols">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Nullable?</th>
            <th>Endable?</th>
            <th>First set</th>
            <th>Follow set</th>
          </tr>
        </thead>
        <tbody>
          {nonterminals}
        </tbody>
      </table>
    );
  }
}

export default Nonterminals;
