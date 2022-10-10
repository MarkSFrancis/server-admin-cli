import { Interface } from 'readline'
import { getReadline } from './getReadline'

export const askUserForInput = async (question: string) => {
  const io = getReadline()

  try {
    const answer = await promiseQuestion(io, question)
    return answer
  } finally {
    io.close()
  }
}

async function promiseQuestion(
  io: Interface,
  question: string
): Promise<string> {
  return await new Promise<string>((resolve) => {
    io.question(question, (answer) => {
      resolve(answer)
    })
  })
}
