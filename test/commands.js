import R from 'ramda'
import test from 'ava'
import 'babel-register'

import { check } from '../conformant.js'

test('fails on bad commands', t => {
  t.throws(() => check({}, ['poop'], 'anything'))
})

// primitives

test('"p/string" primitive', t => {
  t.is(check({}, 'p/string', 'some-string'), true)
  t.is(check({}, 'p/string', ''), true)
  t.is(check({}, 'p/string', {}), false)
  t.is(check({}, 'p/string', null), false)
  t.is(check({}, 'p/string', undefined), false)
})

test('"p/function" primitive', t => {
  t.is(check({}, 'p/function', () => true), true)
  t.is(check({}, 'p/function', 5), false)
  t.is(check({}, 'p/function', {}), false)
})

// 'and' command

test('"and" command', t => {
  t.is(check({}, ['and', 'p/string', v => v.length === 5], 'abcde'), true)
  t.is(check({}, ['and', 'p/string', v => v.length === 5], 'abc'), false)
  t.throws(() => check({}, ['and'], 'anything'))
})

// 'predicate' command

test('"predicate" command', t => {
  t.is(check({}, ['predicate', R.equals('very true')], 'very true'), true)
  t.is(check({}, ['predicate', R.equals('very true')], 'very false'), false)
  t.throws(() => check({}, ['predicate'], 'very false'))
  t.throws(() => check({}, ['predicate', R.always(true), R.always(true)], 'very false'))
})
// 'or' command

test('"or" command', t => {
  t.is(check({}, ['or', 'p/string', 'p/number'], 5), true)
  t.is(check({}, ['or', 'p/string', 'p/number'], {}), false)
  t.throws(() => check({}, ['or'], 'anything'))
})

// 'tuple' command

test('"tuple" command', t => {
  t.is(check({}, ['tuple', 'p/string', 'p/number'], ['string', 5]), true)
  t.is(check({}, ['tuple', 'p/string', 'p/number'], ['string', 'another-string']), false)
  t.throws(() => check({}, ['tuple'], []))
})

// 'keys' command

test('"keys" command', t => {
  t.is(check({}, ['keys', 'p/string', 'p/number'], {'p/string': 'some-string', 'p/number': 5}), true)
  t.is(check({}, ['keys', 'p/string', 'p/number'], {'p/string': 5, 'p/number': 'some-string'}), false)
  t.is(check({}, ['keys', 'p/string', 'p/number'], {'p/string': 'some-string'}), false)
  t.throws(() => check({}, ['keys'], {this: 'that'}))
  t.throws(() => check({}, ['keys', 'p/string'], null))
})

// 'every' command

test('"every" command', t => {
  t.is(check({}, ['every', 'p/string'], ['string', 'another-string']), true)
  t.is(check({}, ['every', 'p/string'], {a: 'string', b: 'another-string'}), true)

  t.is(check({}, ['every', 'p/string'], ['string', undefined]), false)
  t.is(check({}, ['every', 'p/string'], {a: 'string', b: 5}), false)

  t.throws(() => check({}, ['every', 'p/string'], 5))
  t.throws(() => check({}, ['every'], {}))
})

