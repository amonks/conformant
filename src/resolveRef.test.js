import test from 'ava'
import 'babel-register'

import resolveRef from './resolveRef'

test('resolves a ref to a built in spec', t => {
  const [command, predicate] = resolveRef({}, 'p/string')
  t.is(command, 'predicate')
  t.is(predicate('some-string'), true)
  t.is(predicate(5), false)
})

