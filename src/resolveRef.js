import R from 'ramda'

import builtIns from './specs'
import formalizeSpec from './formalizeSpec'

const resolveRef = (specs, ref) => {
  const resolved = {...builtIns, ...specs}[ref]
  if (R.is(String, resolved)) return resolveRef(specs, resolved)
  return formalizeSpec(resolved)
}

export default resolveRef

