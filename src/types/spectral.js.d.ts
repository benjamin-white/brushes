declare module 'spectral.js' {
  function mix(
    from: string,
    to: string,
    amount: number,
    // 0 = RGB
    returnAs?: 0 | 1 | 2 | 3,
  ): string
}
