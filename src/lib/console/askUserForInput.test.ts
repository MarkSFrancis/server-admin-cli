import { Interface } from 'readline'
import { mocked } from 'ts-jest/utils'
import { stub } from '../test-utils/stub'
import { askUserForInput } from './askUserForInput'
import { getReadline } from './getReadline'

jest.mock('./getReadline')

const getReadlineMock = mocked(getReadline)
const userTerminalResponseStub = 'test answer'

describe('askUserForInput', () => {
  let readlineMock: jest.Mocked<Interface>

  beforeEach(() => {
    jest.resetAllMocks()

    readlineMock = stub<jest.Mocked<Interface>>({
      close: jest.fn(),
      question: jest.fn(),
    })

    getReadlineMock.mockImplementation(() => readlineMock)

    readlineMock.question.mockImplementation(((
      _question,
      response: (answer: string) => void
    ) => response(userTerminalResponseStub)) as Interface['question'])
  })

  it('should resolve when a question is answered, and close the IO stream', async () => {
    const question = 'Test question'
    const response = await askUserForInput(question)

    expect(response).toEqual(userTerminalResponseStub)
    expect(readlineMock.question).toHaveBeenCalledTimes(1)
    expect(readlineMock.question).toHaveBeenCalledWith(
      question,
      expect.anything()
    )

    expect(readlineMock.close).toHaveBeenCalledTimes(1)
  })
})
