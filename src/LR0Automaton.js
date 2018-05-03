import React, { Component } from 'react';
import Graph from './Graph';
import { escapeHTML, plainFormatItem } from './helpers';

class LR0Automaton extends Component {
  render() {
    const automaton = this.props.grammar.calculate('parsing.lr.lr0_automaton');
    
    const nodes = automaton.reduce((result, state, index) => {
      const items = state.items.map(item => plainFormatItem(item, this.props.grammar));
      
      result += `s${index} [label="${index} | ${items.join('\\n')}"];\n`;
      return result;
    }, '');
    
    const edges = automaton.reduce((result, state, index) => {
      for (let s in state.transitions) {
        result += `s${index} -> s${state.transitions[s]} [label="${escapeHTML(s)}"];\n`;
      }
      return result;
    }, '');
    
    const graph = `digraph {
graph [rankdir=LR];
node [shape=record];
${nodes}
${edges}
}`; 
    
    return (
      <div>
        <Graph src={graph}/>
      </div>
    );
  }
}

export default LR0Automaton;
