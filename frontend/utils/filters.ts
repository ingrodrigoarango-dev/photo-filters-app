export type SliderKey = 'brightness' | 'contrast' | 'saturate' | 'sepia' | 'blur'

export type SliderValues = Record<SliderKey, number>

export type FilterPreset = {
  name: string
  vals: SliderValues
}

export const defaultSliders: SliderValues = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  sepia: 0,
  blur: 0,
}

export const presets: FilterPreset[] = [
  { name: 'Normal', vals: { brightness: 100, contrast: 100, saturate: 100, sepia: 0, blur: 0 } },
  { name: 'Vintage', vals: { brightness: 95, contrast: 105, saturate: 90, sepia: 30, blur: 0.5 } },
  { name: 'Cool', vals: { brightness: 105, contrast: 100, saturate: 120, sepia: 0, blur: 0 } },
  { name: 'B&W', vals: { brightness: 100, contrast: 110, saturate: 0, sepia: 0, blur: 0 } },
  { name: 'Soft', vals: { brightness: 105, contrast: 95, saturate: 110, sepia: 8, blur: 1 } },
]

export function buildCssFilter(sliders: SliderValues) {
  return `brightness(${sliders.brightness}%) contrast(${sliders.contrast}%) saturate(${sliders.saturate}%) sepia(${sliders.sepia}%) blur(${sliders.blur}px)`
}

export function buildCanvasFilter(sliders: SliderValues) {
  return `brightness(${sliders.brightness / 100}) contrast(${sliders.contrast / 100}) saturate(${sliders.saturate / 100}) sepia(${sliders.sepia / 100}) blur(${sliders.blur}px)`
}
