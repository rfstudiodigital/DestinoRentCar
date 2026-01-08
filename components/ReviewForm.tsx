'use client';

import { useState } from 'react';
import StarRating from './StarRating';
import styles from './ReviewForm.module.css';
import { useToast } from './ToastProvider';

interface ReviewFormProps {
  vehiculoId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ vehiculoId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      showToast('Por favor selecciona una calificación', 'error');
      return;
    }

    if (comentario.trim().length < 10) {
      showToast('El comentario debe tener al menos 10 caracteres', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/vehiculos/${vehiculoId}/resenas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calificacion: rating, comentario }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al enviar reseña');
      }

      showToast('¡Reseña enviada exitosamente!', 'success');
      setRating(0);
      setComentario('');
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al enviar reseña', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.title}>Escribir Reseña</h3>
      
      <div className={styles.ratingSection}>
        <label className={styles.label}>Tu Calificación:</label>
        <StarRating 
          rating={rating} 
          onRatingChange={setRating} 
          interactive 
          size="large"
        />
      </div>

      <div className={styles.commentSection}>
        <label htmlFor="comentario" className={styles.label}>
          Tu Comentario:
        </label>
        <textarea
          id="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Comparte tu experiencia con este vehículo..."
          className={styles.textarea}
          rows={5}
          required
          minLength={10}
        />
        <div className={styles.charCount}>
          {comentario.length} caracteres (mínimo 10)
        </div>
      </div>

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={isSubmitting || rating === 0}
      >
        {isSubmitting ? 'Enviando...' : 'Publicar Reseña'}
      </button>
    </form>
  );
}
