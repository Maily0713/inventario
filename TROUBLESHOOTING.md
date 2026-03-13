# 🐛 Solución de Problemas - Gestor de Inventario

## Problema: Las pestañas del empleado no muestran datos

### Síntoma
- Las pestañas de "Movimientos", "Consultar Inventario" y "Mis Movimientos" no muestran contenido
- Las tablas o formularios aparecen vacíos

### Causa
Puede deberse a:
1. **LocalStorage vacío** - No hay datos inicializados
2. **Datos corrompidos** - localStorage contiene datos malformados
3. **Caché del navegador** - Código antiguo en memoria

### Solución Rápida (Opción 1 - Recomendada)

1. **Abre el archivo `debug.html`** en el navegador
2. Haz clic en **"Reiniciar Datos por Defecto"**
3. Abre **`index.html`** en una nueva pestaña
4. Inicia sesión como empleado: `empleado` / `password`

### Solución Manual (Opción 2)

#### Método A: Limpiar el navegador
1. Abre las DevTools (F12 o clic derecho → Inspeccionar)
2. Ve a **Application** → **Local Storage** 
3. Busca la entrada de `inventoryData`
4. Elimínala completamente
5. Recarga la página (Ctrl+F5)

#### Método B: Resetear con JavaScript
1. Abre la consola del navegador (F12 → Console)
2. Copia y pega este código:

```javascript
// Datos por defecto
const defaultData = {
    productos: [
        { id: '1', codigo: 'ELEC001', nombre: 'Laptop Dell XPS 13', categoria: '1', descripcion: 'Laptop ultrafina de alta performance', stock: 45, stockMinimo: 10, precio: 999.99 },
        { id: '2', codigo: 'ELEC002', nombre: 'Mouse Inalámbrico', categoria: '1', descripcion: 'Mouse inalámbrico con batería', stock: 120, stockMinimo: 20, precio: 29.99 },
        { id: '3', codigo: 'ROPA001', nombre: 'Camiseta Algodón', categoria: '2', descripcion: 'Camiseta 100% algodón', stock: 8, stockMinimo: 15, precio: 19.99 },
        { id: '4', codigo: 'ALI001', nombre: 'Café Premium 500g', categoria: '3', descripcion: 'Café de grano entero', stock: 0, stockMinimo: 25, precio: 12.99 },
        { id: '5', codigo: 'HOG001', nombre: 'Lámpara LED', categoria: '4', descripcion: 'Lámpara de escritorio LED', stock: 35, stockMinimo: 10, precio: 45.99 }
    ],
    categorias: [
        { id: '1', nombre: 'Electrónica', descripcion: 'Productos electrónicos' },
        { id: '2', nombre: 'Ropa', descripcion: 'Prendas de vestir' },
        { id: '3', nombre: 'Alimentos', descripcion: 'Productos alimenticios' },
        { id: '4', nombre: 'Hogar', descripcion: 'Artículos para el hogar' }
    ],
    movimientos: []
};

// Guardar en localStorage
localStorage.setItem('inventoryData', JSON.stringify(defaultData));
console.log('✅ Datos restaurados exitosamente');

// Recargar página
location.reload();
```

3. Presiona Enter
4. La página se recargará automáticamente

### Solución Completa (Opción 3)

Si ninguna opción anterior funciona:

#### 1. Elimina TODOS los datos del navegador
```javascript
// En la consola del navegador
localStorage.clear();
sessionStorage.clear();
location.reload();
```

####2. Abre DevTools y verifica el archivo
- Presiona F12
- Abre la pestaña **Networks** o **Console**
- Recarga la página
- Verifica que `index.html`, `app.js` y `styles.css` carguen sin errores

#### 3. Intenta con otro navegador
- Chrome: ¿Funciona?
- Firefox: ¿Funciona?
- Edge: ¿Funciona?

Si funciona en otra navegador, el problema es específico del navegador que usas.

---

## Otros Problemas Comunes

### Las credenciales no funcionan
**Usuario y contraseña exactos:**
```
Admin:      admin      /      password
Empleado:   empleado   /      password
```

Asegúrate de escribir exactamente igual (sensible a mayúsculas).

### No puedo crear productos

**Es posible que:**
1. No está autenticado como Admin
2. El formulario falta campos obligatorios
3. El localStorage está lleno

**Solución:**
- Inicia sesión como `admin`
- Completa TODOS los campos del formulario
- Si el localStorage está lleno, limpia datos antiguos

### Los movimientos no se guardan

**Verificar:**
1. Selecciona un producto
2. Selecciona un tipo de movimiento
3. Ingresa una cantidad válida
4. Verifica que haya stock disponible (para salidas)

**Código JavaScript para verificar:**
```javascript
// En la consola
const data = JSON.parse(localStorage.getItem('inventoryData'));
console.log('Movimientos guardados:', data.movimientos.length);
```

---

## ✅ Checklist de Diagnóstico

Si tienes problemas, verifica esto en orden:

- [ ] ¿LocalStorage está habilitado en el navegador?
- [ ] ¿El archivo `app.js` está en la misma carpeta que `index.html`?
- [ ] ¿El archivo `styles.css` está en la misma carpeta?
- [ ] ¿Abriste `index.html` (no una carpeta)?
- [ ] ¿Hay errores en la consola del navegador (F12)?
- [ ] ¿Estás usando credenciales correctas?
- [ ] ¿El navegador tiene caché? (Ciérrate completamente y reabre)

---

## 📊 Verificar Datos en LocalStorage

**Para ver exactamente qué hay almacenado:**

1. Abre `debug.html`
2. Lee la sección "Información del LocalStorage"
3. Haz clic en "Ver Datos Completos"

O en la consola:
```javascript
const data = JSON.parse(localStorage.getItem('inventoryData'));
console.table(data.productos);    // Ver productos
console.table(data.categorias);   // Ver categorías
console.table(data.movimientos);  // Ver movimientos
```

---

## 🔄 Restaurar a Estado Inicial

Si deseas comenzar desde cero:

**Opción 1 - Más fácil:**
1. Abre `debug.html`
2. Clic en "Reiniciar Datos por Defecto"
3. Abre `index.html` nuevamente

**Opción 2 - Manual:**
```javascript
// En la consola del navegador
localStorage.removeItem('inventoryData');
location.reload();
```

---

## 🆘 Si Nada Funciona

1. **Prueba en navegador diferente** (Chrome, Firefox, Edge, Safari)
2. **Limpia caché completo:**
   - Chrome: Ctrl+Shift+Delete → Selecciona TODO → Borrar datos
3. **Verifica la consola (F12 → Console)** para errores
4. **Copia los errores que ves y revísalos**

---

## 📞 Información Técnica

### Estructura de LocalStorage

```json
{
  "productos": [...],
  "categorias": [...],
  "movimientos": [...]
}
```

### Tamaño máximo
- Chrome/Edge: ~10 MB
- Firefox: ~10 MB
- Safari: ~5 MB

### Inspeccionar en DevTools
- **Chrome/Edge**: F12 → Application → Local Storage
- **Firefox**: F12 → Storage → Local Storage
- **Safari**: Develop → Show Web Inspector → Storage → Local Storage

---

**Last Updated:** 18 de Febrero de 2026
