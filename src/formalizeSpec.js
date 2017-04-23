import R from 'ramda'

import builtIns from './specs'

/**
 * formalizeSpec
 * turn an informal spec into a formal spec
 *
 * an informal spec can take one of three forms:
 *
 * - a formal spec (an array)
 * - a string (a reference to another spec)
 * - a function (a predicate function)
 */

const formalizeSpec = R.curry((specs, spec) => {
  if (!spec) throw Error('spec is required')

  if (R.is(Array, spec)) {
    return spec
  }

  if (R.is(String, spec)) {
    const resolvedSpec = {...builtIns, ...specs}[spec]
    if (!resolvedSpec) throw Error(`failed to resolve "${spec}"`)
    return formalizeSpec(specs, resolvedSpec)
  }

  if (R.is(Function, spec)) {
    return ['predicate', spec]
  }

  throw Error(`unrecognized spec type (spec is ${R.tryCatch(JSON.stringify, R.identity)(spec)})`)
})

export default formalizeSpec

