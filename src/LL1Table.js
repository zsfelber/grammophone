import React, { Component } from 'react';
import { formatSymbol, formatProduction } from './helpers';
import { END } from './grammar/symbols';

class LL1Table extends Component {
  render() {
    const info = this.props.grammar.calculate('grammar.symbolInfo');
    const table = this.props.grammar.calculate('parsing.ll.ll1_table');
    const productions = this.props.grammar.calculate('grammar.productions');
    
    const nonterminals = info.productionOrder.map((nt, index) => {
      const symbols = info.terminalOrder.concat(END).map(t => {
        if (typeof table[nt][t] !== 'undefined') {
          const terminals = table[nt][t].map((p, i) => {
            return <li key={`terminal-${i}`}>{formatProduction(productions[p], this.props.grammar)}</li>;
          });
          
          return (
            <td className={table[nt][t].length > 1 ? 'conflict' : null} key={t}>
              <ul>
                {terminals}
              </ul>
            </td>
          );
        } else {
          return <td key={t} />;
        }
      });
      
      return (
        <tr key={`nonterminal-${index}`}>
          <th scope="row">{formatSymbol(nt, this.props.grammar)}</th>
          {symbols}
        </tr>
      );
    });
    
    return (
      <article id="table">
        <table className="symbols ll1-table">
          <colgroup>
            <col />
          </colgroup>
          <colgroup className="t">
            {info.terminalOrder.map((_, i) => <col key={`col-${i}`} />)}
            <col />
          </colgroup>

          <thead>
            <tr>
              <th>State</th>
              {info.terminalOrder.map((symbol, i) => <th key={`t-${i}`}>{formatSymbol(symbol, this.props.grammar)}</th>)}
              <th>{formatSymbol(END, this.props.grammar)}</th>
            </tr>
          </thead>

          <tbody>
            {nonterminals}
          </tbody>
        </table>
      </article>
    );
  }
}

export default LL1Table;
