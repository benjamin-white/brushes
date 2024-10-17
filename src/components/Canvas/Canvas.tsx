import { useEffect, useRef } from 'react'
import p5 from 'p5'
import { sketchScript } from '../../sketches/sketch-002'

const Canvas = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const p5Instance = new p5(sketchScript, ref.current ?? undefined)
    return () => p5Instance?.remove()
  }, [])

  return <div ref={ref}></div>
}

export default Canvas
