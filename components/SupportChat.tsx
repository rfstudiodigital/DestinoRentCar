'use client';

import { useState } from 'react';
import styles from './SupportChat.module.css';

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const abrirWhatsApp = () => {
    const telefono = '59898123456'; // Número de WhatsApp Business
    const mensajePredefinido = encodeURIComponent(mensaje || '¡Hola! Necesito ayuda con el alquiler de vehículos.');
    window.open(`https://wa.me/${telefono}?text=${mensajePredefinido}`, '_blank');
  };

  const preguntasFrecuentes = [
    {
      pregunta: '¿Cómo reservo un vehículo?',
      respuesta: 'Selecciona el vehículo deseado, elige las fechas en el calendario y completa el formulario de reserva.'
    },
    {
      pregunta: '¿Qué documentos necesito?',
      respuesta: 'Licencia de conducir vigente, cédula de identidad y una tarjeta de crédito/débito.'
    },
    {
      pregunta: '¿Puedo cancelar mi reserva?',
      respuesta: 'Sí, puedes cancelar hasta 48 horas antes del inicio de la renta sin cargo.'
    },
    {
      pregunta: '¿El seguro está incluido?',
      respuesta: 'Todas nuestras rentas incluyen seguro básico. Puedes agregar cobertura adicional.'
    },
  ];

  return (
    <>
      {/* Botón flotante */}
      <button 
        className={styles.floatingButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      {/* Panel de chat */}
      {isOpen && (
        <div className={styles.chatPanel}>
          <div className={styles.chatHeader}>
            <h3>Soporte</h3>
            <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
              ✕
            </button>
          </div>

          <div className={styles.chatContent}>
            <div className={styles.faqSection}>
              <h4>Preguntas Frecuentes</h4>
              {preguntasFrecuentes.map((faq, index) => (
                <details key={index} className={styles.faqItem}>
                  <summary>{faq.pregunta}</summary>
                  <p>{faq.respuesta}</p>
                </details>
              ))}
            </div>

            <div className={styles.whatsappSection}>
              <h4>¿Necesitas más ayuda?</h4>
              <p>Chatea con nosotros por WhatsApp</p>
              
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escribe tu consulta (opcional)..."
                className={styles.textarea}
                rows={3}
              />

              <button 
                onClick={abrirWhatsApp}
                className={styles.whatsappButton}
              >
                <span className={styles.whatsappIcon}>📱</span>
                Abrir WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
