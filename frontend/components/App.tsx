'use client'

import React from 'react'
import Gallery from '../app/components/Gallery'
import Uploader from './Uploader'
import Preview from './Preview'
import Presets from './Presets'
import Controls from './Controls'
import FilterList from './FilterList'
import Toast from './Toast'
import useFilters from '../hooks/useFilters'

export default function ClientApp() {
  const toastRef = React.useRef<((message: string) => void) | null>(null)
  const [activeView, setActiveView] = React.useState<'upload' | 'gallery'>('upload')
  const toast = React.useCallback((message: string) => {
    toastRef.current?.(message)
  }, [])
  const filters = useFilters(toast)

  return (
    <div className="container">
      <header className="site-header">
        <h1>PhotoFilters</h1>
        <p>Sube una foto, aplica filtros y guarda el resultado</p>
      </header>

      <nav
        className="mb-6 flex flex-wrap items-center gap-3"
        aria-label="Navegación principal de la aplicación"
      >
        <button
          type="button"
          onClick={() => setActiveView('upload')}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeView === 'upload'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
          aria-pressed={activeView === 'upload'}
        >
          Cargar imágenes
        </button>
        <button
          type="button"
          onClick={() => setActiveView('gallery')}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeView === 'gallery'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
          aria-pressed={activeView === 'gallery'}
        >
          Ver galería de imágenes
        </button>
      </nav>

      {activeView === 'upload' ? (
        <div className="card" role="application" aria-label="Editor de imágenes">
          <section className="left">
            <div className="uploader">
              <Uploader onFile={filters.loadFile} onClear={filters.clearImage} />
            </div>

            <div id="dropzone" className="preview-wrapper" aria-describedby="drop-hint">
              <div className="image-frame" aria-live="polite">
                <Preview src={filters.imageURL} filter={filters.filter} />
                <div id="placeholder" className="placeholder" style={{display: filters.hasImage ? 'none' : 'block'}}>Arrastra una imagen aquí o usa &quot;Subir imagen&quot;</div>
              </div>
            </div>
            <div id="drop-hint" className="sr-only">Zona para arrastrar y soltar imágenes</div>

            <div className="controls">
              <Presets presets={filters.presets} imageURL={filters.imageURL} onApply={filters.applyPreset} />

              <Controls sliders={filters.sliders} setSlider={filters.setSlider} reset={filters.reset} hasImage={filters.hasImage} canvasFilter={filters.canvasFilter} toast={toast} />
            </div>
          </section>

          <aside className="right">
            <h3>Filtros</h3>
            <FilterList presets={filters.presets} onApply={filters.applyPreset} />
            <div className="help">Atajos: <kbd>Ctrl</kbd>+<kbd>S</kbd> guardar — <kbd>R</kbd> reset</div>
          </aside>
        </div>
      ) : (
        <Gallery />
      )}

      <div id="toast-root"><Toast ref={toastRef} /></div>

      <footer className="site-footer">Hecho con ❤️</footer>
    </div>
  )
}
