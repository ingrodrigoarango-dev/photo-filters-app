'use client'

import type { FilterPreset } from '../utils/filters'

type Props = {
  presets: FilterPreset[]
  onApply: (vals: FilterPreset['vals']) => void
}

export default function FilterList({ presets, onApply }: Props){
  return (
    <div id="filterList" className="filter-list" role="list">
      {presets.map((p)=> (
        <button key={p.name} className="filter-item" onClick={()=>onApply(p.vals)}>{p.name}</button>
      ))}
    </div>
  )
}
