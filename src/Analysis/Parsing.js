import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { formatClassification } from '../helpers';

class Parsing extends Component {
  render() {
    const classification = this.props.grammar.calculate("grammar.classification");
    
    return (
      <div>
        <table className="parsing-algorithm-table">
          <tbody>
            <tr>
              <th scope="row">LL(1)</th>
              <td className="classification">
                {formatClassification(classification, "ll1", "LL(1)")}
              </td>
              <td>
                <Link to="/ll1-table">Parsing table</Link>
              </td>
            </tr>

            <tr>
              <th scope="row">LR(0)</th>
              <td className="classification">
                {formatClassification(classification, "lr0", "LR(0)")}
              </td>
              <td>
                <Link to="/lr0-automaton">Automaton</Link>, <Link to="/lr0-table">Parsing table</Link>
              </td>
            </tr>

            <tr>
              <th scope="row">SLR(1)</th>
              <td className="classification">
                {formatClassification(classification, "slr1", "SLR(1)")}
              </td>
              <td>
                Parsing table
              </td>
            </tr>

            <tr>
              <th scope="row">LR(1)</th>
              <td className="classification">
                {formatClassification(classification, "lr1", "LR(1)")}
              </td>
              <td>
                Automaton,
                Parsing table
              </td>
            </tr>

            <tr>
              <th scope="row">LALR(1)</th>
              <td className="classification">
                {formatClassification(classification, "lalr1", "LALR(1)")}
              </td>
              <td>
                Automaton,
                Parsing table
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Parsing;
