import R from 'ramda'

import commands from './commands'

/**
 * ## built-in specs
 *
 * the following specs are built in:
 *
 * ### primitives
 *
 * - 'p/string'
 * - 'p/number'
 * - 'p/function'
 * - 'p/array'
 * - 'p/boolean'
 * - 'p/object'
 * - 'p/any'
 * - 'p/true'
 * - 'p/false'
 *
 * ### conformant's types
 *
 * - 'conform/id'
 * - 'conform/formal-spec'
 * - 'conform/spec'
 */

const specs = {}

// primitives

specs['p/string'] = R.is(String)
specs['p/number'] = R.is(Number)
specs['p/function'] = R.is(Function)
specs['p/array'] = R.is(Array)
specs['p/boolean'] = R.is(Boolean)
specs['p/object'] = R.is(Object)
specs['p/any'] = R.always(true)
specs['p/true'] = R.equals(true)
specs['p/false'] = R.equals(false)

// built-ins
// these are implemented as predicates rather than using spec commands
// for bootstrappy purposes. I'd be very interested in a way around that.

const or = (...predicates) => value => {
  return !!R.find(R.equals(true), R.map(p => p(value), predicates))
}

const and = (...predicates) => value => {
  return R.all(R.equals(true), R.map(p => p(value), predicates))
}

specs['conform/id'] = and(
  R.is(String),
  R.contains('/')
)
specs['conform/formal-spec'] = and(
  R.is(Array),
  v => R.contains(R.head(v), R.keys(commands))
)
specs['conform/spec'] = or(
  specs['conform/id'],
  R.is(Function),
  specs['conform/formal-spec']
)
specs['conform/specs'] = and(
  val => Object.values(val).every(specs['conform/spec']),
  val => Object.keys(val).every(R.contains('/'))
)
specs['conform/value'] = R.always(true)

export default specs

