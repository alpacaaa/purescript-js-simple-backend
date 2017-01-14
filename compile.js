
const fs = require('fs')

const clean = s => s.replace(/\./g, '_')

const identifier = moduleName => id => {
  return [moduleName, id].map(clean).join('_')
}

const compileModule = (name, module) => {
  const idGenerator = identifier(name)

  return module.decls
  .map(compileDeclGroup(idGenerator))
  .join("\n\n")
}

const compileDeclGroup = id => group => {
  return Object.keys(group)
  .map(key => {
    const name = id(key)
    return name + ' = ' + compileExpr(id)(group[key])
  })
  .join("\n")
}

const compileExpr = id => expr => {
  const [type, ...rest] = expr
  const compiler = compilerForExpr(type)
  const context = { id, compileExpr, }
  return compiler(context)(rest)
}

const compilerForExpr = type => {
  if (compilers[type]) {
    return compilers[type]
  }

  console.log('wtf is ' + type)
  return () => () => ''
//  throw new Error(`Compiler for expression ${type} not available`)
}




const compilers = {
  Literal: require('./lib/literal'),
  Constructor: require('./lib/constructor'),
  Accessor: require('./lib/accessor'),
  Abs: require('./lib/abs'),
}


const dump = JSON.parse(fs.readFileSync('test.json'))

console.log(compileModule('Something', dump.Something))
