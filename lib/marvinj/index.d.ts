import { CanvasRenderingContext2D, ImageData, Canvas } from 'canvas'
declare type COLOR_MODEL = 0 | 1
export declare class MarvinImage {
  image: any
  canvas: any
  ctx: CanvasRenderingContext2D | undefined
  data: Uint8ClampedArray
  colorModel: any
  arrBinaryColor: any
  width: number
  height: number
  onload: any
  constructor(width?: number, height?: number, colorModel?: COLOR_MODEL)
  create(width: number, height: number): void
  getWidth(): number
  getHeight(): number
  getColorModel(): any
  setDimension(width: number, height: number): void
  load(url: string, callback: any): void
  callbackImageLoaded(marvinImage: MarvinImage): void
  clone(): MarvinImage
  loadImageData(): ImageData
  update(): void
  clear(color: any): void
  getAlphaComponent(x: number, y: number): number
  setAlphaComponent(x: number, y: number, alpha: number): void
  getIntComponent0(x: number, y: number): number
  getIntComponent1(x: number, y: number): number
  getIntComponent2(x: number, y: number): number
  setIntColor(x: number, y: number, a1: any, a2?: any, a3?: any, a4?: any): void
  getIntColor(x: number, y: number): number
  setIntColor1(x: number, y: number, color: any): void
  setBinaryColor(x: number, y: number, value: any): void
  getBinaryColor(x: number, y: number): any
  copyColorArray(imgDestine: MarvinImage): void
  drawRect(x: number, y: number, width: number, height: number, color: any): void
  fillRect(x: number, y: number, width: number, height: number, color: any): void
  setColorToAlpha(color: any, alpha: any): void
  setAlphaToColor(color: any): void
  setIntColor2(x: number, y: number, alpha: any, color: any): void
  setIntColor3(x: number, y: number, r: number, g: number, b: number): void
  setIntColor4(x: number, y: number, alpha: number, r: number, g: number, b: number): void
  isValidPosition(x: number, y: number): boolean
  draw(canvas: Canvas, x: number, y: number, alphaCombination: any): void
  toBlob(): Blob
  dataURItoBlob(dataURI: string): Blob
}
export declare class MarvinSegment {
  x1: number
  x2: number
  y1: number
  y2: number
  width: number
  height: number
  area: number
  constructor(x1: number, y1: number, x2: number, y2: number)
  segmentMinDistance(segments: Array<MarvinSegment>, minDistance: number): void
}
declare class MarvinAbstractImagePlugin {
  attributes: any
  constructor()
  setAttribute(label: any, value: any): void
  getAttribute(label: any): any
}
declare class DetermineSceneBackground extends MarvinAbstractImagePlugin {
  constructor()
  process(images: any, imageOut: any): void
  getBackgroundPixel(x: number, y: number, images: any, threshold: any): any
}
declare class GaussianBlur extends MarvinAbstractImagePlugin {
  RED: number
  GREEN: number
  BLUE: number
  kernelMatrix: any
  resultMatrix: any
  appiledkernelMatrix: any
  radius: any
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage, mask: any): void
  getGaussianKernel(): unknown[][]
  applyKernel(
    centerPixel_X: number,
    centerPixel_Y: number,
    pixelColor: any,
    image: MarvinImage,
  ): void
}
declare class AlphaBoundary extends MarvinAbstractImagePlugin {
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage): void
  alphaRadius(image: MarvinImage, x: number, y: number, radius: number): void
}
declare class AverageColor extends MarvinAbstractImagePlugin {
  constructor()
  process(imageIn: MarvinImage, attributesOut: any): void
}
declare class BlackAndWhite extends MarvinAbstractImagePlugin {
  MAX_RLEVEL: number
  grayScale: GrayScale
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage): void
}
declare class BrightnessAndContrast extends MarvinAbstractImagePlugin {
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage): void
}
declare class ColorChannel extends MarvinAbstractImagePlugin {
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage): void
}
declare class Emboss extends MarvinAbstractImagePlugin {
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage, mask: any): void
}
declare class GrayScale extends MarvinAbstractImagePlugin {
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage, mask?: any): void
}
declare class Invert extends MarvinAbstractImagePlugin {
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage, mask?: any): void
}
declare class Sepia extends MarvinAbstractImagePlugin {
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage, mask?: any): void
  /**
   * Sets the RGB between 0 and 255
   * @param a
   * @return
   */
  truncate(a: number): number
}
declare class Thresholding extends MarvinAbstractImagePlugin {
  pluginGray: GrayScale
  threshold: any
  thresholdRange: any
  neighborhood: any
  range: any
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage, mask?: any): void
  hardThreshold(imageIn: MarvinImage, imageOut: MarvinImage, mask: any): void
  contrastThreshold(imageIn: MarvinImage, imageOut: MarvinImage): void
  checkNeighbors(
    x: number,
    y: number,
    neighborhoodX: number,
    neighborhoodY: number,
    img: MarvinImage,
  ): boolean
  getSafeColor(x: number, y: number, img: MarvinImage): number
}
declare class ThresholdingNeighborhood extends MarvinAbstractImagePlugin {
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage): void
  theshold(
    image: MarvinImage,
    imageOut: MarvinImage,
    x: number,
    y: number,
    thresholdPercentageOfAverage: any,
    side: any,
    neighborhoodDistance: any,
  ): void
}
declare class CombineByAlpha extends MarvinAbstractImagePlugin {
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage): void
}
declare class MergePhotos extends MarvinAbstractImagePlugin {
  background: DetermineSceneBackground
  constructor()
  process(images: Array<MarvinImage>, imageOut: MarvinImage): void
  mergePhotos(
    images: Array<MarvinImage>,
    imageOut: MarvinImage,
    background: any,
    threshold: any,
  ): void
  mergePhotosSingle(
    imageA: MarvinImage,
    imageB: MarvinImage,
    imageBackground: any,
    threshold: any,
  ): void
}
declare class Convolution extends MarvinAbstractImagePlugin {
  constructor()
  process(
    imageIn: MarvinImage,
    imageOut: MarvinImage,
    attributesOut?: any,
    mask?: any,
    previewMode?: any,
  ): void
  applyMatrix(
    x: number,
    y: number,
    matrix: any,
    imageIn: MarvinImage,
    imageOut: MarvinImage,
  ): void
}
declare class Moravec extends MarvinAbstractImagePlugin {
  directions: number[][]
  constructor()
  process(imageIn: MarvinImage, attrOut?: any): void
  nonmax(x: number, y: number, matrixSize: any, matrix: any): any
  c(x: number, y: number, matrixSize: any, image: any): number
}
/**
 * @author Gabriel Ambrósio Archanjo
 */
declare class Prewitt extends MarvinAbstractImagePlugin {
  matrixPrewittX: number[][]
  matrixPrewittY: number[][]
  convolution: Convolution
  constructor()
  process(
    imageIn: MarvinImage,
    imageOut: MarvinImage,
    mask?: any,
    previewMode?: any,
  ): void
}
declare class BoundaryFill extends MarvinAbstractImagePlugin {
  threshold: any
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage): void
  match(
    image: MarvinImage,
    x: number,
    y: number,
    targetRed: any,
    targetGreen: any,
    targetBlue: any,
    threshold: any,
  ): boolean
}
declare class ErrorDiffusion extends MarvinAbstractImagePlugin {
  threshold: number
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage, mask: any): void
  getValidGray(a_value: number): number
}
declare class Closing extends MarvinAbstractImagePlugin {
  matrix: any
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage): void
}
declare class Dilation extends MarvinAbstractImagePlugin {
  matrix: any
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage): void
  applyMatrix(
    x: number,
    y: number,
    matrix: any,
    imgIn: MarvinImage,
    imgOut: MarvinImage,
  ): void
}
declare class Erosion extends MarvinAbstractImagePlugin {
  matrix: any
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage): void
  applyMatrix(
    x: number,
    y: number,
    matrix: any,
    imgIn: MarvinImage,
    imgOut: MarvinImage,
  ): void
}
export declare class FindTextRegions {
  maxWhiteSpace: number
  maxFontLineWidth: number
  minTextWidth: number
  grayScaleThreshold: number
  constructor(
    maxWhiteSpace: number,
    maxFontLineWidth: number,
    minTextWidth: number,
    grayScaleThreshold: number,
  )
  process(imageIn: MarvinImage): Array<MarvinSegment>
}
declare class IteratedFunctionSystem extends MarvinAbstractImagePlugin {
  rules: any
  EXAMPLE_RULES: any
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage): void
  loadRules(): void
  addRule(rule: any): void
  getRule(): any
  applyRule(point: any, rule: any): void
}
declare class Crop extends MarvinAbstractImagePlugin {
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage): void
}
declare class Scale extends MarvinAbstractImagePlugin {
  constructor()
  process(imageIn: MarvinImage, imageOut: MarvinImage): void
}
declare class MarvinClass {
  alphaBoundaryPlugin: AlphaBoundary
  averageColorPlugin: AverageColor
  blackAndWhitePlugin: BlackAndWhite
  boundaryFillPlugin: BoundaryFill
  brightnessAndContrastPlugin: BrightnessAndContrast
  colorChannelPlugin: ColorChannel
  cropPlugin: Crop
  combineByAlphaPlugin: CombineByAlpha
  embossPlugin: Emboss
  halftoneErrorDiffusionPlugin: ErrorDiffusion
  gaussianBlurPlugin: GaussianBlur
  invertColorsPlugin: Invert
  iteratedFunctionSystemPlugin: IteratedFunctionSystem
  grayScalePlugin: GrayScale
  mergePhotosPlugin: MergePhotos
  moravecPlugin: Moravec
  morphologicalDilationPlugin: Dilation
  morphologicalErosionPlugin: Erosion
  morphologicalClosingPlugin: Closing
  prewittPlugin: Prewitt
  scalePlugin: Scale
  sepiaPlugin: Sepia
  thresholdingPlugin: Thresholding
  thresholdingNeighborhoodPlugin: ThresholdingNeighborhood
  constructor()
  getValue(value: any, defaultValue: any): any
  alphaBoundary(imageIn: MarvinImage, imageOut: MarvinImage, radius: number): void
  averageColor(imageIn: MarvinImage): any
  blackAndWhite(imageIn: MarvinImage, imageOut: MarvinImage, level: number): void
  boundaryFill(
    imageIn: MarvinImage,
    imageOut: MarvinImage,
    x: number,
    y: number,
    color: any,
    threshold?: any,
  ): void
  brightnessAndContrast(
    imageIn: MarvinImage,
    imageOut: MarvinImage,
    brightness: any,
    contrast: any,
  ): void
  colorChannel(
    imageIn: MarvinImage,
    imageOut: MarvinImage,
    red: number,
    green: number,
    blue: number,
  ): void
  crop(
    imageIn: MarvinImage,
    imageOut: MarvinImage,
    x: number,
    y: number,
    width: number,
    height: number,
  ): void
  combineByAlpha(
    imageIn: MarvinImage,
    imageOther: MarvinImage,
    imageOut: MarvinImage,
    x: number,
    y: number,
  ): void
  emboss(imageIn: MarvinImage, imageOut: MarvinImage): void
  halftoneErrorDiffusion(imageIn: MarvinImage, imageOut: MarvinImage): void
  gaussianBlur(imageIn: MarvinImage, imageOut: MarvinImage, radius: number): void
  invertColors(imageIn: MarvinImage, imageOut: MarvinImage): void
  iteratedFunctionSystem(
    imageIn: MarvinImage,
    imageOut: MarvinImage,
    rules: any,
    iterations: number,
  ): void
  grayScale(imageIn: MarvinImage, imageOut: MarvinImage): void
  mergePhotos(images: Array<MarvinImage>, imageOut: MarvinImage, threshold: number): void
  moravec(imageIn: MarvinImage, matrixSize: any, threshold: number): any
  morphologicalDilation(imageIn: MarvinImage, imageOut: MarvinImage, matrix: any): void
  morphologicalErosion(imageIn: MarvinImage, imageOut: MarvinImage, matrix: any): void
  morphologicalClosing(imageIn: MarvinImage, imageOut: MarvinImage, matrix: any): void
  prewitt(imageIn: MarvinImage, imageOut: MarvinImage, intensity: any): void
  scale(
    imageIn: MarvinImage,
    imageOut: MarvinImage,
    newWidth: number,
    newHeight: number,
  ): void
  sepia(imageIn: MarvinImage, imageOut: MarvinImage, intensity: any): void
  thresholding(
    imageIn: MarvinImage,
    imageOut: MarvinImage,
    threshold: number,
    thresholdRange: any,
  ): void
  thresholdingNeighborhood(
    imageIn: MarvinImage,
    imageOut: MarvinImage,
    thresholdPercentageOfAverage: any,
    neighborhoodSide: any,
    samplingPixelDistance: any,
  ): void
}
export declare const Marvin: MarvinClass
export {}
