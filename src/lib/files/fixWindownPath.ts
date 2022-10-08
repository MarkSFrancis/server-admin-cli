export const fixWindowsPath = (path: string) => {
  const windowsDrivePrefixRegex = /^([A-Z|a-z]):/g
  if (path.match(windowsDrivePrefixRegex)) {
    // Assumes all drives are mapped identically on both WSL and Windows
    const driveLetter = path.substring(0, 1)

    path = path
      .replaceAll(windowsDrivePrefixRegex, `/mnt/${driveLetter.toLowerCase()}`)
      .replaceAll('\\', '/')
  }

  return path
}
