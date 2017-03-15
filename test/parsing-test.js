'use strict';

const assert = require('assert');
const Grammar = require('../src/grammar/index');

function assertParseProductions(expected, spec) {
  let parse = Grammar.parse(spec);
  if (parse.error) {
    throw parse.error;
  }
  let actual = parse.grammar.productions;
  
  assert.deepEqual(expected, actual);
}

function assertParseError(spec) {
  let parse = Grammar.parse(spec);
  assert.ok(parse.error, `Expected parse error for spec: ${spec}`);
}

describe('Parsing', function() {
  it('should parse basic grammars', function() {
    assertParseProductions([["A", "a"]], "A -> a");
    assertParseProductions([["A", "a"], ["A", "b"]], "A -> a | b");
    assertParseProductions([["A"]], "A ->");
    assertParseProductions([["A", "a"], ["B", "b"], ["A", "c"]], "A -> a; B -> b; A -> c");
  });
  
  it('should accept end of line as the end of a rule', function() {
    assertParseProductions([["A", "a"], ["A", "b"], ["A", "c"]], "A -> a\nA -> b | c");
    assertParseProductions([["A", "a"], ["A", "b"], ["A", "c"], ["A"], ["B"]], `
A -> a |
b
A
->
c;A
->
B
->`
    );
  });
  
  it('should accept the colon character as a synonym for the arrow', function() {
    assertParseProductions([["A", "a"]], "A -> a");
    assertParseProductions([["A", "a"], ["A", "b"]], "A -> a | b");
  });
  
  it('should accept the full stop character as a synonym for the semicolon', function() {
    assertParseProductions([["A", "a"], ["B", "b"], ["A", "c"]], "A -> a. B -> b. A -> c.");
  });
  
  it('should accept symbols written as strings', function() {
    assertParseProductions([["A", "alpha"], ["A", "beta"]], `A -> "alpha" | 'beta'`);
  });
  
  it('should allow escaped characters in strings', function() {
    assertParseProductions([["A", "\"", "'", "\n"]], `A -> "\"" | '\'' | "\n"`);
  });
  
  it('should allow non-ascii characters to be used as symbols', function() {
    assertParseProductions([["A", "α"]], "A -> α");
    assertParseProductions([["🧀", "🥛"], ["🥛", "🐮"]], " 🧀 -> 🥛; 🥛 -> 🐮");
  });

  it('should parse variations in spacing', function() {
    assertParseProductions([["A", "a"]], "A->a");
    assertParseProductions([["A", "a"], ["A", "b"]], "A->a|b");
    assertParseProductions([["A"]], "A->");
  });
  
  it('should ignore single-line comments', function() {
    assertParseProductions([["A", "b"]], "// A -> a\nA -> b");
    assertParseProductions([], "// 123");
  });
  
  it('should ignore multiple-line comments and allow them to be nested', function() {
    assertParseProductions([["A", "b"]], '/* A -> a */ A -> b');
    assertParseProductions([["A", "b"]], '/* /* A -> a */ */ A -> b');
  });
  
  it('should accept an empty grammar', function() {
    assertParseProductions([], "");
    assertParseProductions([], "\n");
  });
  
  it('should allow the use of #epsilon to indicate the empty string', function() {
    assertParseProductions([["A"]], "A -> #epsilon");
    assertParseProductions([["A", "b"]], "A -> #epsilon b #epsilon #epsilon");
  });
  
  it('should interpret an actual epsilon character as a symbol', function() {
    assertParseProductions([["A", "ε"]], "A -> ε");
  });

  it('should correctly emit parse errors', function() {
    assertParseError("A -> a. B");
    assertParseError("A B -> a.");
    assertParseError("A -> a. ->");
    assertParseError("-> X");
    assertParseError("A");
    assertParseError("A.y -> a.");
    assertParseError("A -> x.y .");
  });
});
