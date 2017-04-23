import R from 'ramda'

import commands from './commands'

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
                                      R.contains('/')]]
specs['conform/formal-spec'] = ['and', ['p/array',
                                         v => R.contains(R.keys(commands), R.head(v))]]
specs['conform/spec'] = ['or', ['conform/id',
                                       'p/function',
                                       'conform/formal-spec']]

export default specs

