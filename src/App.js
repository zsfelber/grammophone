import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import Grammar from './grammar';
import Analysis from './Analysis';
import Sentences from './Sentences';
import LL1Table from './LL1Table';
import LR0Table from './LR0Table';
import LR0Automaton from './LR0Automaton';
import './App.css';

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
  
  handleChange(event) {
    let src = event.target.value;
    let grammar;
    let error;
    
    try {
      grammar = Grammar.parse(src);
    } catch (e) {
      error = e;
    }
    
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
        </Switch>
      );
    }
    
    return (
      <Router>
        <div>
          <h1>Editor</h1>
      
          <textarea className="editor" value={this.state.src} onChange={this.handleChange} />
      
          <hr />
      
          <p>
            <Breadcrumb path="/" title="Analysis" />
            <Breadcrumb path="/sentences" title="Example Sentences" />
            <Breadcrumb path="/ll1-table" title="LL(1) Parsing Table" />
            <Breadcrumb path="/lr0-table" title="LR(0) Parsing Table" />
            <Breadcrumb path="/lr0-automaton" title="LR(0) Automaton" />
          </p>
      
          {detail}
          
        </div>
      </Router>
    );
  }
}

export default App;
