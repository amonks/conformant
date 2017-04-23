import R from 'ramda'

import resolveRef from './resolveRef'

/**
 * ## commands
 *
 * Some commands are built into check. You may not define your own commands.
 *
 * commands are passed an object with:
 * - args
 * - check
 * - specs
 */

const commands = {
  // basics

  /**
   * - predicate
   */
  predicate: ({args: [fn]}) => v => {
    if (!R.is(Function, fn)) throw Error(`predicate must be a function. Got ${fn}`)
    return fn(v)
  },

  /**
   * - ref
   */
  ref: ({args: [ref], specs, check}) => v => {
    const spec = resolveRef(specs, ref)
    if (!spec) throw Error(`could not resolve reference "${ref}"`)
    return check(specs, spec, v)
  },

  // logic

  /**
   * - or
   */
  or: ({args, specs, check}) => v => {
    if (args.length === 0) throw Error('no specs provided to "or"')
    return R.any(spec => check(specs, spec, v), args)
  },

  /**
   * - and
   */
  and: ({args, specs, check}) => v => {
    if (args.length === 0) throw Error('no specs provided to "and"')
    return R.all(spec => check(specs, spec, v), args)
  },

  // maps

  /**
   * - keys
   */
  keys: ({args: keys, specs, check}) => v => {
    if (keys.length === 0) throw Error('no keys provided to "keys"')
    if (!R.is(Object, v)) throw Error(`value used with "keys" spec must be an object`)
    return R.all(key => check(specs, key, v[key]), keys)
  },

  /**
   * - every
   */
  every: ({args, specs, check}) => v => {
    const [spec] = args
    if (spec === undefined) throw Error('no spec provided to "every"')
    if (args.length > 1) throw Error(`too many specs provided to "every". got ${args}`)

    const c = v => check(specs, spec, v)
    if (R.is(Object, v)) {
      return R.all(c, Object.values(v))
    }
    if (R.is(Array, v)) {
      return R.all(c, v)
    }
    throw Error(`"every" spec must be used with a collection (object or array). Got ${v}.`)
  }
}

export default commands

