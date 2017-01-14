

module.exports = ({ compileExpr, id }) => ([name, expr]) => {
  const body = compileExpr(id)(expr)
  return 'function(' + name + ") {\n" + body + "\n}"
}
