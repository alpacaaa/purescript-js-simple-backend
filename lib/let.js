

const letBinding = ({ compileExpr, id }) => obj => {
  return Object.keys(obj)
  .map(name => {
    const expr = obj[name]
    return 'let ' + id(name) + ' = ' + compileExpr(id)(expr)
  })
}

const wrapInLambda = body => {
  return `(function(){ return ${body} })()`
}

module.exports = ctx => values => {
  const bindings = values.slice(0, -1)
  const body = values.slice(-1)[0]

  const vars = bindings
  .map(arr => arr.map(letBinding(ctx)).join("\n"))

  return wrapInLambda(
    vars + "\n" + ctx.compileExpr(ctx.id)(body)
  )
}
