import builtIns from './specs'

const checkArgs = (specs, spec, value) => {
  const errors = []
  if (!builtIns['conform/specs'](specs)) errors.push('bad specs')
  if (!builtIns['conform/spec'](spec)) errors.push('bad spec')
  if (!builtIns['conform/value'](value)) errors.push('bad value')
  return errors.length > 0 ? errors.join(', ') : false
}

export default checkArgs

