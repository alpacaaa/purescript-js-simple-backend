

module.exports = ({ compileExpr, id }) => ([name, expr]) => {
  return '(' + compileExpr(id)(expr) + ').' + name
}
