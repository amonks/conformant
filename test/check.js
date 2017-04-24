import test from 'ava'

import { check } from '../conformant'

test('throws on bad specs argument: not namespaced', t => {
  t.throws(() => {
    check({noSlash: 'p/string'}, 'p/string', 'hello')
  })
})

test('throws on bad specs argument: not an object', t => {
  t.throws(() => {
    check(['notAnObject'], 'p/string', 'hello')
  })
})

test('throws on bad specs argument: contains an invalid spec', t => {
  t.throws(() => {
    check({'good/key': 5}, 'p/string', 'hello')
  })
})

test('throws on bad spec argument: invalid spec', t => {
  t.throws(() => {
    check({}, 5, true)
  })
})

test('throws on bad spec argument: invalid reference', t => {
  t.throws(() => {
    check({}, 'not/a/spec', true)
  })
})

