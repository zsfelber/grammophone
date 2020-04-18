'use strict';

const Calculations = require('./calculations');
const Parser = require('./parser');
const END = require('./symbols').END;

class ProductionsProcessor {
  constructor() {
    this.cache = {};
    this.generatedRules = [];
  }

  generateName() {
    let grule = this.cache[this.currentRule];
    if (!grule) this.cache[this.currentRule] = grule = { cnt: 0 };
    let gname = this.currentRule + "_" + (grule.cnt++);
    return { gname };
  }

  extractChoice(choiceNode, name) {
    let parentrule = this.currentRule;
    this.currentRule = name;
    let choice = this.extract(choiceNode);
    var r;
    if (choice.length > 0) {
      r = choice.map(c => [name].concat(c));
    } else {
      r = [[name]];
    }
    this.currentRule = parentrule;
    return r;
  }

  mayGenerateMulRule(name, mul) {
    var gname = null;
    switch (mul) {
      case '+':
        var { gname: _gname } = this.generateName();
        gname = _gname;
        this.generatedRules.push([gname, name]);
        break;
      case '*':
      case '?':
        var { gname: _gname } = this.generateName();
        gname = _gname;
        this.generatedRules.push([gname]);
        break;
    }
    switch (mul) {
      case '+':
      case '*':
        this.generatedRules.push([gname, gname, name]);
        return { gname: gname };
      case '?':
        this.generatedRules.push([gname, name]);
        return { gname: gname };
      default:
        return { gname: name };
    }
  }

  generateParenRule(node) {
    var { gname } = this.generateName();
    var r = this.extractChoice(node.expression, gname);
    var { gname: _gname } = this.mayGenerateMulRule(gname, node.mul);
    this.generatedRules = this.generatedRules.concat(r);
    gname = _gname;
    return { gname };
  }

  extract(node) {
    var r;

    switch (node.type) {
      case 'grammar':
        r = node.rules.reduce((list, r) => list.concat(this.extract(r)), []);
        return r;
      case 'rule':
        r = this.extractChoice(node.choice, node.name);
        return r;
      case 'choice':
        r = node.alternatives.map(a => this.extract(a));
        return r;
      case 'sequence':
        r = node.elements.reduce((list, e) => list.concat(this.extract(e)), []);
        return r;
      case 'symbol':
        var { gname } = this.mayGenerateMulRule(node.name, node.mul);
        r = [gname];
        return r;
      case 'epsilon':
        r = [];
        return r;
      case 'parenexp':
        var { gname } = this.generateParenRule(node);
        r = [gname];
        return r;
      default:
        throw new Error("Unknown node type : "+node.type);
      }
  }

  /**
   * Entry point
   * @param {*} node 
   */
  process(node) {
    var r = this.extract(node);
    r = r.concat(this.generatedRules);
    return r;
  }

}

class Grammar {

  static parse(spec) {
    var result = null, productions = null;
    try {
      console.log("grammar.parse")
      result = Parser.parse(spec);
      productions = new ProductionsProcessor().process(result);
      return { grammar: new Grammar(productions), spec: spec };
    } catch (e) {
      console.error("Error:", e, "  spec:", spec, "  result:", result, "  productions:", productions);
      return { error: e, spec: spec };
    }
  }

  constructor(productions) {

    theGrammar = this;

    // Check for reserved and empty symbols

    for (let i = 0; i < productions.length; i++) {
      for (let j = 0; j < productions[i].length; j++) {

        if (productions[i][j].match(/^Grammar\./)) {
          throw new Error("Reserved symbol " + productions[i][j] + " may not be part of a production");
        }

        if (productions[i][j] === "") {
          throw new Error("An empty symbol may not be part of a production");
        }

      }
    }

    // Assign productions

    this.productions = productions;

    // Initialize calculations memoization

    this.calculations = {};

  }

  calculate(name) {

    if (typeof Calculations[name] === "undefined") {
      throw new Error("Undefined grammar calculation " + name);
    }

    if (typeof this.calculations[name] === "undefined") {
      var oldind = "";
      if (!this.hasOwnProperty("indent")) {
        this.indent = "";
      }
      try {
        console.log(this.indent+"New calculation : "+name);
        oldind = this.indent;

        this.indent += "  ";
        var t0 = new Date().getTime();
  
        this.calculations[name] = Calculations[name](this);

        this.indent = oldind;

        var dt = Math.round((new Date().getTime() - t0)/100);
        console.log(this.indent+"Finished : "+name+"  in "+(dt/10)+"s");
      } catch (e) {
        throw e;
      } finally {
        this.indent = oldind;
      }
    }

    return this.calculations[name];

  }

  transform(transformation) {

    let productions = this.productions.slice();

    transformation.changes.forEach(function (change) {

      if (change.operation === "delete") {
        productions.splice(change.index, 1);
      } else if (change.operation === "insert") {
        productions.splice(change.index, 0, change.production);
      }

    });

    return new Grammar(productions);

  }

  getFirst(symbols) {

    let first = this.calculate("grammar.first");
    let nullable = this.calculate("grammar.nullable");
    let terminals = this.calculate("grammar.terminals");
    let nonterminals = this.calculate("grammar.nonterminals");

    let result = {};

    for (let i = 0; i < symbols.length; i++) {

      let s = symbols[i];

      if (s === END) {

        result[s] = true;
        break;

      } else if (terminals[s]) {

        result[s] = true;
        break;

      } else if (nonterminals[s]) {

        for (let k in first[s]) {
          result[k] = true;
        }

        if (!nullable[s]) {
          break;
        }

      } else {

        throw new Error("Unexpected symbol " + s);

      }

    }

    return result;

  }

  isNullable(symbols) {

    let nullable = this.calculate("grammar.nullable");
    let terminals = this.calculate("grammar.terminals");
    let nonterminals = this.calculate("grammar.nonterminals");

    for (let i = 0; i < symbols.length; i++) {

      let s = symbols[i];

      if (nonterminals[s]) {

        if (!nullable[s]) {
          return false;
        }

      } else if (terminals[s]) {

        return false;

      } else {

        throw new Error("Unexpected symbol " + s);

      }

    }

    return true;

  }

  copyProductions() {

    let result = [];

    for (let i = 0; i < this.productions.length; i++) {
      result[i] = [];

      for (let j = 0; j < this.productions[i].length; j++) {
        result[i][j] = this.productions[i][j];
      }
    }

    return result;

  }

  toString() {

    let result = "";

    for (let i = 0; i < this.productions.length; i++) {

      result += this.productions[i][0];
      result += " ->";

      for (let j = 1; j < this.productions[i].length; j++) {
        result += " " + this.productions[i][j];
      }

      result += " .\n";

    }

    return result;

  }

}

// export

Grammar.END = END;

module.exports = Grammar;
