

const wrap = s => `(${s})`

module.exports = ({ compileExpr, id }) => ([name]) => {
  return id(name)
}
