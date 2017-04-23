import R from 'ramda'

/**
 * ## commands
 *
 * All specs can be resolved to a command, and all other specs can be
 * resolved to the 'predicate' command.
 *
 * A spec that uses a command is called a 'formal spec'. It is an array
 * containing the command followed by its arguments.
 *
 * Here are some examples of formal specs:
 *
 * ['predicate', value => value === 'Bob Zucchini']
 * ['keys', 'staleness', 'crustiness', 'yeast']
 *
 * commands are passed an object with:
 *
 * ### args
 * ### check
 * ### specs
 */

// a command is passed an object {
//   [...args],
//   check,
//   specs
// }, and returns a predicate function of one argument

const commands = {
  // basics

  /**
   * ### predicate
   *
   * Predicate takes one argument: a function.
   *
   * Here's an example predicate: `['predicate', v => v === true]`
   */

  predicate: ({args: [fn, ...extraArgs]}) => v => {
    if (extraArgs.length > 0) throw Error(`too many arguments for 'predicate' command`)
    if (!R.is(Function, fn)) throw Error(`predicate must be a function. Got ${fn}`)
    return fn(v)
  },

  /**
   * ### function
   *
   * A function spec takes one argument, a config object with
   * up to three keys:
   *
   * - args: a spec describing the arguments to the function
   * - ret: a spec describing the return value of the function
   * - fn: a predicate function passed ([...args], returnValue)
   *   describing the relationship between them
   *
   * None of those keys are checkable until apply-time, so function
   * specs are mostly useful with the provided `instrument` function,
   * rather than `check` and `conform`.
   */
  'function': ({args: [{args, ret, fn, ...extraConfig}, ...extraArgs]}) => v => {
    if (extraConfig.length > 0) throw Error(`bad config keys for 'function' command: "${extraConfig}"`)
    if (extraArgs.length > 0) throw Error(`too many arguments for 'function' command: "${extraArgs}"`)
    return R.is(Function, v)
  },

  // logic

  /**
   * ### or
   */
  or: ({args, specs, check}) => v => {
    if (args.length === 0) throw Error('no specs provided to "or"')
    return R.any(spec => check(specs, spec, v), args)
  },

  /**
   * ### and
   */
  and: ({args, specs, check}) => v => {
    if (args.length === 0) throw Error('no specs provided to "and"')
    return R.all(spec => check(specs, spec, v), args)
  },

  // maps

  /**
   * ### keys
   */
  keys: ({args: keys, specs, check}) => v => {
    if (keys.length === 0) throw Error('no keys provided to "keys"')
    if (!R.is(Object, v)) throw Error(`value used with "keys" spec must be an object. got ${v}`)
    return R.all(key => check(specs, key, v[key]), keys)
  },

  // collections

  /**
   * ### tuple
   */
  tuple: ({args, specs, check}) => (v) => {
    if (args.length === 0) throw Error('bad spec: tuple length 0')
    if (args.length !== v.length) return false

    const results = args.map((spec, i) => {
      return check(specs, spec, v[i])
    })

    return R.all(R.equals(true), results)
  },

  /**
   * ### every
   */
  every: ({args, specs, check}) => v => {
    const [spec] = args
    if (spec === undefined) throw Error('no spec provided to "every"')
    if (args.length > 1) throw Error(`too many specs provided to "every". got ${args}`)

    const c = v => check(specs, spec, v)
    if (R.is(Object, v)) {
      return R.all(c, R.values(v))
    }
    if (R.is(Array, v)) {
      return R.all(c, v)
    }
    throw Error(`"every" spec must be used with a collection (object or array). Got ${v}.`)
  }
}

export default commands

