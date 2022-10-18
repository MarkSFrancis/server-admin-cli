/**
 * If the runtime is not Windows, but a Win32 path is used, it will correct it to a WSL compatible path. This assumes that the drive being accessed is available under `/mnt/` as the same name (such as `/mnt/c/` for `C:\`))
 * @param path The path to fix
 */
export const fixWslPath = (path: string) => {
  const windowsDrivePrefixRegex = /^([A-Z|a-z]):/g
  if (path.match(windowsDrivePrefixRegex) && process.platform !== 'win32') {
    // Assumes all drives are mapped identically on both WSL and Windows
    const driveLetter = path.substring(0, 1)

    path = path
      .replaceAll(windowsDrivePrefixRegex, `/mnt/${driveLetter.toLowerCase()}`)
      .replaceAll('\\', '/')
  }

  return path
}
