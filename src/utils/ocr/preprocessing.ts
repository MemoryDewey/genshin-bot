import { Marvin, MarvinImage } from 'lib/marvinj'
import { imageDataToURL } from './dataUrl'
import { ImageData } from 'canvas'

export const findCropLine = (image: MarvinImage, threshold = 220, multiplier = 0.85) => {
  const clone = image.clone()
  Marvin.thresholding(clone, clone, threshold, 255)
  const width = clone.getWidth()
  const height = clone.getHeight()
  const max = width * 255

  // default to half height
  let cropLinePos = Math.ceil(height / 2)

  for (let y = 0; y < height; y++) {
    let rowSum = 0
    for (let x = 0; x < width; x++) {
      // since the image is thresholded, every channel should be the same,
      const brightness = clone.getIntComponent0(x, y)
      rowSum += brightness
    }
    if (rowSum >= multiplier * max) {
      cropLinePos = y
      break
    }
  }
  return cropLinePos
}

export const splitImage = (
  image: MarvinImage,
  yPos: number,
): [MarvinImage, MarvinImage] => {
  const top = image.clone()
  const bottom = image.clone()

  Marvin.crop(image, top, 0, 0, image.getWidth(), yPos)
  Marvin.crop(image, bottom, 0, yPos, image.getWidth(), image.getHeight() - yPos)

  return [top, bottom]
}

// https://github.com/frzyc/genshin-optimizer
type Color = { r: number; g: number; b: number }
export const processImageWithBandPassFilter = (
  imageData: ImageData,
  color1: Color,
  color2: Color,
  options: { mode?: string },
) => {
  //region - "top","bot","all" default all
  //mode - "bw","color","invert" default color
  const { mode } = options
  const clone = Uint8ClampedArray.from(imageData.data)
  const bw = mode === 'bw'
  const invert = mode === 'invert'
  for (let i = 0; i < clone.length; i += 4) {
    const r = clone[i]
    const g = clone[i + 1]
    const b = clone[i + 2]
    if (
      r >= color1.r &&
      r <= color2.r &&
      g >= color1.g &&
      g <= color2.g &&
      b >= color1.b &&
      b <= color2.b
    ) {
      if (bw) {
        clone[i] = clone[i + 1] = clone[i + 2] = 0
      } else if (invert) {
        clone[i] = 255 - r
        clone[i + 1] = 255 - g
        clone[i + 2] = 255 - b
      }
    } else {
      clone[i] = clone[i + 1] = clone[i + 2] = 255
    }
  }
  return new ImageData(clone, imageData.width, imageData.height)
}

export const preprocessArtifact = (image: MarvinImage) => {
  const line = findCropLine(image)
  const [top, bottom] = splitImage(image, line)

  const topData = new ImageData(top.data, top.getWidth(), top.getHeight())
  const botData = new ImageData(bottom.data, bottom.getWidth(), bottom.getHeight())

  return {
    main: imageDataToURL(
      processImageWithBandPassFilter(
        topData,
        { r: 140, g: 140, b: 140 },
        { r: 255, g: 255, b: 255 },
        { mode: 'bw' },
      ),
    ),
    sub: imageDataToURL(
      processImageWithBandPassFilter(
        botData,
        { r: 30, g: 65, b: 80 },
        { r: 130, g: 160, b: 160 },
        { mode: 'bw' },
      ),
    ),
    set: imageDataToURL(
      processImageWithBandPassFilter(
        botData,
        { r: 0, g: 170, b: 0 },
        { r: 180, g: 255, b: 255 },
        { mode: 'bw' },
      ),
    ),
  }
}
