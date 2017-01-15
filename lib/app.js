

const wrap = s => `(${s})`

module.exports = ({ compileExpr, id }) => ([fn, args]) => {
  return wrap(compileExpr(id)(fn)) +
    wrap(compileExpr(id)(args))
}
