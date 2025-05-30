export const convertPathToGlob = (pathToEscape: string) =>
  pathToEscape.replaceAll('\\', '/');
