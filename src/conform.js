import check from './check'

/**
 * conform
 * conform a value
 *
 * returns the string 'conform/invalid' or a valid value
 */

const conform = (specs, spec, value) => {
  const isValid = check(specs, spec, value)
  if (!isValid) return 'conform/invalid'
  return value
}

export default conform

