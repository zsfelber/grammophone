'use strict';

module.exports["grammar.start"] = function(grammar) {

  console.log("grammar.start");
  const productions = grammar.calculate("grammar.productions");

  return productions[0][0];

};
