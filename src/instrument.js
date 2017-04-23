import R from 'ramda'

import conform from './conform'
import formalizeSpec from './formalizeSpec'

/**
 * ## conformant.instrument
 *
 * instrument takes three arguments:
 *
 * - specs
 * - spec -- must be a 'function' command spec
 * - function
 *
 * it returns a modified function that checks its
 * arguments, return value, and their relationshp
 * against the config provided in the spec, and
 * throws if they aren't satisfied.
 */

const instrument = R.curry((specs, spec, fn) => {
  const [command, config] = formalizeSpec(specs, spec)
  if (command !== `function`) throw Error(`instrument requires a function spec. got a "${command}"`)

  return (..._args) => {
    const args = conform(specs, config.args || 'p/any', _args)
    if (args === 'conform/invalid') throw Error('args are invalid')

    const ret = conform(specs, config.ret || 'p/any', fn(...args))
    if (ret === 'conform/invalid') throw Error('return value is invalid')

    const relationship = config.fn
    if (relationship) {
      if (!relationship(args, ret)) throw Error('relationship not satisfied')
    }

    return ret
  }
})

export default instrument

