import { type FfmpegCommand } from 'fluent-ffmpeg'

interface FfmpegProgress {
  percent: number
}

export const runFfmpeg = async (command: FfmpegCommand) => {
  console.info(
    'Executing: ffmpeg ',
    command
      ._getArguments()
      .map((a) => `"${a}"`)
      .join(' ')
  )

  await new Promise<void>((resolve, reject) => {
    command.on('error', (err: Error) => {
      reject(err)
    })
    command.on('progress', (data: FfmpegProgress) => {
      console.info(`Processing: ${data.percent}% done`)
    })
    command.on('end', () => {
      resolve()
    })
  })
}
