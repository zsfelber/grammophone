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
  if (symbols.length > 1) {
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


// const END = require('./grammar/symbols').END;
//
// export function listSymbols(set, order) {
//   let result = [];
//
//   for (let i = 0; i < order.length; i++) {
//     if (set[order[i]]) {
//       result.push(order[i]);
//     }
//   }
//
//   if (set[END]) {
//     result.push(END);
//   }
//
//   return result;
// }
//
// export function prettifySymbol(symbol) {
//   return symbol.replace(/'/g, "&prime;");
// }
//
// export function formatSymbol(symbol, info) {
//   if (symbol === END) {
//     return "<u>$</u>";
//   } else if (info.nonterminals[symbol]) {
//     return "<i>" + prettifySymbol(escapeHTML(symbol)) + "</i>";
//   } else if (info.terminals[symbol]) {
//     return "<b>" + prettifySymbol(escapeHTML(symbol)) + "</b>";
//   } else {
//     throw new Error("Unknown symbol: " + symbol);
//   }
// }
//
// export function bareFormatSymbol(symbol, info) {
//   if (symbol === END) {
//     return "$";
//   } else if (info.nonterminals[symbol] || info.terminals[symbol]) {
//     return prettifySymbol(escapeHTML(symbol));
//   } else {
//     throw new Error("Unknown symbol: " + symbol);
//   }
// }
//
// export function formatSymbols(symbols, info) {
//   let result = [];
//
//   for (let i = 0; i < symbols.length; i++) {
//     result[i] = formatSymbol(symbols[i], info);
//   }
//
//   return result;
// }
//
// export function bareFormatSymbols(symbols, info) {
//   let result = [];
//
//   for (let i = 0; i < symbols.length; i++) {
//     result[i] = bareFormatSymbol(symbols[i], info);
//   }
//
//   return result;
// }
//
// export function formatProduction(production, info) {
//   let result = "";
//
//   result += formatSymbol(production[0], info);
//   result += " &rarr; ";
//
//   if (production.length > 1) {
//     result += formatSymbols(production.slice(1), info).join(" ");
//   } else {
//     result += "<u>&epsilon;</u>";
//   }
//
//   return result;
// }
//
// export function formatSentence(strings) {
//   if (strings.length === 0) {
//     return "";
//   } else if (strings.length === 1) {
//     return strings[0];
//   } else if (strings.length === 2) {
//     return strings.join(" and ");
//   } else {
//     return strings.slice(0, -1).concat("and " + strings[strings.length - 1]).join(", ");
//   }
// }
//
// export function formatItem(item, start, productions, info) {
//   let production;
//
//   if (item.production === -1) {
//
//     if (item.index === 0) {
//       production = "&bull; " + Helpers.formatSymbol(start, info);
//     } else {
//       production = Helpers.formatSymbol(start, info) + " &bull;";
//     }
//
//   } else {
//
//     let symbols = Helpers.formatSymbols(productions[item.production].slice(1), info);
//     symbols.splice(item.index, 0, "&bull;");
//
//     production = Helpers.formatSymbol(productions[item.production][0], info) + " &rarr; " + symbols.join(" ");
//
//   }
//
//   if (item.lookaheads) {
//     return "[" + production + ", " + Helpers.formatSymbols(item.lookaheads, info).join(" / ") + "]";
//   } else if (item.lookahead) {
//     return "[" + production + ", " + Helpers.formatSymbol(item.lookahead, info) + "]";
//   } else {
//     return production;
//   }
// }
//
// function bareFormatItem(item, start, productions, info) {
//   let production;
//
//   if (item.production === -1) {
//     if (item.index === 0) {
//       production = "&bull; " + Helpers.bareFormatSymbol(start, info);
//     } else {
//       production = Helpers.bareFormatSymbol(start, info) + " &bull;";
//     }
//   } else {
//     let symbols = Helpers.bareFormatSymbols(productions[item.production].slice(1), info);
//     symbols.splice(item.index, 0, "&bull;");
//
//     production = Helpers.bareFormatSymbol(productions[item.production][0], info) + " &rarr; " + symbols.join(" ");
//   }
//
//   if (item.lookaheads) {
//     return "[" + production + ", " + Helpers.bareFormatSymbols(item.lookaheads, info).join(" / ") + "]";
//   } else if (item.lookahead) {
//     return "[" + production + ", " + Helpers.bareFormatSymbol(item.lookahead, info) + "]";
//   } else {
//     return production;
//   }
// }
//
// const TRANSFORMATION_FORMATTERS = {
//   expand: function(transformation, productions, info) {
//     /* jshint unused: false */
//     return "Expand Nonterminal";
//   },
//
//   removeImmediateLeftRecursion: function(transformation, productions, info) {
//     /* jshint unused: false */
//     return "Remove Immediate Left Recursion";
//
//   },
//
//   leftFactor: function(transformation, productions, info) {
//     /* jshint unused: false */
//     return "Left Factor " +
//       bareFormatSymbols(productions[transformation.production].slice(1, transformation.length + 1), info).join(" ");
//   },
//
//   epsilonSeparate: function(transformation, productions, info) {
//     /* jshint unused: false */
//     return "Epsilon-Separate";
//   },
//
//   removeUnreachable: function(transformation, productions, info) {
//     /* jshint unused: false */
//     return "Remove Unreachable Nonterminal";
//   }
// };
//
// export function formatTransformation(transformation, productions, info) {
//   return TRANSFORMATION_FORMATTERS[transformation.name](transformation, productions, info) || transformation.name;
// }
//
// export function repeatString(string, times) {
//   let result = "";
//
//   for (let i = 0; i < times; i++) {
//     result += string;
//   }
//
//   return result;
// }
//
// // From Prototype
//
// export function escapeHTML(string) {
//   return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
// }
