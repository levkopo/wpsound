export const secondsToTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0'),
    m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0'),
    s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0')

  return h + ':' + m + ':' + s
}
