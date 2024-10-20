import p5 from 'p5'
import spectral from 'spectral.js'
import * as brush from 'p5.brush'

const PALETTE = [
  [
    'rgb(255, 166, 158)',
    'rgb(250, 243, 221)',
    'rgb(184, 242, 230)',
    'rgb(94, 100, 114)',
    // ],
    // [
    'rgb(213, 165, 188)',
    'rgb(232, 196, 209)',
    // 'rgb(245, 234, 224)',
    // 'rgb(200, 208, 218)',
    // 'rgb(164, 183, 204)',
    // `rgb(191, 228, 238)`,
  ],
  [
    `rgb(236, 239, 244)`,
    `rgb(175, 216, 215)`,
    `rgb(191, 228, 238)`,
    `rgb(208, 135, 112)`,
    `rgb(235, 203, 139)`,
    `rgb(180, 142, 173)`,
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
  palette: PALETTE[0],
  brushes: {
    // hatch: ['marker', 'marker2'],
    hatch: ['watercolor', 'marker'],
    // stroke: ['2H', 'HB'],
    stroke: ['marker', 'marker2'],
  },
  grid: {
    numCols: 3,
    numRows: 12,
  },
  isOutLineCanvas: false,
  jitterAmount: 10,
  jitter: {
    all: false,
    panesX: false,
    panesY: true,
    linesX: true,
    linesY: false,
  },
}

// GRADIENT
// OUTSET
// SHAPE
// PATTERM

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

  brush.add('watercolor', {
    // type: 'image', // this is the TIP TYPE: choose standard / spray / marker / custom / image
    type: 'marker',
    weight: 10, // Base weight of the brush tip
    vibration: 1, // Vibration of the lines, spread
    definition: 0.5, // Between 0 and 1
    quality: 12, // + quality = more continuous line
    opacity: 5, // Base opacity of the brush (this will be affected by pressure)
    spacing: 0.2, // Spacing between the points that compose the brush stroke
    blend: true, // Activate / Disable realistic color mixing. By default, this is active for marker-custom-image brushes
    pressure: {
      type: 'custom', // "standard" or "custom". Use "custom"" for custom pressure curves. Use standard for simple gauss bell curve
      //curve: [0.15,0.2],                  // If "standard", pick a and b values for the gauss curve. a is max horizontal mvt of the bell, b changes the slope
      curve: function (x) {
        return 1 - x
      }, // If "custom", define the curve function with a curve equation from x = 0 to x = 1, returning values from 0 to 1
      min_max: [0.5, 1.2], // For both cases, define min and max pressure (reverse for inverted presure)
    },
    // if you select the a custom type brush, define the tip geometry here. Use 0,0 as center of tip. If not, you can remove these lines.
    tip: function () {
      brush.mask.rotate(45),
        brush.mask.rect(-1.5, -1.5, 3, 3),
        brush.mask.rect(1.5, 1.5, 1, 1) // in this example, the tip would be two squares, rotated 45 degrees
    },
    // if you select the image type brush, link your image below. If not, you can remove these lines.
    // image: {
    //   src: './brush.jpg',
    // },
    // For "custom" and "image" types, you can define the tip angle rotation here.
    rotate: 'natural', // "none" disables rotation | "natural" follows the direction of the stroke | "random"
  })

  // brush.preload()

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
    // brush.gravity(0, CONFIG.dimensions.height)
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

        brush.pick('marker') // charcoal
        brush.strokeWeight(p5.random(0.3, 0.6))

        p5.noStroke()
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

        if (Math.random() > 0.6) {
          // p5.stroke(R, G, B, 255 * 0.4)
          brush.stroke(R, G, B)
          // brush.rect(
          //   x + jiterAll + jitterLinesX,
          //   y + jiterAll + jitterLinesY,
          //   cellSizeX,
          //   cellSizeY,
          // )

          brush.rect(
            x + jiterAll + jitterPanesX,
            y + jiterAll + jitterPanesY,
            cellSizeX,
            cellSizeY,
          )
        }

        brush.noStroke()

        // p5.noFill()
        // p5.rect(
        //   x + jiterAll + jitterPanesX + 2,
        //   y + jiterAll + jitterPanesY + 2,
        //   cellSizeX - 4,
        //   cellSizeY - 4,
        // )

        brush.setHatch(
          p5.random(CONFIG.brushes.hatch),
          p5.random(CONFIG.palette) as string,
          p5.random(0.2, 0.6),
        )

        // brush.hatch(p5.random(1, 10) * SCALE_FACTOR, p5.random(0, 180), {
        //   rand: 0,
        //   continuous: false,
        //   gradient: true,
        // })

        brush.hatch(p5.random(1, 10) * SCALE_FACTOR, p5.random(0, 180), {
          rand: p5.random(0.02, 0.06),
          continuous: Math.random() > 0.5,
          gradient: 1,
        })

        brush.rect(
          x + jiterAll + jitterLinesX,
          y + jiterAll + jitterLinesY,
          cellSizeX,
          cellSizeY,
        )

        // brush.bleed(0.3)
        // brush.beginShape(0.5)
        // brush.vertex(50, 50)
        // brush.vertex(150, 50)
        // brush.vertex(150, 150)
        // brush.vertex(50, 150)
        // brush.endShape(p5.CLOSE)

        // brush.reBlend()

        resetBrush()
      }
    }
  }
}
