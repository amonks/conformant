import test from 'ava'
import 'babel-register'

import { check } from '../conformant.js'

test('checks strings', t => {
  t.is(check({}, 'p/string', 'some-string'), true)
  t.is(check({}, 'p/string', ''), true)
  t.is(check({}, 'p/string', {}), false)
  t.is(check({}, 'p/string', null), false)
  t.is(check({}, 'p/string', undefined), false)
})

test('checks functions', t => {
  t.is(check({}, 'p/function', () => true), true)
  t.is(check({}, 'p/function', 5), false)
  t.is(check({}, 'p/function', {}), false)
})

test('checks multiple specs with "and"', t => {
  t.is(check({}, ['and', 'p/string', v => v.length === 5], 'abcde'), true)
  t.is(check({}, ['and', 'p/string', v => v.length === 5], 'abc'), false)
  t.throws(() => check({}, ['and'], 'anything'))
})

test('checks multiple specs with "or"', t => {
  t.is(check({}, ['or', 'p/string', 'p/number'], 5), true)
  t.is(check({}, ['or', 'p/string', 'p/number'], {}), false)
  t.throws(() => check({}, ['or'], 'anything'))
})

test('checks objects', t => {
  t.is(check({}, ['keys', 'p/string', 'p/number'], {'p/string': 'some-string', 'p/number': 5}), true)
  t.is(check({}, ['keys', 'p/string', 'p/number'], {'p/string': 5, 'p/number': 'some-string'}), false)
  t.is(check({}, ['keys', 'p/string', 'p/number'], {'p/string': 'some-string'}), false)
  t.throws(() => check({}, ['keys'], {this: 'that'}))
  t.throws(() => check({}, ['keys', 'p/string'], null))
})

test('tests every item in a collection', t => {
  t.is(check({}, ['every', 'p/string'], ['string', 'another-string']), true)
  t.is(check({}, ['every', 'p/string'], {a: 'string', b: 'another-string'}), true)

  t.is(check({}, ['every', 'p/string'], ['string', undefined]), false)
  t.is(check({}, ['every', 'p/string'], {a: 'string', b: 5}), false)

  t.throws(() => check({}, ['every', 'p/string'], 5))
  t.throws(() => check({}, ['every'], {}))
})

