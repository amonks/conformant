import R from 'ramda'

import getPredicate from './predicate'
import checkArgs from './checkArgs'

/**
 * ## conformant.check
 *
 * conformant.check takes three arguments, which
 * may be passed separately:
 *
 * - specs
 * - spec
 * - value
 *
 * it returns true or false
 */

const check = R.curry((specs, spec, value) => {
  const errors = checkArgs(specs, spec, value)
  if (errors) throw Error(errors)
  const predicate = getPredicate(specs, spec)
  const result = predicate(value)

  if (result === true) return true
  if (result === false) return false

  throw Error(`Predicate must return true or false, but it returned "${result}". Predicate name is "${predicate.name}". Spec is "${spec}". Value is "${value}"`)
})

export default check

