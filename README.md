# Conformant

Conformant exports three functions:

- conform
- check
- instrument

Each of those functions takes three values:

- specs: a map of spec ids to specs
- spec: either an id from the map, or a spec
- value: some value which is checked against the spec

## specs

a spec can be one of three things:

- a string, which is a reference to another spec
- a function, which is passed a value and returns true or false
- a formal spec using a _command_



## commands

All specs can be resolved to a command, and all other specs can be
resolved to the 'predicate' command.

A spec that uses a command is called a 'formal spec'. It is an array
containing the command followed by its arguments.

Here are some examples of formal specs:

- `['predicate', value => value === 'Bob Zucchini']`
- `['keys', 'staleness', 'crustiness', 'yeast']`


### predicate

Predicate takes one argument: a function.

Here's an example predicate: `['predicate', v => v === true]`


### function

A function spec takes one argument, a config object with
up to three keys:

- args: a spec describing the arguments to the function
- ret: a spec describing the return value of the function
- fn: a predicate function passed ([...args], returnValue)
  describing the relationship between them

None of those keys are checkable until apply-time, so function
specs are mostly useful with the provided `instrument` function,
rather than `check` and `conform`.


### or

or takes at least two spec arguments, at least one of which a value must satisfy


### and

and takes at least two spec arguments, at least one of which a value must satisfy


### keys

keys takes at least one string argument, which must be the name of a spec in the
'specs' object.

An object satisfies a 'keys' spec if it has one key for each string argument, and
if the values at those keys satisfy their specs.

That was a pretty bad description, so here's an example:

```javascript
const specs = {
  'person/name': 'p/string',
  'person/age': 'p/number',
  'person': ['keys', 'person/name', 'person/age']
}
const data = {
  'person/name': 'Andrew',
  'person/age': 24
}
const badData = {
  'person/name': 55,
  'person/age': 24
}
check(specs, 'person', data) // => true
check(specs, 'person', badData) // => false
```


### tuple

the tuple command takes at least one spec argument.

each argument is treated as a cell in the tuple.


### every

every takes one spec argument.

It validates that every value in a collection (object or array) satisfies that spec.



## conformant.check

conformant.check takes three arguments, which
may be passed separately:

- specs
- spec
- value

it returns true or false



## conformant.conform

takes three arguments:
- specs
- spec
- value
and returns either the value, if it satisfies
the spec, or the string "conform/invalid"



## conformant.instrument

instrument takes three arguments:

- specs
- spec -- must be a 'function' command spec
- function

it returns a modified function that checks its
arguments, return value, and their relationshp
against the config provided in the spec, and
throws if they aren't satisfied.



## built-in specs

the following specs are built in:

### primitives

- 'p/string'
- 'p/number'
- 'p/function'
- 'p/array'
- 'p/boolean'
- 'p/object'
- 'p/any'
- 'p/true'
- 'p/false'

### conformant's types

- 'conform/id'
- 'conform/formal-spec'
- 'conform/spec'

