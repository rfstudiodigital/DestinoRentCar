import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tipo = formData.get('tipo') as string;
    const clienteId = formData.get('clienteId') as string;

    if (!file || !tipo || !clienteId) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Convertir el archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear nombre único
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${tipo}-${uniqueSuffix}${file.name.substring(file.name.lastIndexOf('.'))}`;
    
    // Guardar en public/documentos
    const path = join(process.cwd(), 'public', 'documentos', filename);
    await writeFile(path, buffer);

    // Guardar en BD
    const documento = await prisma.documento.create({
      data: {
        clienteId,
        tipo,
        nombre: file.name,
        url: `/documentos/${filename}`,
        verificado: false,
      },
    });

    return NextResponse.json(documento, { status: 201 });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Error al subir documento' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const clienteId = searchParams.get('clienteId');

    const where = clienteId ? { clienteId } : {};

    const documentos = await prisma.documento.findMany({
      where,
      include: {
        cliente: {
          select: {
            nombre: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(documentos);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Error al obtener documentos' },
      { status: 500 }
    );
  }
}
