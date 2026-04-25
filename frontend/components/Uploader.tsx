'use client'

import React from 'react'

type Props = { onFile: (f: File) => void; onClear: () => void }

export default function Uploader({ onFile, onClear }: Props){
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  return (
    <>
      <label className="file-label" htmlFor="fileInput">Subir imagen</label>
      <input id="fileInput" ref={inputRef} type="file" accept="image/*" aria-label="Subir imagen" onChange={e=>{ const f = e.target.files && e.target.files[0]; if(f) onFile(f); }} />
      <button id="clearBtn" className="btn btn-ghost" aria-label="Limpiar imagen" onClick={onClear}>Limpiar</button>
    </>
  )
}
