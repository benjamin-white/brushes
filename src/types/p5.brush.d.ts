declare module 'p5.brush' {
  function load(): void
  function instance(p5: unknown): void
  function scaleBrushes(factor: number): void
  function scale(factor: number): void
  function field(type: 'curved' | 'truncated' | 'zigzag' | 'seabed' | 'waves')
  function noField(): void
  function bleed(amount: number): void
  function box(): unknown[]
  function set(brush: unknown, color: string, width: number)
  function flowLine(
    x: number,
    y: number,
    length: number,
    direction: number,
  ): void
  function noStroke(): void
  function noFill(): void
  function noHatch(): void
  function rect(x: number, y: number, width: number, height: number): void
  function setHatch(brush: unknown, color: string, value: number): void
  function hatch(
    a: number,
    b: number,
    options?: {
      rand?: number
      continuous?: boolean
      gradient?: boolean
    },
  )
}
