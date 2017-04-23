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

specs['conform/id'] = ['and', ['p/string',
                               str => str.includes('/')]]
specs['conform/formal-spec'] = ['and', ['p/array',
                                         v => R.contains(R.head(v), R.keys(commands))]]
specs['conform/spec'] = ['or', ['conform/id',
                                'p/function',
                                'conform/formal-spec']]

export default specs

