export default async function exportImage(img: HTMLImageElement, canvasFilter: string){
  const canvas = document.createElement('canvas')
  const cw = img.naturalWidth || img.width
  const ch = img.naturalHeight || img.height
  canvas.width = cw; canvas.height = ch
  const ctx = canvas.getContext('2d')
  if(!ctx) throw new Error('No canvas context')
  ctx.filter = canvasFilter
  ctx.drawImage(img,0,0,cw,ch)
  return new Promise<void>((resolve)=>{
    canvas.toBlob(blob=>{
      if(!blob) return resolve()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = 'photo-filters.png'
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); resolve()
    }, 'image/png')
  })
}
