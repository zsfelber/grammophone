import React, { Component } from 'react';
import Sets from '../grammar/sets';
import { formatProduction, formatPath, formatSentence, formatProductionSet, formatNonterminalSet } from '../helpers';

function Unreachable(props) {
  const unreachable = props.grammar.calculate('grammar.unreachable');
  
  if (Sets.any(unreachable)) {
    return <React.Fragment>The grammar has unreachable nonterminals: {formatProductionSet(unreachable, props.grammar)}.</React.Fragment>;
  } else {
    return <React.Fragment>All nonterminals are reachable.</React.Fragment>;
  }
}

function Unrealizable(props) {
  const unrealizable = props.grammar.calculate('grammar.unrealizable');
  
  if (Sets.any(unrealizable)) {
    return <React.Fragment>The grammar has unrealizable nonterminals: {formatNonterminalSet(unrealizable, props.grammar)}.</React.Fragment>;
  } else {
    return <React.Fragment>All nonterminals are realizable.</React.Fragment>;
  }
}

function Cyclic(props) {
  const cycle = props.grammar.calculate('grammar.cycle');
  
  if (typeof cycle !== 'undefined') {
    return <React.Fragment>The grammar is cyclic: {formatPath(cycle, props.grammar)} is a cycle.</React.Fragment>;
  } else {
    return <React.Fragment>The grammar contains no cycles.</React.Fragment>;
  }
}

function NullAmbiguity(props) {
  const productions = props.grammar.calculate('grammar.productions');
  const nullAmbiguity = props.grammar.calculate('grammar.nullAmbiguity');
  
  if (nullAmbiguity.length > 0) {
    const first = formatProduction(productions[nullAmbiguity[0]], props.grammar);
    const second = formatProduction(productions[nullAmbiguity[1]], props.grammar);
    
    return <React.Fragment>The grammar contains a null ambiguity: {first} and {second} are ambiguously nullable.</React.Fragment>;
  } else {
    return <React.Fragment>The grammar is null unambiguous.</React.Fragment>;
  }
}

function Ambiguous(props) {
  const ambiguous = props.grammar.calculate('grammar.ambiguous');
  
  if (typeof ambiguous !== 'undefined') {
    return <React.Fragment>The grammar is ambiguous: the sentence {formatSentence(ambiguous, props.grammar)} is ambiguous.</React.Fragment>;
  } else {
    return <React.Fragment>No ambiguous sentences were found.</React.Fragment>;
  }
}

class Sanity extends Component {
  render() {
    return (
      <ul className="symbols">
        <li><Unreachable grammar={this.props.grammar} /></li>
        <li><Unrealizable grammar={this.props.grammar} /></li>
        <li><Cyclic grammar={this.props.grammar} /></li>
        <li><NullAmbiguity grammar={this.props.grammar} /></li>
        <li><Ambiguous grammar={this.props.grammar} /></li>
      </ul>
    );
  }
}

export default Sanity;
