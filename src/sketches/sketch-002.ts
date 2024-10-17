import p5 from 'p5'
import spectral from 'spectral.js'
import * as brush from 'p5.brush'

const PALETTE = [
  [
    `rgb(236, 239, 244)`,
    `rgb(175, 216, 215)`,
    `rgb(191, 228, 238)`,
    `rgb(208, 135, 112)`,
    `rgb(235, 203, 139)`,
    `rgb(180, 142, 173)`,
  ],
  [
    'rgb(125, 126, 124)',
    'rgb(145, 151, 149)',
    'rgb(234, 231, 220)',
    'rgb(199, 180, 143)',
    'rgb(164, 183, 204)',
    'rgb(164, 183, 204)',
  ],
]

const SCALE_FACTOR = 1

const CONFIG = {
  dimensions: {
    width: 800 * SCALE_FACTOR,
    height: 800 * SCALE_FACTOR,
  },
  color: {
    background: '#ffffff',
  },
  palette: PALETTE[1],
  brushes: {
    hatch: ['marker', 'marker2'],
    stroke: ['2H', 'HB'],
  },
  grid: {
    numCols: 2,
    numRows: 8,
  },
  isOutLineCanvas: true,
  jitterAmount: 10,
  jitter: {
    all: true,
    panesX: false,
    panesY: false,
    linesX: false,
    linesY: false,
  },
}

const randomFromList = <T>(list: T[]) => list[~~(Math.random() * list.length)]

const getSpectralChannels = (colorOne: string, colorTwo: string, mix = 0.5) =>
  [...spectral.mix(colorOne, colorTwo, mix, 0).matchAll(/\d+/g)].map(
    ([value]) => +value,
  )

const resetBrush = () => {
  brush.noStroke()
  brush.noFill()
  brush.noHatch()
}

export const sketchScript = (p5: p5) => {
  brush.instance(p5)

  p5.setup = () => {
    const border = CONFIG.dimensions.width / CONFIG.grid.numCols
    const cellSizeX = (CONFIG.dimensions.width - border) / CONFIG.grid.numCols
    const cellSizeY = (CONFIG.dimensions.height - border) / CONFIG.grid.numRows

    p5.createCanvas(CONFIG.dimensions.width, CONFIG.dimensions.height, p5.WEBGL)
    p5.angleMode(p5.DEGREES)
    p5.background(CONFIG.color.background)
    p5.translate(-CONFIG.dimensions.width / 2, -CONFIG.dimensions.height / 2)

    brush.load()
    brush.scaleBrushes(1)
    p5.strokeWeight(SCALE_FACTOR)

    if (CONFIG.isOutLineCanvas) {
      const [R, G, B] = getSpectralChannels(
        randomFromList(CONFIG.palette),
        randomFromList(CONFIG.palette),
        p5.random(0, 1),
      )

      p5.stroke(R, G, B, 255 * 0.6)
      p5.rect(
        border / 2,
        border / 2,
        CONFIG.dimensions.width - border,
        CONFIG.dimensions.height - border,
      )
    }

    for (let i = 0; i < CONFIG.grid.numRows; i++) {
      for (let j = 0; j < CONFIG.grid.numCols; j++) {
        const [R, G, B] = getSpectralChannels(
          randomFromList(CONFIG.palette),
          randomFromList(CONFIG.palette),
          p5.random(0, 1),
        )

        p5.fill(R, G, B, 255 * 0.14)

        if (Math.random() > 0.7) {
          p5.stroke(R, G, B, 255 * 0.4)
        } else {
          p5.noStroke()
        }

        const jiterAll = CONFIG.jitter.all
          ? CONFIG.jitterAmount * (Math.random() - 0.5)
          : 0
        const jitterPanesX = CONFIG.jitter.panesX
          ? CONFIG.jitterAmount * (Math.random() - 0.5)
          : 0
        const jitterPanesY = CONFIG.jitter.panesY
          ? CONFIG.jitterAmount * (Math.random() - 0.5)
          : 0
        const jitterLinesX = CONFIG.jitter.linesX
          ? CONFIG.jitterAmount * (Math.random() - 0.5)
          : 0
        const jitterLinesY = CONFIG.jitter.linesY
          ? CONFIG.jitterAmount * (Math.random() - 0.5)
          : 0

        const x = border / 2 + cellSizeX * j
        const y = border / 2 + cellSizeY * i

        p5.rect(
          x + jiterAll + jitterPanesX,
          y + jiterAll + jitterPanesY,
          cellSizeX,
          cellSizeY,
        )

        brush.setHatch(
          p5.random(CONFIG.brushes.hatch),
          p5.random(CONFIG.palette) as string,
          p5.random(0.2, 1),
        )

        brush.hatch(p5.random(1, 10) * SCALE_FACTOR, p5.random(0, 180), {
          rand: 0,
          continuous: false,
          gradient: true,
        })

        brush.hatch(p5.random(1, 10) * SCALE_FACTOR, p5.random(0, 180), {
          rand: 0.04,
          continuous: true,
          gradient: true,
        })

        brush.rect(
          x + jiterAll + jitterLinesX,
          y + jiterAll + jitterLinesY,
          cellSizeX,
          cellSizeY,
        )

        resetBrush()
      }
    }
  }
}
