import formalizeSpec from './formalizeSpec'
import commands from './commands'
import conform from './conform'
import check from './check'

const predicate = (specs, spec) => {
  if (!spec) throw Error('spec is required')

  const [commandName, ...args] = formalizeSpec(specs, spec)

  const command = commands[commandName]
  if (!command) throw Error(`command not found ("${command}")`)

  const predicate = command({specs, args, conform, check})
  if (!predicate) throw Error(`predicate not found "${predicate}"`)

  return predicate
}

export default predicate

