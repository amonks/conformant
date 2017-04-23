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
 * - `['predicate', value => value === 'Bob Zucchini']`
 * - `['keys', 'staleness', 'crustiness', 'yeast']`
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
   *
   * or takes at least two spec arguments, at least one of which a value must satisfy
   */
  or: ({args, specs, check}) => v => {
    if (args.length === 0) throw Error('no specs provided to "or"')
    if (args.length === 1) throw Error('only one spec provided to "or"')
    return R.any(spec => check(specs, spec, v), args)
  },

  /**
   * ### and
   *
   * and takes at least two spec arguments, at least one of which a value must satisfy
   */
  and: ({args, specs, check}) => v => {
    if (args.length === 0) throw Error('no specs provided to "and"')
    if (args.length === 1) throw Error('only one spec provided to "and"')
    return R.all(spec => check(specs, spec, v), args)
  },

  // maps

  /**
   * ### keys
   *
   * keys takes at least one string argument, which must be the name of a spec in the
   * 'specs' object.
   *
   * An object satisfies a 'keys' spec if it has one key for each string argument, and
   * if the values at those keys satisfy their specs.
   *
   * That was a pretty bad description, so here's an example:
   *
   * ```javascript
   * const specs = {
   *   'person/name': 'p/string',
   *   'person/age': 'p/number',
   *   'person': ['keys', 'person/name', 'person/age']
   * }
   * const data = {
   *   'person/name': 'Andrew',
   *   'person/age': 24
   * }
   * const badData = {
   *   'person/name': 55,
   *   'person/age': 24
   * }
   * check(specs, 'person', data) // => true
   * check(specs, 'person', badData) // => false
   * ```
   */
  keys: ({args: keys, specs, check}) => v => {
    if (keys.length === 0) throw Error('no keys provided to "keys"')
    if (!R.is(Object, v)) throw Error(`value used with "keys" spec must be an object. got ${v}`)
    return R.all(key => check(specs, key, v[key]), keys)
  },

  // collections

  /**
   * ### tuple
   *
   * the tuple command takes at least one spec argument.
   *
   * each argument is treated as a cell in the tuple.
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
   *
   * every takes one spec argument.
   *
   * It validates that every value in a collection (object or array) satisfies that spec.
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

