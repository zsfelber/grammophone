import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import Grammar from './grammar';
import Analysis from './Analysis';
import Sentences from './Sentences';
import LL1Table from './LL1Table';
import LR0Table from './LR0Table';
import LR0Automaton from './LR0Automaton';
import LR1Table from './LR1Table';
import LR1Automaton from './LR1Automaton';
import SLR1Table from './SLR1Table';
import LALR1Table from './LALR1Table';
import LALR1Automaton from './LALR1Automaton';
import Master from './Master';

import './App.css';
import './styles/application.css';
import './styles/analysis.css';
import './styles/edit.css';
import './styles/transform.css';
import './styles/views/blank_slate.css';
import './styles/views/ll1_table.css';
import './styles/views/lr0_table.css';
import './styles/views/lr1_table.css';
import './styles/views/parsing.css';

const Breadcrumb = ({ path, title, isRoot }) => {
  return (
    <Route path={path} render={props => (
      <React.Fragment>
        {path === "/" ? "" : " / "}
        <NavLink exact to={path}>{title}</NavLink>
      </React.Fragment>
    )} />
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    
    let src = `S -> a S b
S ->`;
    let grammar = Grammar.parse(src);
    
    this.state = { src, grammar };
    
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange({ src, grammar, error }) {
    this.setState({ src, grammar, error });
  }
  
  render() {
    let detail;
    
    if (this.state.error) {
      detail = (
        <p>{this.state.error.message}</p>
      );
    } else {
      detail = (
        <Switch>
          <Route exact path="/" render={props => (<Analysis {...props} grammar={this.state.grammar} />)} />
          <Route path="/sentences" render={props => (<Sentences {...props} grammar={this.state.grammar} />)} />
          <Route path="/ll1-table" render={props => (<LL1Table {...props} grammar={this.state.grammar} />)} />
          <Route path="/lr0-table" render={props => (<LR0Table {...props} grammar={this.state.grammar} />)} />
          <Route path="/lr0-automaton" render={props => (<LR0Automaton {...props} grammar={this.state.grammar} />)} />
          <Route path="/lr1-table" render={props => (<LR1Table {...props} grammar={this.state.grammar} />)} />
          <Route path="/lr1-automaton" render={props => (<LR1Automaton {...props} grammar={this.state.grammar} />)} />
          <Route path="/slr1-table" render={props => (<SLR1Table {...props} grammar={this.state.grammar} />)} />
          <Route path="/lalr1-table" render={props => (<LALR1Table {...props} grammar={this.state.grammar} />)} />
          <Route path="/lalr1-automaton" render={props => (<LALR1Automaton {...props} grammar={this.state.grammar} />)} />
        </Switch>
      );
    }
    
    return (
      <Router>
        <div>
          <Master src={this.state.src} grammar={this.state.grammar} onChange={this.handleChange} />

          <section id="analysis">
      
            <header className="header">
              <nav>
                <Breadcrumb path="/" title="Analysis" />
                <Breadcrumb path="/sentences" title="Example Sentences" />
                <Breadcrumb path="/ll1-table" title="LL(1) Parsing Table" />
                <Breadcrumb path="/lr0-table" title="LR(0) Parsing Table" />
                <Breadcrumb path="/lr0-automaton" title="LR(0) Automaton" />
                <Breadcrumb path="/lr1-table" title="LR(1) Parsing Table" />
                <Breadcrumb path="/lr1-automaton" title="LR(1) Automaton" />
                <Breadcrumb path="/slr1-table" title="SLR(1) Parsing Table" />
                <Breadcrumb path="/lalr1-table" title="LALR(1) Parsing Table" />
                <Breadcrumb path="/lalr1-automaton" title="LALR(1) Automaton" />
              </nav>
            </header>
      
            {detail}
          
          </section>
          
        </div>
      </Router>
    );
  }
}

export default App;
