const osValue = <TValues extends string>(
  args: Partial<Record<NodeJS.Platform, TValues>> & { default: TValues }
): TValues => {
  if (process.platform in args) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return args[process.platform]!
  } else {
    return args.default
  }
}

export const SpecialFolders = {
  Books: osValue({
    darwin: '/Volumes/tank/media/books/',
    default: '/mnt/z/media/books/',
  }),
  Clips: osValue({
    darwin: '/Volumes/tank/media/clips/',
    default: '/mnt/z/media/clips/',
  }),
  Downloads: osValue({
    darwin: '/Volumes/tank/active-downloads/',
    default: '/mnt/z/active-downloads/',
  }),
  Movies: osValue({
    darwin: '/Volumes/tank/media/movies/',
    default: '/mnt/z/media/movies/',
  }),
  Music: osValue({
    darwin: '/Volumes/tank/media/music/library/',
    default: '/mnt/z/media/music/library/',
  }),
  Pictures: osValue({
    darwin: '/Volumes/tank/media/pictures/',
    default: '/mnt/z/media/pictures/',
  }),
  Tv: osValue({
    darwin: '/Volumes/tank/media/tv-series',
    default: '/mnt/z/media/tv-series',
  }),
}

export type SpecialFolders =
  (typeof SpecialFolders)[keyof typeof SpecialFolders]
