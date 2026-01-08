'use client';

import { useState, useRef } from 'react';
import styles from './DocumentUpload.module.css';
import { useToast } from './ToastProvider';

interface DocumentUploadProps {
  clienteId: string;
  onUploadComplete?: () => void;
}

export default function DocumentUpload({ clienteId, onUploadComplete }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState<'licencia' | 'cedula' | 'comprobante'>('licencia');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('El archivo no debe superar 5MB', 'error');
      return;
    }

    // Validar tipo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      showToast('Solo se permiten archivos JPG, PNG o PDF', 'error');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tipo', tipoDocumento);
      formData.append('clienteId', clienteId);

      const response = await fetch('/api/documentos', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al subir documento');
      }

      showToast('Documento subido exitosamente', 'success');
      
      if (onUploadComplete) {
        onUploadComplete();
      }

      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error al subir documento', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Subir Documento</h3>

      <div className={styles.typeSelector}>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="tipo"
            value="licencia"
            checked={tipoDocumento === 'licencia'}
            onChange={(e) => setTipoDocumento(e.target.value as any)}
          />
          <span>📜 Licencia de Conducir</span>
        </label>

        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="tipo"
            value="cedula"
            checked={tipoDocumento === 'cedula'}
            onChange={(e) => setTipoDocumento(e.target.value as any)}
          />
          <span>🪪 Cédula de Identidad</span>
        </label>

        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="tipo"
            value="comprobante"
            checked={tipoDocumento === 'comprobante'}
            onChange={(e) => setTipoDocumento(e.target.value as any)}
          />
          <span>🧾 Comprobante de Domicilio</span>
        </label>
      </div>

      <div className={styles.uploadArea}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,application/pdf"
          onChange={handleFileSelect}
          disabled={isUploading}
          className={styles.fileInput}
          id="file-upload"
        />
        
        <label htmlFor="file-upload" className={styles.uploadLabel}>
          <div className={styles.uploadIcon}>📁</div>
          <p className={styles.uploadText}>
            {isUploading ? 'Subiendo...' : 'Haz clic para seleccionar un archivo'}
          </p>
          <p className={styles.uploadHint}>
            JPG, PNG o PDF (máx. 5MB)
          </p>
        </label>
      </div>
    </div>
  );
}
