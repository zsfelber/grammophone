import React from 'react';
import { END } from './grammar/symbols';

export function listSymbolSet(symbolSet, order) {
  let result = [];

  for (let i = 0; i < order.length; i++) {
    if (symbolSet[order[i]]) {
      result.push(order[i]);
    }
  }

  if (symbolSet[END]) {
    result.push(END);
  }

  return result;
}

export function formatSymbol(symbol, grammar, key) {
  const info = grammar.calculate('grammar.symbolInfo');
  
  if (symbol === END) {
    return <u key={key}>$</u>;
  } else if (info.nonterminals[symbol]) {
    return <i key={key}>{symbol}</i>;
  } else if (info.terminals[symbol]) {
    return <b key={key}>{symbol}</b>;
  } else {
    throw new Error("Unknown symbol: " + symbol);
  }
}

export function formatSymbols(symbols, grammar) {
  return symbols.map((s, i) => formatSymbol(s, grammar, `symbol-${i}`));
}

export function joinFormattedSymbols(joiner, symbols, grammar) {
  return formatSymbols(symbols, grammar).map((s, i) => {
    if (i === 0) {
      return <React.Fragment key={`formatted-symbol-${i}`}>{s}</React.Fragment>
    } else {
      return <React.Fragment key={`formatted-symbol-${i}`}>{joiner}{s}</React.Fragment>
    }
  });
}

export function formatSentence(symbols, grammar) {
  if (symbols.length > 0) {
    return joinFormattedSymbols(' ', symbols, grammar);
  } else {
    return [<u key="epsilon">ε</u>];
  }
}

export function formatPath(symbols, grammar) {
  return joinFormattedSymbols(' ⇒ ', symbols, grammar);
}

export function formatProduction(production, grammar) {
  const head = formatSymbol(production[0], grammar);
  const tail = formatSentence(production.slice(1), grammar);
  
  return <React.Fragment>{head} → {tail}</React.Fragment>;
}

export function formatProductionSet(symbolSet, grammar) {
  const info = grammar.calculate('grammar.symbolInfo');
  const ordered = listSymbolSet(symbolSet, info.productionOrder);
  
  return joinFormattedSymbols(', ', ordered, grammar);
}

export function formatNonterminalSet(symbolSet, grammar) {
  const info = grammar.calculate('grammar.symbolInfo');
  const ordered = listSymbolSet(symbolSet, info.nonterminalOrder);
  
  return joinFormattedSymbols(', ', ordered, grammar);
}

export function formatTerminalSet(symbolSet, grammar) {
  const info = grammar.calculate('grammar.symbolInfo');
  const ordered = listSymbolSet(symbolSet, info.terminalOrder);
  
  return joinFormattedSymbols(', ', ordered, grammar);
}

export function formatClassification(classifications, name, displayName) {
  if (classifications[name].member) {
    return <React.Fragment>The grammar is {displayName}.</React.Fragment>;
  } else {
    return <span className="conflict">Not {displayName} — {classifications[name].reason}.</span>;
  }
}

export function plainFormatSymbol(symbol) {
  if (symbol === END) {
    return '$';
  } else {
    return escapeHTML(symbol);
  }
}

export function plainFormatItem(item, grammar) {
  const start = grammar.calculate('grammar.start');
  const productions = grammar.calculate('grammar.productions');
  
  let production;

  if (item.production === -1) {
    if (item.index === 0) {
      production = "&bull; " + plainFormatSymbol(start);
    } else {
      production = plainFormatSymbol(start) + " &bull;";
    }
  } else {
    let symbols = productions[item.production].slice(1).map(plainFormatSymbol);
    symbols.splice(item.index, 0, "&bull;");

    production = plainFormatSymbol(productions[item.production][0]) + " &rarr; " + symbols.join(" ");
  }

  if (item.lookaheads) {
    return "[" + production + ", " + item.lookaheads.map(plainFormatSymbol).join(" / ") + "]";
  } else if (item.lookahead) {
    return "[" + production + ", " + plainFormatSymbol(item.lookahead) + "]";
  } else {
    return production;
  }
}

export function escapeHTML(string) {
  return string
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");
}

const TransformationFormatters = {
  expand(transformation, grammar) {
    /* jshint unused: false */
    return "Expand Nonterminal";
  },

  removeImmediateLeftRecursion(transformation, grammar) {
    /* jshint unused: false */
    return "Remove Immediate Left Recursion";
  },

  leftFactor(transformation, grammar) {
    /* jshint unused: false */
    const productions = grammar.calculate('grammar.productions');
    const symbols = productions[transformation.production].slice(1, transformation.length + 1);
    
    return "Left Factor " + symbols.map(plainFormatSymbol).join(' ');
  },

  epsilonSeparate(transformation, grammar) {
    /* jshint unused: false */
    return "Epsilon-Separate";
  },

  removeUnreachable(transformation, grammar) {
    /* jshint unused: false */
    return "Remove Unreachable Nonterminal";
  }
};

export function formatTransformation(transformation, grammar) {
  return TransformationFormatters[transformation.name](transformation, grammar) || transformation.name;
}
