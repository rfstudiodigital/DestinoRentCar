import { NextResponse } from 'next/server';

// POST - Logout de administrador
export async function POST() {
  // El logout se maneja en el cliente eliminando el localStorage
  // Esta API es solo para consistencia si quieres manejar logout del lado del servidor
  return NextResponse.json({ success: true });
}
