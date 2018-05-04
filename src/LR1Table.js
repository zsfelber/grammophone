import React, { Component } from 'react';
import { formatSymbol, formatProduction } from './helpers';
import { END } from './grammar/symbols';

class LR1Table extends Component {
  render() {
    const info = this.props.grammar.calculate('grammar.symbolInfo');
    const table = this.props.grammar.calculate('parsing.lr.lr1_table');
    const productions = this.props.grammar.calculate('grammar.productions');
    
    const states = table.map((state, index) => {
      const terminals = info.terminalOrder.concat(END).map(symbol => {
        if (typeof state[symbol] === "undefined") {
          return <td key={symbol} />;
        }
        
        const hasConflict = (typeof state[symbol].shift === "undefined" ? 0 : 1) + (typeof state[symbol].reduce === "undefined" ? 0 : state[symbol].reduce.length) > 1;
        const shiftRow = typeof state[symbol].shift !== 'undefined' ? <li key="shift">shift({state[symbol].shift})</li> : null;
        
        const reduceRows = (typeof state[symbol].reduce === "undefined" ? [] : state[symbol].reduce.map((p, i) => {
          if (p === -1) {
            return <li key={`reduce-${i}`}>accept</li>;
          } else {
            return <li key={`reduce-${i}`}>reduce({formatProduction(productions[p], this.props.grammar)})</li>;
          }
        }));
        
        return (
          <td className={hasConflict ? 'conflict' : null} key={symbol}>
            <ul>
              {shiftRow}
              {reduceRows}
            </ul>
          </td>
        );
      });
      
      const nonterminals = info.nonterminalOrder.map(symbol => {
        if (typeof state[symbol] === "undefined") {
          return <td key={symbol} />;
        }
        
        return (
          <td key={symbol}>
            <ul>
              {typeof state[symbol].shift !== 'undefined' ? <li>{state[symbol].shift}</li> : null}
            </ul>
          </td>
        );
      });
      
      return (
        <tr>
          <th scope="row">{index}</th>
          {terminals}
          {nonterminals}
        </tr>
      );
    });
    
    return (
      <article id="table">
        <table className="symbols lr1-table">
          <colgroup>
            <col />
          </colgroup>
          <colgroup className="t">
            {info.terminalOrder.map((_, i) => <col key={`col-${i}`} />)}
            <col />
          </colgroup>
          <colgroup className="nt">
            {info.nonterminalOrder.map((_, i) => <col key={`col-${i}`} />)}
          </colgroup>

          <thead>
            <tr>
              <th>State</th>
              {info.terminalOrder.map((symbol, i) => <th key={`t-${i}`}>{formatSymbol(symbol, this.props.grammar)}</th>)}
              <th>{formatSymbol(END, this.props.grammar)}</th>
              {info.nonterminalOrder.map((symbol, i) => <th key={`nt-${i}`}>{formatSymbol(symbol, this.props.grammar)}</th>)}
            </tr>
          </thead>

          <tbody>
            {states}
          </tbody>
        </table>
      </article>
    );
  }
}

export default LR1Table;
