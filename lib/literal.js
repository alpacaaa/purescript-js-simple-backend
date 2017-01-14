

module.exports = ({ id, compileExpr }) => ([literal]) => {
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

  if (
    type === 'IntLiteral'
    || type === 'NumberLiteral'
  ) {
    return fields
  }

  if (
    type === 'StringLiteral'
    || type === 'CharLiteral'
  ) {
    return '"' + fields + '"'
  }

  if (type === 'BooleanLiteral') {
    return fields ? 'true' : 'false'
  }
}
