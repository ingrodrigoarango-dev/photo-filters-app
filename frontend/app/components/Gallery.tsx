"use client";

import React, { useEffect, useState } from "react";

/**
 * Image interface
 * Define la estructura de datos que regresa la API
 */
interface Image {
  id: number;
  filename: string;
  originalName: string;
  filterUsed: string;
  createdAt: string;
  url: string;
}

/**
 * Gallery Component
 * Muestra una galería de imágenes guardadas con sus detalles
 * - Miniaturas de imágenes
 * - Nombre de la imagen original
 * - Filtro aplicado
 * - Fecha de creación
 * - Accesibilidad completa (alt text, roles, focus management)
 */
export default function Gallery(): React.ReactElement {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch images from backend API
   * GET /api/images
   */
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Determinar la URL base de la API
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3002";
        const response = await fetch(`${apiUrl}/api/images`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error al cargar imágenes: ${response.status}`);
        }

        const data: Image[] = await response.json();
        setImages(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error("Error fetching images:", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  /**
   * Format date to readable format (ES)
   */
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  /**
   * Loading state
   */
  if (loading) {
    return (
      <section
        className="gallery-container"
        role="region"
        aria-label="Galería de imágenes"
        aria-busy="true"
      >
        <div className="container w-full max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-8">Galería de Imágenes</h2>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div
                className="w-12 h-12 border-4 border-slate-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"
                role="status"
                aria-label="Cargando imágenes"
              />
              <p className="text-slate-400">Cargando galería...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <section
        className="gallery-container"
        role="region"
        aria-label="Galería de imágenes"
        aria-live="polite"
      >
        <div className="container w-full max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-8">Galería de Imágenes</h2>
          <div
            className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center"
            role="alert"
          >
            <p className="text-red-200 font-semibold mb-2">
              Error al cargar la galería
            </p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  /**
   * Empty state
   */
  if (images.length === 0) {
    return (
      <section
        className="gallery-container"
        role="region"
        aria-label="Galería de imágenes"
      >
        <div className="container w-full max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-8">Galería de Imágenes</h2>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
            <p className="text-slate-400 text-lg">
              No hay imágenes en la galería aún
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Sube y guarda una imagen desde el editor para que aparezca aquí
            </p>
          </div>
        </div>
      </section>
    );
  }

  /**
   * Gallery grid with images
   */
  return (
    <section
      className="gallery-container"
      role="region"
      aria-label="Galería de imágenes guardadas"
    >
      <div className="container w-full max-w-6xl mx-auto px-4 py-8">
        {/* Gallery Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Galería de Imágenes</h2>
          <p className="text-slate-400">
            {images.length} {images.length === 1 ? "imagen guardada" : "imágenes guardadas"}
          </p>
        </div>

        {/* Gallery Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          role="list"
          aria-label="Lista de imágenes en la galería"
        >
          {images.map((image) => (
            <GalleryItem key={image.id} image={image} formatDate={formatDate} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * GalleryItem Component
 * Tarjeta individual para una imagen
 */
interface GalleryItemProps {
  image: Image;
  formatDate: (dateString: string) => string;
}

function GalleryItem({
  image,
  formatDate,
}: GalleryItemProps): React.ReactElement {
  const [imageError, setImageError] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  /**
   * Extract filename without extension for display
   */
  const displayName = image.originalName.replace(/\.[^/.]+$/, "");

  return (
    <article
      className="gallery-item group"
      role="listitem"
    >
      {/* Image Container with hover effects */}
      <div
        className="relative overflow-hidden rounded-lg bg-slate-800 aspect-square mb-4 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail Image */}
        {!imageError ? (
          <img
            src={image.url}
            alt={`Thumbnail: ${displayName} con filtro ${image.filterUsed}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
            role="img"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800"
            role="status"
            aria-label="No se pudo cargar la imagen"
          >
            <div className="text-center px-4">
              <p className="text-slate-400 text-sm">
                No se pudo cargar la imagen
              </p>
            </div>
          </div>
        )}

        {/* Overlay with view action */}
        {isHovered && !imageError && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300">
            <a
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
              aria-label={`Ver imagen completa: ${displayName}`}
            >
              Ver completa
            </a>
          </div>
        )}
      </div>

      {/* Image Information */}
      <div className="space-y-3">
        {/* Image Name */}
        <div>
          <h3 className="font-semibold text-slate-100 truncate text-base">
            {displayName}
          </h3>
          <p className="text-xs text-slate-500 truncate">
            {image.originalName}
          </p>
        </div>

        {/* Filter Used */}
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Filtro:
          </p>
          <p
            className="text-sm text-slate-300 bg-slate-700/50 px-3 py-1 rounded inline-block"
            role="status"
            aria-label={`Filtro aplicado: ${image.filterUsed}`}
          >
            {image.filterUsed}
          </p>
        </div>

        {/* Creation Date */}
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Fecha:
          </p>
          <time
            dateTime={image.createdAt}
            className="text-sm text-slate-300"
            title={image.createdAt}
          >
            {formatDate(image.createdAt)}
          </time>
        </div>

        {/* Download/View Link */}
        <a
          href={image.url}
          download={image.originalName}
          className="mt-4 w-full inline-flex items-center justify-center px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          aria-label={`Descargar imagen: ${displayName}`}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Descargar
        </a>
      </div>
    </article>
  );
}
