import conform from './conform'
import commands from './commands'
import formalizeSpec from './formalizeSpec'

/**
 * checkFormalSpec
 * check whether a value conforms to a formal spec
 *
 * returns true or false
 */

const check = (specs, spec, value) => {
  const [command, ...args] = formalizeSpec(spec)
  const predicate = commands[command]({specs, args, conform, check})

  const result = predicate(value)

  if (result === true) return true
  if (result === false) return false

  throw Error(`Predicate must return true or false, but it returned "${result}". Predicate name is "${predicate.name}". Spec is "${spec}". Value is "${value}"`)
}

export default check

