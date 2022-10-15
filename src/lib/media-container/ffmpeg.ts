import { FfmpegCommand } from 'fluent-ffmpeg'

interface FfmpegProgress {
  percent: number
}

export const runFfmpeg = async (command: FfmpegCommand) => {
  console.log(
    `Executing: ffmpeg `,
    command
      ._getArguments()
      .map((a) => `"${a}"`)
      .join(' ')
  )

  return await new Promise<void>((resolve, reject) => {
    command.on('error', (err: Error) => {
      reject(err)
    })
    command.on('progress', (data: FfmpegProgress) => {
      console.log(`Processing: ${data.percent}% done`)
    })
    command.on('end', () => {
      resolve()
    })
  })
}
