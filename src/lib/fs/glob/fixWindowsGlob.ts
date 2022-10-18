/**
 * Corrects a glob that contains `\` to glob-compatible `/` seperators
 */
export const fixWindowsGlob = (glob: string) => {
  return glob.replaceAll('\\', '/')
}
