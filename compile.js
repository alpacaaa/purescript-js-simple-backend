
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
  return compiler(id)(rest)
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
  Literal: id => ([literal]) => {
    const [type, fields] = literal

    if (type === 'ObjectLiteral') {
      const obj = Object.keys(fields)
      .map(k => {
        return k + ': ' + compileExpr(id)(fields[k]) + ','
      })
      .join("\n")

      return ['{', obj, '}'].join("\n")
    }

    if (type === 'ArrayLiteral') {
      const arr = fields
      .map(compileExpr(id))
      .join(", ")

      return ['[', arr, ']'].join("\n")
    }

    if (type === 'IntLiteral') {
      return fields
    }
  }
}


const dump = JSON.parse(fs.readFileSync('test.json'))

console.log(compileModule('Something', dump.Something))
