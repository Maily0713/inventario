# 📦 Gestor de Inventario - Sistema Profesional

## Descripción General

**Gestor de Inventario** es una aplicación web moderna y profesional para la gestión integral del inventario de empresas. Desarrollada con tecnologías de cliente (**HTML5**, **CSS Framework Bootstrap 5**, **JavaScript Vanilla**) con almacenamiento persistente en **localStorage**.

### Características Principales

✅ **CRUD Completo de Productos** - Crear, leer, actualizar y eliminar productos  
✅ **Gestión de Categorías** - Organizar productos por categorías  
✅ **Control Automático de Stock** - Seguimiento en tiempo real del inventario  
✅ **Historial de Movimientos** - Registro detallado de entradas y salidas  
✅ **Sistema de Roles** - Acceso diferenciado para Administrador y Empleado  
✅ **Reportes y Estadísticas** - Panel analítico con métricas clave  
✅ **Persistencia en localStorage** - Datos guardados automáticamente en el navegador  
✅ **Interfaz Responsiva** - Compatible con dispositivos móviles y desktop  
✅ **Búsqueda y Filtros** - Localizar productos y movimientos rápidamente  

---

## 🔐 Sistema de Autenticación

### Credenciales de Prueba

#### Administrador
```
Usuario: admin
Contraseña: password
```

#### Empleado
```
Usuario: empleado
Contraseña: password
```

---

## 👥 Roles del Sistema

### 1️⃣ **Administrador**

El administrador tiene acceso total a todas las características:

#### Pestaña: Productos
- ✏️ **CRUD de Productos**: Crear, editar y eliminar productos
- 📊 **Visualización**: Ver stock actual y estado de alertas
- 🔍 **Búsqueda y Filtros**: Por nombre, código o categoría
- 📉 **Estados de Stock**: Indicadores visuales (Normal, Bajo Stock, Agotado)

**Campos de Productos:**
- Código único
- Nombre del producto
- Categoría
- Descripción
- Stock actual
- Stock mínimo (para alertas)
- Precio unitario

#### Pestaña: Categorías
- ➕ **Crear Categorías**: Nuevas categorías para clasificación
- ✏️ **Editar Categorías**: Modificar nombre y descripción
- 🗑️ **Eliminar Categorías**: Remover categorías (los productos permanecen)

#### Pestaña: Movimientos
- 📋 **Historial Completo**: Todas las entradas y salidas del sistema
- 📅 **Información Detallada**:
  - Fecha y hora del movimiento
  - Tipo (Entrada/Salida)
  - Cantidad
  - Razón o descripción
  - Usuario que realizó el movimiento
  - Stock anterior y nuevo
- 🔍 **Filtros Avanzados**: Por producto, tipo, fecha, etc.

#### Pestaña: Reportes
- 📊 **Estadísticas Generales**:
  - Total de productos
  - Productos con bajo stock
  - Productos agotados
  - Total de movimientos registrados
- 📉 **Análisis Detallados**:
  - Productos con bajo stock (lista ordenada)
  - Top 5 productos más movidos
  - Alertas de reabastecimiento

---

### 2️⃣ **Empleado**

El empleado tiene funcionalidades limitadas enfocadas en operaciones diarias:

#### Pestaña: Movimientos
- 📥 **Registrar Entrada** (Compra): Aumentar stock de productos
- 📤 **Registrar Salida** (Venta/Pérdida): Disminuir stock de productos
- 📝 **Razón del Movimiento**: Campo opcional para notas
- ✅ **Validación Automática**: No permite realizar salidas si no hay stock suficiente

#### Pestaña: Consultar Inventario
- 👁️ **Ver Inventario**: Visualizar stock disponible de todos los productos
- 📍 **Estado del Producto**: Indicadores de stock (Normal, Bajo, Agotado)
- 💰 **Información de Precios**: Ver precio unitario de cada producto
- 🔍 **Búsqueda y Filtros**: Por nombre, código o categoría

#### Pestaña: Mis Movimientos
- 📋 **Historial Personal**: Solo movimientos registrados por el empleado
- 📊 **Trazabilidad**: Saber qué movimientos fue responsable

---

## 📁 Estructura de Archivos

```
gestor de inventario/
├── index.html          # Interfaz HTML principal (vistas y modales)
├── app.js              # Lógica de negocio y manejo de eventos
├── styles.css          # Estilos personalizados y Bootstrap
└── README.md           # Este archivo
```

### Tamaño de los Archivos

- **index.html**: ~16 KB - Estructura HTML con Bootstrap 5
- **app.js**: ~20 KB - Lógica completa de la aplicación
- **styles.css**: ~12 KB - Estilos personalizados y temas
- **Total**: ~48 KB (sin incluir librerías CDN)

---

## 💾 Almacenamiento de Datos

Todos los datos se guardan automáticamente en el **localStorage** del navegador:

### Estructura de Datos Almacenados

```javascript
{
  "productos": [
    {
      "id": "unique_id",
      "codigo": "ELEC001",
      "nombre": "Laptop Dell XPS 13",
      "categoria": "1",
      "descripcion": "Laptop ultrafina",
      "stock": 45,
      "stockMinimo": 10,
      "precio": 999.99
    }
    // ... más productos
  ],
  "categorias": [
    {
      "id": "unique_id",
      "nombre": "Electrónica",
      "descripcion": "Productos electrónicos"
    }
    // ... más categorías
  ],
  "movimientos": [
    {
      "id": "unique_id",
      "fecha": "18/02/2026",
      "hora": "10:30:45",
      "productId": "1",
      "tipo": "entrada",
      "cantidad": 10,
      "razon": "Compra a proveedor",
      "usuario": "admin",
      "stockAnterior": 35,
      "stockNuevo": 45
    }
    // ... más movimientos
  ]
}
```

### Ubicación en el Navegador

Los datos se almacenan en:
- **Chrome/Edge**: DevTools → Application → Local Storage → nombre del sitio
- **Firefox**: DevTools → Storage → Local Storage
- **Safari**: Preferences → Advanced → Web Inspector

### Gestión del Almacenamiento

```javascript
// Cargar datos
const data = JSON.parse(localStorage.getItem('inventoryData'));

// Guardar datos (automático después de cada operación)
localStorage.setItem('inventoryData', JSON.stringify(data));

// Limpiar datos (si es necesario)
localStorage.removeItem('inventoryData');
```

---

## 🚀 Guía de Uso

### 1. **Iniciar Sesión**

1. Abrir `index.html` en el navegador
2. Ingresar usuario y contraseña:
   - Admin: `admin` / `password`
   - Empleado: `empleado` / `password`
3. Hacer clic en "Iniciar Sesión"

### 2. **Administrador - Crear Producto**

1. Ir a pestaña "Productos"
2. Clic en botón "Nuevo Producto"
3. Completar formulario:
   - Código: `ELEC003`
   - Nombre: `Monitor Samsung 27"`
   - Categoría: Seleccionar una existente
   - Stock Inicial: `15`
   - Stock Mínimo: `5`
   - Precio: `299.99`
4. Clic en "Guardar Producto"

### 3. **Administrador - Gestionar Categorías**

1. Ir a pestaña "Categorías"
2. Para crear: Clic en "Nueva Categoría"
3. Para editar: Clic en el ícono de lápiz
4. Para eliminar: Clic en el ícono de papelera

### 4. **Empleado - Registrar Movimiento**

1. Ir a pestaña "Movimientos"
2. Seleccionar producto del dropdown
3. Seleccionar tipo:
   - **Entrada**: Compra al proveedor
   - **Salida**: Venta o pérdida
4. Ingresar cantidad
5. Agregar razón (opcional)
6. Clic en "Registrar Movimiento"

### 5. **Ver Reportes**

1. Admin → Pestaña "Reportes"
2. Ver estadísticas en tiempo real:
   - Productos con bajo stock
   - Top 5 más movidos
   - Total de movimientos

---

## 🛠️ Funcionalidades Técnicas

### 1. **Sistema de Roles**

Implementado mediante:
- Variable global `currentUserRole` que almacena el rol
- Vistas separadas por rol (adminView, empleadoView)
- Restricción de funciones mediante condicionales JavaScript

```javascript
if (currentUserRole === 'admin') {
    // Mostrar opciones de admin
} else if (currentUserRole === 'empleado') {
    // Mostrar opciones de empleado
}
```

### 2. **Búsqueda y Filtros en Tiempo Real**

- Búsqueda de productos por nombre o código
- Filtrado por categoría automático
- Los filtros se actualizan mientras escribes
- Soportan búsquedas parciales

### 3. **Control de Stock Automático**

```javascript
// Entrada
producto.stock += cantidad;

// Salida
if (producto.stock >= cantidad) {
    producto.stock -= cantidad;
} else {
    // Mostrar error de stock insuficiente
}
```

### 4. **Historial Completo de Movimientos**

Cada movimiento registra:
- Fecha y hora exacta
- Tipo de movimiento
- Cantidad
- Usuario responsable
- Stock anterior y nuevo (trazabilidad)

### 5. **Interfaz Responsiva**

- Diseño mobile-first con Bootstrap 5
- Tablas adaptables en dispositivos pequeños
- Menús desplegables en móvil
- Modales optimizados para todas las pantallas

---

## 📊 Ejemplos de Datos Iniciales

La aplicación viene con datos de ejemplo para demostración:

### Categorías Iniciales
1. **Electrónica** - Productos electrónicos
2. **Ropa** - Prendas de vestir
3. **Alimentos** - Productos alimenticios
4. **Hogar** - Artículos para el hogar

### Productos Iniciales
| Código | Nombre | Categoría | Stock | Stock Mín | Precio |
|--------|--------|-----------|-------|-----------|--------|
| ELEC001 | Laptop Dell XPS 13 | Electrónica | 45 | 10 | $999.99 |
| ELEC002 | Mouse Inalámbrico | Electrónica | 120 | 20 | $29.99 |
| ROPA001 | Camiseta Algodón | Ropa | 8 | 15 | $19.99 |
| ALI001 | Café Premium 500g | Alimentos | 0 | 25 | $12.99 |
| HOG001 | Lámpara LED | Hogar | 35 | 10 | $45.99 |

---

## 🔒 Seguridad y Mejores Prácticas

### Consideraciones Implementadas

✅ **Autenticación Simple** - Sistema de usuarios básico  
✅ **Validación de Formularios** - Campos obligatorios y tipos de datos  
✅ **Protección de Vistas** - Solo usuarios autenticados ven el contenido  
✅ **Control de Stock** - No permite salidas sin stock suficiente  
✅ **Historial Inmutable** - No se pueden eliminar movimientos (solo admin puede)  
✅ **Datos Persistentes** - Respaldo automático en localStorage  

### Limitaciones Conocidas

⚠️ **Sin Backend** - Datos almacenados localmente, no sincronizados entre dispositivos  
⚠️ **Sin Encriptación** - localStorage es de fácil acceso (desarrollo local)  
⚠️ **Sin Auditoría Avanzada** - Registro básico de movimientos  
⚠️ **Sin Rotación de Sesiones** - Session permanente mientras navega  

---

## 🎨 Personalización y Extensiones

### Cambiar Colores

En `styles.css`, modificar variables CSS:

```css
:root {
    --primary-color: #0d6efd;      /* Azul principal */
    --success-color: #198754;       /* Verde */
    --danger-color: #dc3545;        /* Rojo */
    --warning-color: #ffc107;       /* Amarillo */
}
```

### Agregar Nuevas Categorías

1. Admin → Pestaña Categorías
2. Clic en "Nueva Categoría"
3. Ingresar nombre y descripción
4. Se guardan automáticamente en localStorage

### Hacer Copia de Seguridad

```javascript
// En consola del navegador
const data = localStorage.getItem('inventoryData');
console.log(data);  // Copiar salida
// Guardar en archivo .json
```

### Restaurar Copia de Seguridad

```javascript
// En consola del navegador
localStorage.setItem('inventoryData', '[pegardatos aqui]');
location.reload();  // Recargar página
```

---

## 🐛 Solución de Problemas

### El localStorage está lleno
**Solución**: Limpiar datos antiguos o usar otro navegador

### Los datos no aparecen después de recargar
**Solución**: Verificar que localStorage esté habilitado en el navegador

### Las contraseñas no funcionan
**Solución**: Usar las credenciales de demo exactamente (admin/password)

### Tabla vacía después de operación
**Solución**: Hacer clic en la pestaña nuevamente para refrescar

---

## 📈 Estadísticas y Métricas

### Panel de Reportes - Métricas Disponibles

1. **Total de Productos** - Cantidad total de SKU en el sistema
2. **Bajo Stock** - Productos con cantidad ≤ Stock Mínimo
3. **Stock Agotado** - Productos con 0 unidades
4. **Total de Movimientos** - Historial completo de operaciones
5. **Top 5 Productos** - Los más movidos en la historia

---

## 🚀 Mejoras Futuras Sugeridas

Para versiones posteriores o con backend:

- [ ] Autenticación con contraseña hash
- [ ] Backend con API REST (Node.js, Python, etc.)
- [ ] Base de datos SQL (MySQL, PostgreSQL)
- [ ] Sincronización en tiempo real
- [ ] Reportes exportables (PDF, Excel)
- [ ] Gráficos avanzados (Chart.js, D3.js)
- [ ] Sistema de permisos granular
- [ ] Auditoría completa de operaciones
- [ ] Notificaciones por bajo stock
- [ ] Códigos QR para productos
- [ ] Integración con proveedores
- [ ] App móvil nativa

---

## 📝 Changelog

### Versión 1.0.0 (Inicial)
- ✅ CRUD completo de productos
- ✅ Gestión de categorías
- ✅ Sistema de roles (Admin + Empleado)
- ✅ Historial de movimientos
- ✅ Reportes y estadísticas
- ✅ Búsqueda y filtros
- ✅ localStorage para persistencia
- ✅ Interfaz responsiva con Bootstrap 5

---

## 📞 Soporte y Contacto

Para preguntas o mejoras, considera:

- Revisar lógica en `app.js`
- Modificar estilos en `styles.css`
- Actualizar estructura en `index.html`

---

## 📄 Licencia

Este proyecto es de uso educativo. Libre para modificación y distribución.

---

**Desarrollado con ❤️ para gestión de inventario profesional**

*Última actualización: 18 de Febrero de 2026*
