
const compilePattern = compileExpr => ([match, body]) => {
  const match_ = match
  .map(compileExpr)
  .join(', ')

  return [match_, compileExpr(body)]
}


const wrapInSwitch = (test, patterns) => {
  return `switch (${test.join(', ')}) {
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

  const patterns_ = patterns
  .map(compilePattern(compileExpr(id)))

  return wrapInSwitch(test_, patterns_)
}
