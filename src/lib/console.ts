import { createInterface, Interface } from 'readline'

const getIO = () =>
  createInterface({
    input: process.stdin,
    output: process.stdout,
  })

export const askUserForInput = async (question: string) => {
  const io = getIO()

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
