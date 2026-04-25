'use client'

import { buildCssFilter, type FilterPreset } from '../utils/filters'

type Props = {
  presets: FilterPreset[]
  imageURL: string | null
  onApply: (vals: FilterPreset['vals']) => void
}

export default function Presets({ presets, imageURL, onApply }: Props){
  return (
    <div className="presets" id="presets" aria-label="Previsualizaciones de filtros">
      {presets.map((p, idx) => {
        const filter = buildCssFilter(p.vals)

        return (
          <button key={p.name || idx} className="preset" title={p.name} onClick={()=>onApply(p.vals)} aria-label={p.name}>
            <img
              alt={p.name}
              src={imageURL ?? undefined}
              style={{ filter, WebkitFilter: filter }}
            />
          </button>
        )
      })}
    </div>
  )
}
