import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar todos los vehículos
export async function GET(request: NextRequest) {
  // Log inicial para diagnóstico
  console.log('🚀 GET /api/vehiculos - Iniciando');
  console.log('📊 Prisma disponible:', !!prisma);
  console.log('📊 DATABASE_URL configurada:', !!process.env.DATABASE_URL);
  
  if (!prisma) {
    console.error('❌ Prisma client no disponible. DATABASE_URL:', !!process.env.DATABASE_URL);
    return NextResponse.json(
      { 
        error: 'Base de datos no configurada',
        message: 'DATABASE_URL no está configurada en las variables de entorno',
        diagnostic: {
          hasPrisma: false,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
        }
      },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const soloDisponibles = searchParams.get('disponible') === 'true';

    const where = soloDisponibles ? { disponible: true } : {};

    console.log('🔍 Buscando vehículos con filtro:', JSON.stringify(where));

    // Intentar query directamente
    console.log('📡 Ejecutando prisma.vehiculo.findMany...');
    const vehiculos = await prisma.vehiculo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    
    console.log(`✅ Vehículos encontrados: ${vehiculos.length}`);
    
    if (vehiculos.length === 0) {
      console.log('⚠️  No se encontraron vehículos - tabla puede estar vacía');
      
      // Verificar si la tabla existe contando
      try {
        const totalCount = await prisma.vehiculo.count();
        console.log(`📊 Total de vehículos en BD: ${totalCount}`);
      } catch (countError: any) {
        console.error('❌ Error contando vehículos:', countError);
        console.error('Count error code:', countError?.code);
        console.error('Count error message:', countError?.message);
        
        if (countError?.code === 'P2021') {
          throw new Error('La tabla Vehiculo no existe. Ejecuta: npx prisma db push');
        }
        // No lanzar error aquí, solo loguear
      }
    }

    console.log('✅ Retornando vehículos exitosamente');
    return NextResponse.json(vehiculos, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    // Logging completo del error
    console.error('❌ ERROR CAPTURADO en GET /api/vehiculos:');
    console.error('Error tipo:', typeof error);
    console.error('Error es Error:', error instanceof Error);
    console.error('Error completo:', error);
    console.error('Error message:', error?.message);
    console.error('Error code:', error?.code);
    console.error('Error name:', error?.name);
    console.error('Error stack:', error?.stack);
    console.error('Error meta:', error?.meta);
    console.error('Error clientVersion:', error?.clientVersion);
    
    // Extraer información del error
    const errorMessage = error?.message || 'Unknown error';
    const errorCode = error?.code || 'NO_CODE';
    const errorName = error?.name || 'UnknownError';
    const errorStack = error?.stack;
    
    // Mensajes específicos según el código de error de Prisma
    let userMessage = errorMessage;
    let suggestion = '';
    
    if (errorCode === 'P2021') {
      userMessage = 'La tabla Vehiculo no existe en la base de datos';
      suggestion = 'Ejecuta: npx prisma db push (localmente) para crear las tablas';
    } else if (errorCode === 'P1001') {
      userMessage = 'No se puede alcanzar el servidor de base de datos';
      suggestion = 'Verifica que Neon esté activo y la URL de conexión sea correcta';
    } else if (errorCode === 'P1008') {
      userMessage = 'Timeout de conexión a la base de datos';
      suggestion = 'Verifica que Neon esté activo. Usa la URL con pooler: ep-xxx-pooler.neon.tech';
    } else if (errorCode === 'P1017') {
      userMessage = 'El servidor cerró la conexión';
      suggestion = 'Verifica la configuración de Neon y usa connection pooling';
    } else if (errorMessage?.includes('SSL') || errorMessage?.includes('ssl')) {
      userMessage = 'Error SSL: Se requiere conexión segura';
      suggestion = 'Agrega ?sslmode=require a tu DATABASE_URL';
    } else if (errorMessage?.includes('timeout')) {
      userMessage = 'Timeout conectando a la base de datos';
      suggestion = 'Verifica que Neon esté activo y usa la URL con pooler';
    } else if (errorMessage?.includes('password') || errorMessage?.includes('authentication')) {
      userMessage = 'Error de autenticación';
      suggestion = 'Verifica las credenciales en DATABASE_URL. Obtén una nueva URL desde Neon';
    } else if (errorMessage?.includes('ENOTFOUND') || errorMessage?.includes('getaddrinfo')) {
      userMessage = 'No se puede resolver el hostname de la base de datos';
      suggestion = 'Verifica que la URL de conexión sea correcta';
    }
    
    return NextResponse.json(
      { 
        error: 'Error al obtener vehículos',
        message: userMessage,
        originalMessage: errorMessage,
        code: errorCode,
        name: errorName,
        suggestion,
        ...(process.env.NODE_ENV === 'development' && { 
          stack: errorStack,
          meta: error?.meta,
          clientVersion: error?.clientVersion,
        }),
      },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo vehículo
export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Base de datos no configurada' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { marca, modelo, anio, placa, color, precioDiario, imagen, descripcion } = body;

    // Validaciones
    if (!marca || !modelo || !anio || !placa || !color || !precioDiario) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const vehiculo = await prisma.vehiculo.create({
      data: {
        marca,
        modelo,
        anio: parseInt(anio),
        placa,
        color,
        precioDiario: parseFloat(precioDiario),
        imagen: imagen || null,
        descripcion: descripcion || null,
        disponible: true,
      },
    });

    return NextResponse.json(vehiculo, { status: 201 });
  } catch (error: any) {
    console.error('Error creando vehículo:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un vehículo con esta placa' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error al crear vehículo' },
      { status: 500 }
    );
  }
}

