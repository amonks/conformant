import test from 'ava'

import { instrument } from '../conformant'

test('instruments functions', t => {
  const spec = ['function', {
    'args': ['tuple', 'p/string', 'p/number'],
    'ret': 'p/string',
    'fn': ([str, num], result) => result.includes(num) && result.includes(str)
  }]

  const fn = instrument({}, spec, (a, b) => a + b)
  t.is(fn('num: ', 5), 'num: 5')
})

