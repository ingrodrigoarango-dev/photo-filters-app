'use client'

import React from 'react'
import { buildCanvasFilter, buildCssFilter, defaultSliders, presets, type SliderKey, type SliderValues } from '../utils/filters'

export default function useFilters(toast: (message: string) => void){
  const [imageURL, setImageURL] = React.useState<string | null>(null)
  const [hasImage, setHasImage] = React.useState(false)
  const [sliders, setSliders] = React.useState<SliderValues>({ ...defaultSliders })

  React.useEffect(()=>{
    const onKey = (e: KeyboardEvent) => {
      if((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==='s'){ e.preventDefault(); if(hasImage){ const saveBtn = document.getElementById('saveBtn'); if(saveBtn) saveBtn.dispatchEvent(new MouseEvent('click')); } else toast('No hay imagen que guardar') }
      if(e.key.toLowerCase()==='r'){ setSliders({ ...defaultSliders }); toast('Ajustes reseteados') }
    }
    window.addEventListener('keydown', onKey)
    return ()=>window.removeEventListener('keydown', onKey)
  }, [hasImage, toast])

  function loadFile(file: File){ if(!file) return; if(imageURL) URL.revokeObjectURL(imageURL); const url = URL.createObjectURL(file); setImageURL(url); setHasImage(true); toast('Imagen cargada') }
  function clearImage(){ if(imageURL) { URL.revokeObjectURL(imageURL); setImageURL(null); } setHasImage(false); toast('Imagen limpiada') }
  function setSlider(k: SliderKey, v: number){ setSliders(s=>({ ...s, [k]: v })) }
  function reset(){ setSliders({ ...defaultSliders }) }
  function applyPreset(vals: SliderValues){ setSliders({ ...vals }); toast('Preset aplicado') }

  const filter = React.useMemo(() => buildCssFilter(sliders), [sliders])
  const canvasFilter = React.useMemo(() => buildCanvasFilter(sliders), [sliders])

  return { imageURL, hasImage, presets, sliders, setSlider, loadFile, clearImage, reset, applyPreset, filter, canvasFilter }
}
