import React, { Component } from 'react';
import { formatSymbol, formatTransformation } from '../helpers';

class Transform extends Component {
  constructor(props) {
    super(props);
    
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event) {
    const grammar = this.props.grammar;
    const transformations = grammar.calculate('transformations');
    
    let index = parseInt(event.target.value, 10);
    let transformation = transformations[index];
    let newGrammar = grammar.transform(transformation);
    
    this.props.onChange(newGrammar);
  }
  
  render() {
    const grammar = this.props.grammar;
    const transformations = grammar.calculate('transformations');
    const productions = grammar.calculate('grammar.productions');
    
    let transformationsByProductionAndSymbol = [];

    for (let i = 0; i < productions.length; i++) {
      transformationsByProductionAndSymbol[i] = [];
      for (let j = 0; j < productions[i].length; j++) {
        transformationsByProductionAndSymbol[i][j] = [];
      }
    }

    for (let i = 0; i < transformations.length; i++) {
      let transformation = transformations[i];
      transformationsByProductionAndSymbol[transformation.production][transformation.symbol].push({
        index: i,
        transformation
      });
    }
    
    let rows = [];
    
    productions.forEach((production, i) => {
      let symbols = [];
      
      production.forEach((symbol, j) => {
        if (transformationsByProductionAndSymbol[i][j].length > 0) {
          const options = transformationsByProductionAndSymbol[i][j].map(t => {
            return (
              <option value={t.index} key={`transformation-${t.index}`}>
                {formatTransformation(t.transformation, grammar)}
              </option>
            );
          });
          
          symbols.push(
            <span className="pill" key={`symbol-${j}`}>
              {formatSymbol(symbol, grammar)}
              <select onChange={this.handleChange} value="symbol">
                <option disabled value="symbol" key="symbol">{symbol}</option>
                {options}
              </select>
            </span>
          );
        } else {
          symbols.push(formatSymbol(symbol, grammar, `symbol-${j}`));
        }
        
        if (j === 0) {
          symbols.push(<React.Fragment key={`symbol-${j}-arrow`}> → </React.Fragment>);
        } else if (j < production.length - 1) {
          symbols.push(<React.Fragment key={`symbol-${j}-space`}> </React.Fragment>);
        }
      });
      
      if (production.length === 1) {
        symbols.push(<u key={`epsilon`}>ε</u>);
      }
      
      rows.push(<tr key={`production-${i}`}><td>{symbols}</td></tr>);
    });
    
    return (
      <section id="transform">
        <article>
          <table className="symbols productions">
            <tbody>
              {rows}
            </tbody>
          </table>
        </article>
      </section>
    );
  }
}

export default Transform;
