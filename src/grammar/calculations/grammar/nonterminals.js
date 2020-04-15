'use strict';

module.exports["grammar.nonterminals"] = function(grammar) {

  console.log("grammar.nonterminals");

  const productions = grammar.calculate("grammar.productions");

  let nonterminals = {};

  for (let i = 0; i < productions.length; i++) {
    nonterminals[productions[i][0]] = true;
  }

  return nonterminals;

};
