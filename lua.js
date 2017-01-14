'use strict';

// https://github.com/paf31/24-days-of-purescript-2016/blob/master/22.markdown

var fs = require('fs');

if (process.argv.length !== 3) {
    console.error('usage: node lua.js output/<module>/corefn.json');
} else {
    var dump = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
    for (var moduleName in dump) {
        console.log('-- ' + moduleName);
        console.log(compileModule(moduleName, dump[moduleName]));
    }
}

function compileModule(moduleName, module) {
    moduleName = moduleName.replace(/\./g, '_');
    return module.decls.reduce(function(acc, declGroup) {
        return acc + compileDeclGroup(moduleName, declGroup);
    }, '');
}

function compileDeclGroup(moduleName, declGroup) {
    var result = '';
    for (var declName in declGroup) {
        var fullDeclName = moduleName + '_' + declName;
        result += fullDeclName + ' = ' + compileExpr(declGroup[declName]) + '\n';
    }
    return result;
}

function compileExpr(expr) {
    switch (expr[0]) {
    case 'Literal':
        return compileLiteral(expr[1]);
    case 'Var':
        return expr[1].replace(/\./g, '_');
    case 'Abs':
        return 'function(' + expr[1] + ')\n' + indent('return ' + compileExpr(expr[2])) + '\nend';
    case 'App':
        return '(' + compileExpr(expr[1]) + ')(' + compileExpr(expr[2]) + ')'
    case 'Accessor':
        return '(' + compileExpr(expr[2]) + ').' + expr[1];
    default:
        throw Error('not yet implemented: ' + expr[0]);
    }
}

function compileLiteral(literal) {
    switch (literal[0]) {
    case 'ObjectLiteral':
        var result = '{\n';
        for (var field in literal[1]) {
            result += indent(field + ' = ' + compileExpr(literal[1][field]) + ',') + '\n';
        }
        return result += '}';
    case 'ArrayLiteral':
        var result = '{\n';
        literal[1].forEach(function(element) {
            result += indent(compileExpr(element) + ',') + '\n';
        });
        return result += '}';
    default:
        throw Error('not yet implemented: ' + literal[0])
    }
}

function indent(t) {
    return t.split('\n').map(function(l) { return '   ' + l; }).join('\n');
}
