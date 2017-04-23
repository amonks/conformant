import test from 'ava'
import formalizeSpec from './formalizeSpec'

test('resoves a predicate', t => {
  const fn = () => true
  t.deepEqual(formalizeSpec({}, fn), ['predicate', fn])
})

test('resolves a formal spec', t => {
  const spec = ['and', 'p/string', v => v.length > 5]
  t.deepEqual(formalizeSpec({}, spec), spec)
})

test('fails to resolve a number', t => {
  t.throws(() => formalizeSpec({}, 5))
})

test('resolves a ref to a built in spec', t => {
  const [command, predicate] = formalizeSpec({}, 'p/string')
  t.is(command, 'predicate')
  t.is(predicate('some-string'), true)
  t.is(predicate(5), false)
})

