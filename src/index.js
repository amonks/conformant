/**
 * # Conformant
 *
 * Conformant exports three functions:
 *
 * - conform
 * - check
 * - instrument
 *
 * Each of those functions takes three values:
 *
 * - specs: a map of spec ids to specs
 * - spec: either an id from the map, or a spec
 * - value: some value which is checked against the spec
 *
 * ## specs
 *
 * a spec can be one of three things:
 *
 * - a string, which is a reference to another spec
 * - a function, which is passed a value and returns true or false
 * - a formal spec using a _command_
 */
export { default as conform } from './conform'
export { default as check } from './check'
export { default as instrument } from './instrument'

