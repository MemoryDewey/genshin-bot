import { ImageData, createCanvas } from 'canvas'
import { writeFileSync } from 'fs'

export const imageDataToURL = (imageData: ImageData) => {
  // create off-screen canvas element
  const canvas = createCanvas(imageData.width, imageData.height)
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // create imageData object
    const canvasImageData = ctx.createImageData(imageData.width, imageData.height)
    // set our buffer as source
    canvasImageData.data.set(imageData.data)
    // update canvas with new data
    ctx.putImageData(canvasImageData, 0, 0)
    // produces a PNG file
    writeFileSync(`./test/${Math.random()}.png`, canvas.toBuffer())
    return canvas.toDataURL()
  }
  throw new Error('Canvas context is not initialized')
}
