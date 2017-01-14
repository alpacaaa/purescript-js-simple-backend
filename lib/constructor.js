

module.exports = ({ compileExpr, id }) => ([type, ctor, values]) => {
  const data = {
    ctor: type + '_' + ctor,
  }

  const vmap = values.reduce((acc, v) => {
    return Object.assign({}, acc, { [v]: null })
  }, [])

  return Object.assign({}, data, vmap)
}
