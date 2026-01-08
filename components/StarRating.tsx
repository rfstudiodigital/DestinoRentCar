'use client';

import { useState } from 'react';
import styles from './StarRating.module.css';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  size = 'medium', 
  interactive = false 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`${styles.container} ${styles[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${styles.star} ${star <= displayRating ? styles.filled : ''} ${interactive ? styles.interactive : ''}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          disabled={!interactive}
        >
          ★
        </button>
      ))}
    </div>
  );
}
