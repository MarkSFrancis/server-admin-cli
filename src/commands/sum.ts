import { Command } from 'commander'
import { sum } from '../lib/math'

export const sumCommand = new Command('sum')
  .description('add numbers together')
  .argument('<numbers...>', 'numbers to add')
  .action((numbers) => {
    console.log({ numbers })
    console.log(`Sum: ${sum(...numbers.map(Number))}`)
  })
