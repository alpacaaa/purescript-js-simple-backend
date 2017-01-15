

const binder = type => ctx => expr => {
  if (type === 'VarBinder') return expr[0]
  if (type === 'NullBinder') return 'null'

  if (type === 'NamedBinder') {
    const value = binder(expr[1])(ctx)(expr.slice(2))
    return `let ${expr[0]} = ${value}`
  }

  if (type === 'LiteralBinder') {
    const literal = ['Literal', expr[0]]
    return ctx.compileExpr(ctx.id)(literal)
  }


  return 'wtf'
}

module.exports = binder
