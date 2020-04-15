'use strict';

const Calculations = require('./calculations');
const Parser = require('./parser');
const END = require('./symbols').END;

function generateName(node, gen) {
  let grule = gen.cache[gen.current_rule];
  if (!grule) gen.cache[gen.current_rule] = grule = {cnt:0};
  let gname = gen.current_rule+"_"+(grule.cnt++);
  return {gname};
}

function generateMulRule(node, gen) {
  var gname = null;
  switch (node.mul) {
	case '+':
		{gname} = generateName(node, gen);
		gen.rules.push([[gname, node.name]]);
		break;
	case '*':
	case '?':
		{gname} = generateName(node, gen);
		gen.rules.push([[gname]]);
		break;
  }
  switch (node.mul) {
	case '+':
	case '*':
	case '?':
		gen.rules.push([[gname, gname, node.name]]);
		return {gname:gname};
	default:
		return {gname:node.name};
  }
}

function generateParenRule(node, gen) {
	var {gname} = generateName(node, gen);
	let genrulenode = {
		type:"rule",
		name:gname,
        choice: node.expression,
        location: node.location,
		mul: node.mul
	};
	gen.rules.push(flattenNode(genrulenode, gen));
	{gname} = generateMulRule(genrulenode, gen);
	return {gname};
}

function flattenNode(node, gen) {
  if (!gen) gen = {cache:{},rules:[]};
  var r;

  switch (node.type) {
  case 'grammar':
    r = node.rules.reduce((list, r) => list.concat(flattenNode(r, gen)), []);
	r = r.concat(gen.rules);
	return r;
  case 'rule':
    let parentrule = gen.current_rule;
	gen.current_rule = node.name;
    let choice = flattenNode(node.choice, gen);
    if (choice.length > 0) {
      r = choice.map(c => [node.name].concat(c));
    } else {
      r = [[node.name]];
    }
	gen.current_rule = parentrule;
	return r;
  case 'choice':
    return node.alternatives.map(a => flattenNode(a, gen));
  case 'sequence':
    return node.elements.reduce((list, e) => list.concat(flattenNode(e, gen)), []);
  case 'symbol':
	var {gname} = generateMulRule(node, gen);
    return [gname];
  case 'epsilon':
    return [];
  case 'parenexp':
	var {gname} = generateParenRule(node, gen);
    return [gname];
  }
}

class Grammar {

  static parse(spec) {
	var result=null, productions=null;
    try {
      result = Parser.parse(spec);
      productions = flattenNode(result);
      return { grammar: new Grammar(productions), spec: spec };
    } catch (e) {
	  console.error("Error:",e, "  spec:",spec, "  result:",result, "  productions:",productions);
      return { error: e, spec: spec };
    }
  }

  constructor(productions) {

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
      this.calculations[name] = Calculations[name](this);
    }

    return this.calculations[name];

  }

  transform(transformation) {

    let productions = this.productions.slice();

    transformation.changes.forEach(function(change) {

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
