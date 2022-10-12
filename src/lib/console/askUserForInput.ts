import { prompt } from 'inquirer'

export const consolePrompt = async (question: string) => {
  const response = await prompt([
    {
      name: 'question',
      message: question,
      type: 'input',
    },
  ])

  return response.question as string
}
