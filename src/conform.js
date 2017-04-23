import R from 'ramda'
import check from './check'

/**
 * ## conformant.conform
 *
 * takes three arguments:
 * - specs
 * - spec
 * - value
 * and returns either the value, if it satisfies
 * the spec, or the string "conform/invalid"
 */

const conform = R.curry((specs, spec, value) => {
  const isValid = check(specs, spec, value)
  if (!isValid) return 'conform/invalid'
  return value
})

export default conform

