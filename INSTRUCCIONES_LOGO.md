# Instrucciones para agregar el logo

## Pasos para agregar tu logo

1. **Coloca el archivo en la carpeta `public/`:**
   - Copia tu archivo `logo.svg.jpeg` 
   - Pégalo en la carpeta `public/` del proyecto
   - El archivo debe quedar como: `public/logo.svg.jpeg`

2. **Verifica que el archivo esté en la ubicación correcta:**
   ```
   DestinoRentCar/
   └── public/
       └── logo.svg.jpeg  ← Tu archivo debe estar aquí
   ```

3. **El código ya está actualizado para usar `logo.svg.jpeg` en:**
   - Header (parte superior de todas las páginas)
   - Página principal
   - El logo se adaptará automáticamente a diferentes tamaños

## Si quieres usar el logo también como icono de la app

Si quieres que el mismo logo aparezca como icono de la aplicación PWA y favicon:

1. Crea una versión cuadrada del logo (512x512px recomendado)
2. Guárdala como `icon.png` o `icon.jpg` en la carpeta `public/`
3. Avísame y actualizo el código para usarla

## Nota

- El archivo `logo.svg.jpeg` debe estar en formato JPEG o PNG
- Next.js optimizará automáticamente la imagen
- El logo se mostrará correctamente en todos los dispositivos
