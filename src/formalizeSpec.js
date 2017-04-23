import R from 'ramda'

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

const formalizeSpec = (spec) => {
  if (R.is(Array, spec)) {
    return spec
  }

  if (R.is(String, spec)) {
    return ['ref', spec]
  }

  if (R.is(Function, spec)) {
    return ['predicate', spec]
  }

  throw Error(`unrecognized spec type (spec is ${R.tryCatch(JSON.stringify, R.identity)(spec)})`)
}

export default formalizeSpec

