import p5 from 'p5'
import spectral from 'spectral.js'
import * as brush from 'p5.brush'

let generation = 0
const MAX_GENERATIONS = 100

const randomFromList = <T>(list: T[]) => list[~~(Math.random() * list.length)]

export const sketchScript = (p5: p5) => {
  brush.instance(p5)

  const palette = [
    '#2c695a',
    '#4ad6af',
    '#7facc6',
    '#4e93cc',
    '#f6684f',
    '#ffd300',
  ]

  const width = 1000
  const height = 1000

  p5.setup = () => {
    p5.createCanvas(width, height, p5.WEBGL)
    p5.angleMode(p5.DEGREES)
    p5.background('#fffceb')
    const steps = 200
    for (let i = 0; i < steps; i++) {
      p5.fill(spectral.mix('#fbf9f6', '#fffceb', i / steps))
      p5.noStroke()
      p5.rect(
        -width * 0.5,
        (height / steps) * i - height * 0.5,
        width,
        height / steps,
      )
    }

    brush.load()
    brush.scaleBrushes(1.5)
    brush.field('seabed')
  }

  p5.draw = () => {
    p5.frameRate(60)
    p5.translate(-width / 2, -height / 2)

    const availableBrushes = brush.box()
    brush.set(randomFromList(availableBrushes), randomFromList(palette), 1)

    if (generation <= MAX_GENERATIONS) {
      p5.stroke(randomFromList(palette))
      p5.line(width / 2, height / 2, p5.random(0, width), p5.random(0, height))
      brush.flowLine(width / 2, height / 2, 400, p5.random(0, 360))
      generation++
    }
  }
}
