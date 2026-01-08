// Componente de Galería de Imágenes
'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './ImageGallery.module.css';

interface ImageGalleryProps {
  images: { id: string; url: string; esPortada: boolean }[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className={styles.placeholder}>
        <span>🚗</span>
        <p>Sin imágenes disponibles</p>
      </div>
    );
  }

  const mainImage = images[selectedIndex] || images[0];

  return (
    <>
      <div className={styles.gallery}>
        <div className={styles.mainImage} onClick={() => setShowModal(true)}>
          <Image
            src={mainImage.url}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            style={{ objectFit: 'cover' }}
            priority={selectedIndex === 0}
          />
          <button className={styles.zoomButton} aria-label="Ampliar imagen">
            🔍
          </button>
        </div>

        {images.length > 1 && (
          <div className={styles.thumbnails}>
            {images.map((img, index) => (
              <button
                key={img.id}
                className={`${styles.thumbnail} ${
                  index === selectedIndex ? styles.active : ''
                }`}
                onClick={() => setSelectedIndex(index)}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <Image
                  src={img.url}
                  alt={`${alt} - imagen ${index + 1}`}
                  fill
                  sizes="100px"
                  style={{ objectFit: 'cover' }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
              aria-label="Cerrar"
            >
              ✕
            </button>
            
            <button
              className={styles.navButton + ' ' + styles.prevButton}
              onClick={() => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              aria-label="Imagen anterior"
              disabled={images.length <= 1}
            >
              ‹
            </button>

            <div className={styles.modalImage}>
              <Image
                src={mainImage.url}
                alt={alt}
                fill
                sizes="90vw"
                style={{ objectFit: 'contain' }}
              />
            </div>

            <button
              className={styles.navButton + ' ' + styles.nextButton}
              onClick={() => setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              aria-label="Imagen siguiente"
              disabled={images.length <= 1}
            >
              ›
            </button>

            <div className={styles.imageCounter}>
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
