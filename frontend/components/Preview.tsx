'use client'

import React from 'react'

export default function Preview({ src, filter }: { src?: string | null, filter: string }){
  const style = React.useMemo(
    () => ({
      filter,
      WebkitFilter: filter,
      willChange: 'filter' as const,
      display: src ? 'block' : 'none',
    }),
    [filter, src]
  )

  return (
    <>
      <img id="preview" alt="Preview de la imagen" src={src ?? undefined} style={style} />
    </>
  )
}
