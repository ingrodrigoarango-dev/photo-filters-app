'use client'

import type { SliderKey, SliderValues } from '../utils/filters'

type Props = {
  sliders: SliderValues
  setSlider: (key: SliderKey, value: number) => void
  reset: () => void
  hasImage: boolean
  canvasFilter: string
  toast: (message: string) => void
}

export default function Controls({ sliders, setSlider, reset, hasImage, canvasFilter, toast }: Props) {

  async function saveImage() {
    if (!hasImage) return toast('Sube primero una imagen')
    const imgEl = document.getElementById('preview') as HTMLImageElement | null
    if (!imgEl) return toast('Imagen no encontrada')

    try {
      // Renderar en canvas con el filtro aplicado
      const canvas = document.createElement('canvas')
      const cw = imgEl.naturalWidth || imgEl.width
      const ch = imgEl.naturalHeight || imgEl.height
      canvas.width = cw; canvas.height = ch
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('No se pudo obtener contexto de canvas')
      ctx.filter = canvasFilter
      ctx.drawImage(imgEl, 0, 0, cw, ch)

      // Convertir a blob
      const blob: Blob | null = await new Promise(resolve => canvas.toBlob(b => resolve(b), 'image/png'))
      if (!blob) throw new Error('No se pudo generar la imagen')

      // Preparar FormData
      const form = new FormData()
      form.append('image', blob, 'filtered.png')
      // Enviar un nombre de filtro legible; el backend lo guarda tal cual
      form.append('filter', 'Custom')

      // Determinar URL de la API desde variable de entorno (consistente con Gallery)
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://127.0.0.1:3002'

      // Usar AbortController para manejar timeouts
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)

      const res = await fetch(`${apiUrl}/api/images`, {
        method: 'POST',
        body: form,
        signal: controller.signal
      })

      clearTimeout(timeout)

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: `Status ${res.status}` }))
        const message = errBody && errBody.error ? errBody.error : `Error ${res.status}`
        toast(`Error al guardar: ${message}`)
        return
      }

      const data = await res.json().catch(() => null)
      // Mensaje amistoso y detalles en consola
      toast('Imagen guardada correctamente')
      if (data && data.url) {
        // Mostrar URL en consola para pruebas; no abrir automáticamente
        console.info('Imagen guardada en:', data.url)
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        toast('Tiempo de espera agotado al guardar la imagen')
      } else if (err instanceof Error) {
        toast(`Error al guardar: ${err.message}`)
        console.error(err)
      } else {
        toast('Error desconocido al guardar la imagen')
        console.error(err)
      }
    }
  }

  return (
    <div>
      <div className="sliders" role="region" aria-label="Ajustes de imagen">
        <label htmlFor="brightness">Brillo <input id="brightness" type="range" min="50" max="150" value={sliders.brightness} onChange={e => setSlider('brightness', Number(e.target.value))} /></label>
        <label htmlFor="contrast">Contraste <input id="contrast" type="range" min="50" max="150" value={sliders.contrast} onChange={e => setSlider('contrast', Number(e.target.value))} /></label>
        <label htmlFor="saturate">Saturación <input id="saturate" type="range" min="0" max="200" value={sliders.saturate} onChange={e => setSlider('saturate', Number(e.target.value))} /></label>
        <label htmlFor="sepia">Sepia <input id="sepia" type="range" min="0" max="100" value={sliders.sepia} onChange={e => setSlider('sepia', Number(e.target.value))} /></label>
        <label htmlFor="blur">Blur <input id="blur" type="range" min="0" max="10" value={sliders.blur} onChange={e => setSlider('blur', Number(e.target.value))} /></label>
      </div>

      <div className="actions">
        <button id="saveBtn" className="btn btn-primary" disabled={!hasImage} aria-disabled={!hasImage} onClick={saveImage}>Guardar imagen (Ctrl+S)</button>
      </div>

      <div style={{marginTop:8}}>
        <button className="btn" onClick={()=>{ reset(); toast('Ajustes reseteados') }}>Reset (R)</button>
      </div>
    </div>
  )
}
