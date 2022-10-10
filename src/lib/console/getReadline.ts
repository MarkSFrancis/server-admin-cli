import { createInterface } from 'readline'

export const getReadline = () =>
  createInterface({
    input: process.stdin,
    output: process.stdout,
  })
