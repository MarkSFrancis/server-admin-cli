import { program } from 'commander'
import { sum } from './math'

program
  .command('add')
  .description('add numbers together')
  .argument('<numbers...>', 'numbers to add')
  .action((numbers) => {
    console.log({ numbers })
    console.log(`Sum: ${sum(...numbers.map(Number))}`)
  })

program.parse()
