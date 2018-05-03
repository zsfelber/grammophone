import React, { Component } from 'react';
import { formatSymbol, formatProduction } from './helpers';

class LR0Table extends Component {
  render() {
    const info = this.props.grammar.calculate('grammar.symbolInfo');
    const table = this.props.grammar.calculate('parsing.lr.lr0_table');
    const productions = this.props.grammar.calculate('grammar.productions');
    
    const states = table.map((state, index) => {
      const terminals = info.terminalOrder.map(symbol => {
        const hasConflict = (typeof state.shift[symbol] === "undefined" ? 0 : 1) + state.reduce.length > 1;
        const shiftRow = typeof state.shift[symbol] !== 'undefined' ? <li key="shift">shift({state.shift[symbol]})</li> : null;
        const reduceRows = state.reduce.map((p, i) => {
          if (p === -1) {
            return <li key={`reduce-${i}`}>accept</li>;
          } else {
            return <li key={`reduce-${i}`}>reduce({formatProduction(productions[p], this.props.grammar)})</li>;
          }
        });
        
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
        return (
          <td key={symbol}>
            <ul>
              {typeof state.shift[symbol] !== 'undefined' ? <li>{state.shift[symbol]}</li> : null}
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
      <div>
        <table className="symbols lr0-table">
          <colgroup>
            <col />
          </colgroup>
          <colgroup className="t">
            {info.terminalOrder.map((_, i) => <col key={`col-${i}`} />)}
          </colgroup>
          <colgroup className="nt">
            {info.nonterminalOrder.map((_, i) => <col key={`col-${i}`} />)}
          </colgroup>

          <thead>
            <tr>
              <th>State</th>
              {info.terminalOrder.map((symbol, i) => <th key={`t-${i}`}>{formatSymbol(symbol, this.props.grammar)}</th>)}
              {info.nonterminalOrder.map((symbol, i) => <th key={`nt-${i}`}>{formatSymbol(symbol, this.props.grammar)}</th>)}
            </tr>
          </thead>

          <tbody>
            {states}
          </tbody>
        </table>
      </div>
    );
  }
}

export default LR0Table;
