import { NextRequest } from 'next/server';

/**
 * Verifica si la solicitud viene de un administrador autenticado
 * @param request - Request de Next.js
 * @returns true si es admin, false si no
 */
export function isAdminAuthenticated(request: NextRequest): boolean {
  const adminAuth = request.headers.get('x-admin-auth');
  return adminAuth === 'true';
}

/**
 * Verifica si hay un cliente autenticado (desde localStorage en el cliente)
 * Solo funciona en el cliente, no en el servidor
 */
export function getClienteFromStorage(): { id: string; nombre: string; email: string } | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const clienteId = localStorage.getItem('clienteId');
    const clienteNombre = localStorage.getItem('clienteNombre');
    const clienteEmail = localStorage.getItem('clienteEmail');
    
    if (clienteId && clienteNombre && clienteEmail) {
      return {
        id: clienteId,
        nombre: clienteNombre,
        email: clienteEmail,
      };
    }
  } catch (error) {
    console.error('Error leyendo localStorage:', error);
  }
  
  return null;
}

/**
 * Valida que las fechas de renta sean válidas
 * @param fechaInicio - Fecha de inicio
 * @param fechaFin - Fecha de fin
 * @returns Objeto con isValid y errorMessage
 */
export function validarFechasRenta(fechaInicio: Date, fechaFin: Date): { isValid: boolean; errorMessage?: string } {
  const ahora = new Date();
  ahora.setHours(0, 0, 0, 0);
  
  const inicio = new Date(fechaInicio);
  inicio.setHours(0, 0, 0, 0);
  
  const fin = new Date(fechaFin);
  fin.setHours(0, 0, 0, 0);
  
  // Validar que la fecha de inicio no sea en el pasado
  if (inicio < ahora) {
    return {
      isValid: false,
      errorMessage: 'La fecha de inicio no puede ser en el pasado',
    };
  }
  
  // Validar que la fecha de fin sea posterior a la de inicio
  if (fin <= inicio) {
    return {
      isValid: false,
      errorMessage: 'La fecha de fin debe ser posterior a la fecha de inicio',
    };
  }
  
  // Validar que la renta sea de al menos 1 día
  const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
  if (dias < 1) {
    return {
      isValid: false,
      errorMessage: 'La renta debe ser de al menos 1 día',
    };
  }
  
  // Validar que la renta no sea de más de 90 días (opcional, ajustar según necesidad)
  if (dias > 90) {
    return {
      isValid: false,
      errorMessage: 'La renta no puede ser de más de 90 días',
    };
  }
  
  return { isValid: true };
}
