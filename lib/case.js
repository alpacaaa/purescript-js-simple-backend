
const compilePattern = compileExpr => ([match, body]) => {
  const match_ = match
  .map(compileExpr)
  .join(', ')

  return [match_, compileExpr(body)]
}


const wrapInSwitch = (test, patterns) => {
  return `switch (${test}) {
${patterns.map(wrapInCase).join("\n")}
  }`
}

const wrapInCase = ([match, body]) => {
  return `case ${match}:
    return ${body}
`
}

module.exports = ({ compileExpr, id }) => ([test, patterns]) => {
  const test_ = test
  .map(compileExpr(id))
  .join(', ')

  const patterns_ = patterns
  .map(compilePattern(compileExpr(id)))
  .map(wrapInCase)

  return wrapInSwitch(test_, patterns_)
}
