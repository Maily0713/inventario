// ================================
// GESTOR DE INVENTARIO - APP.JS
// ================================

// Estados globales
let currentUser = null;
let currentUserRole = null;
let currentEditingProductId = null;
let currentEditingCategoryId = null;

// ================================
// ESTRUCTURA DE DATOS
// ================================

const DATA_STRUCTURE = {
    usuarios: {
        admin: { password: 'password', role: 'admin', nombre: 'Administrador' },
        empleado: { password: 'password', role: 'empleado', nombre: 'Empleado General' }
    },
    productos: [],
    categorias: [],
    movimientos: []
};

// ================================
// INICIALIZACIÓN
// ================================

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initializeSampleData();
    initializeEventListeners();
    showLoginView();
});

// ================================
// CARGA Y ALMACENAMIENTO
// ================================

function loadData() {
    const data = localStorage.getItem('inventoryData');
    if (data) {
        const parsed = JSON.parse(data);
        DATA_STRUCTURE.productos = parsed.productos || [];
        DATA_STRUCTURE.categorias = parsed.categorias || [];
        DATA_STRUCTURE.movimientos = parsed.movimientos || [];
    }
}

function saveData() {
    const dataToSave = {
        productos: DATA_STRUCTURE.productos,
        categorias: DATA_STRUCTURE.categorias,
        movimientos: DATA_STRUCTURE.movimientos
    };
    localStorage.setItem('inventoryData', JSON.stringify(dataToSave));
}

function initializeSampleData() {
    // Siempre inicializar si los arrays están vacíos
    if (DATA_STRUCTURE.categorias.length === 0 && DATA_STRUCTURE.productos.length === 0) {
        DATA_STRUCTURE.categorias = [
            { id: '1', nombre: 'Electrónica', descripcion: 'Productos electrónicos' },
            { id: '2', nombre: 'Ropa', descripcion: 'Prendas de vestir' },
            { id: '3', nombre: 'Alimentos', descripcion: 'Productos alimenticios' },
            { id: '4', nombre: 'Hogar', descripcion: 'Artículos para el hogar' }
        ];

        DATA_STRUCTURE.productos = [
            { 
                id: '1', 
                codigo: 'ELEC001', 
                nombre: 'Laptop Dell XPS 13', 
                categoria: '1', 
                descripcion: 'Laptop ultrafina de alta performance',
                stock: 45, 
                stockMinimo: 10, 
                precio: 999.99 
            },
            { 
                id: '2', 
                codigo: 'ELEC002', 
                nombre: 'Mouse Inalámbrico', 
                categoria: '1', 
                descripcion: 'Mouse inalámbrico con batería',
                stock: 120, 
                stockMinimo: 20, 
                precio: 29.99 
            },
            { 
                id: '3', 
                codigo: 'ROPA001', 
                nombre: 'Camiseta Algodón', 
                categoria: '2', 
                descripcion: 'Camiseta 100% algodón',
                stock: 8, 
                stockMinimo: 15, 
                precio: 19.99 
            },
            { 
                id: '4', 
                codigo: 'ALI001', 
                nombre: 'Café Premium 500g', 
                categoria: '3', 
                descripcion: 'Café de grano entero',
                stock: 0, 
                stockMinimo: 25, 
                precio: 12.99 
            },
            { 
                id: '5', 
                codigo: 'HOG001', 
                nombre: 'Lámpara LED', 
                categoria: '4', 
                descripcion: 'Lámpara de escritorio LED',
                stock: 35, 
                stockMinimo: 10, 
                precio: 45.99 
            }
        ];

        saveData();
    }
}

// ================================
// LISTENERS DE EVENTOS
// ================================

function initializeEventListeners() {
    // LOGIN
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // ADMIN LOGOUT
    document.getElementById('adminLogout').addEventListener('click', handleLogout);
    document.getElementById('empleadoLogout').addEventListener('click', handleLogout);

    // ADMIN TABS
    document.querySelectorAll('#adminTabs .nav-link').forEach(link => {
        link.addEventListener('click', handleAdminTabChange);
    });

    // EMPLEADO TABS
    document.querySelectorAll('#empleadoTabs .nav-link').forEach(link => {
        link.addEventListener('click', handleEmpleadoTabChange);
    });

    // PRODUCTOS - ADMIN
    document.getElementById('btnNuevoProducto').addEventListener('click', openNewProductModal);
    document.getElementById('formProducto').addEventListener('submit', handleProductoSubmit);
    document.getElementById('searchProductos').addEventListener('input', filterProductos);
    document.getElementById('filterCategoria').addEventListener('change', filterProductos);

    // CATEGORÍAS - ADMIN
    document.getElementById('btnNuevaCategoria').addEventListener('click', openNewCategoriaModal);
    document.getElementById('formCategoria').addEventListener('submit', handleCategoriaSubmit);

    // MOVIMIENTOS - EMPLEADO
    document.getElementById('formMovimiento').addEventListener('submit', handleMovimientoSubmit);
    document.getElementById('movProducto').addEventListener('change', updateMovimientoProductInfo);

    // BÚSQUEDAS - EMPLEADO
    document.getElementById('searchInventario').addEventListener('input', filterInventario);
    document.getElementById('filterCategoriaEmpleado').addEventListener('change', filterInventario);
    document.getElementById('searchMisMovimientos').addEventListener('input', filterMisMovimientos);

    // BÚSQUEDAS - ADMIN
    document.getElementById('searchMovimientos').addEventListener('input', filterMovimientos);
    document.getElementById('filterTipoMovimiento').addEventListener('change', filterMovimientos);
}

// ================================
// AUTENTICACIÓN
// ================================

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPassword').value;

    const user = DATA_STRUCTURE.usuarios[username];

    if (!user) {
        showAlert('Usuario no encontrado', 'danger');
        return;
    }

    if (user.password !== password) {
        showAlert('Contraseña incorrecta', 'danger');
        return;
    }

    currentUser = username;
    currentUserRole = user.role;

    showAlert(`¡Bienvenido ${user.nombre}!`, 'success');

    setTimeout(() => {
        if (currentUserRole === 'admin') {
            showAdminView();
        } else {
            showEmpleadoView();
        }
    }, 500);
}

function handleLogout() {
    currentUser = null;
    currentUserRole = null;
    document.getElementById('loginForm').reset();
    showLoginView();
    showAlert('Sesión cerrada correctamente', 'info');
}

// ================================
// NAVEGACIÓN DE VISTAS
// ================================

function showLoginView() {
    document.getElementById('loginView').classList.remove('d-none');
    document.getElementById('adminView').classList.add('d-none');
    document.getElementById('empleadoView').classList.add('d-none');
}

function showAdminView() {
    document.getElementById('loginView').classList.add('d-none');
    document.getElementById('adminView').classList.remove('d-none');
    document.getElementById('empleadoView').classList.add('d-none');
    document.getElementById('adminUserName').textContent = DATA_STRUCTURE.usuarios['admin'].nombre;
    
    // Cargar datos iniciales
    loadProductosTable();
    loadCategoriasTab();
    loadMovimientosTable();
    loadReportes();
    updateCategoryFilters();
}

function showEmpleadoView() {
    document.getElementById('loginView').classList.add('d-none');
    document.getElementById('adminView').classList.add('d-none');
    document.getElementById('empleadoView').classList.remove('d-none');
    document.getElementById('empleadoUserName').textContent = DATA_STRUCTURE.usuarios['empleado'].nombre;
    
    // Cargar datos iniciales
    loadProductosMovimientoForm();
    loadInventarioTabla();
    loadMisMovimientos();
    updateCategoryFiltersEmpleado();
}

// ================================
// CAMBIO DE TABS
// ================================

function handleAdminTabChange(e) {
    e.preventDefault();
    const tabName = e.target.getAttribute('data-tab');

    document.querySelectorAll('#adminTabs .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    e.target.classList.add('active');

    document.querySelectorAll('#adminView .tab-content').forEach(tab => {
        tab.classList.add('d-none');
    });

    const tabElement = document.getElementById(tabName + 'Tab');
    if (tabElement) {
        tabElement.classList.remove('d-none');
        
        if (tabName === 'movimientos') {
            loadMovimientosTable();
        } else if (tabName === 'reportes') {
            loadReportes();
        }
    }
}

function handleEmpleadoTabChange(e) {
    e.preventDefault();
    const tabName = e.target.getAttribute('data-tab');

    document.querySelectorAll('#empleadoTabs .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    e.target.classList.add('active');

    document.querySelectorAll('#empleadoView .tab-content').forEach(tab => {
        tab.classList.add('d-none');
    });

    let tabElement;
    
    if (tabName === 'movimientos-empleado') {
        tabElement = document.getElementById('movimientosEmpleadoTab');
    } else if (tabName === 'consulta-inventario') {
        tabElement = document.getElementById('consultaInventarioTab');
        loadInventarioTabla();
    } else if (tabName === 'mis-movimientos') {
        tabElement = document.getElementById('misMovimientosTab');
        loadMisMovimientos();
    }
    
    if (tabElement) {
        tabElement.classList.remove('d-none');
    }
}

// ================================
// GESTIÓN DE PRODUCTOS
// ================================

function loadProductosTable() {
    const tbody = document.getElementById('productosTableBody');
    if (DATA_STRUCTURE.productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay productos registrados</td></tr>';
        return;
    }

    tbody.innerHTML = DATA_STRUCTURE.productos.map(prod => {
        const categoria = getCategoriaById(prod.categoria);
        const stockAlert = prod.stock === 0 ? 'danger' : 
                          prod.stock <= prod.stockMinimo ? 'warning' : 'success';
        const stockBadge = prod.stock === 0 ? 'Agotado' : 
                          prod.stock <= prod.stockMinimo ? 'Bajo Stock' : 'Normal';

        return `
            <tr>
                <td><strong>${prod.codigo}</strong></td>
                <td>${prod.nombre}</td>
                <td>${categoria ? categoria.nombre : 'Sin categoría'}</td>
                <td>
                    <strong>${prod.stock}</strong>
                </td>
                <td>${prod.stockMinimo}</td>
                <td>$${prod.precio.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editProducto('${prod.id}')">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <span class="badge badge-${stockAlert}">${stockBadge}</span>
                </td>
            </tr>
        `;
    }).join('');
}

function openNewProductModal() {
    currentEditingProductId = null;
    document.getElementById('formProducto').reset();
    document.getElementById('modalProductoTitle').textContent = 'Nuevo Producto';
    document.getElementById('btnEliminarProducto').classList.add('d-none');
    document.getElementById('prodStock').value = '0';
    document.getElementById('prodStockMin').value = '0';
    document.getElementById('prodPrecio').value = '0.00';
    
    updateProductoCategoriasSelect();
    new bootstrap.Modal(document.getElementById('modalProducto')).show();
}

function editProducto(prodId) {
    currentEditingProductId = prodId;
    const producto = DATA_STRUCTURE.productos.find(p => p.id === prodId);
    
    if (!producto) return;

    document.getElementById('prodCodigo').value = producto.codigo;
    document.getElementById('prodNombre').value = producto.nombre;
    document.getElementById('prodDescripcion').value = producto.descripcion || '';
    document.getElementById('prodStock').value = producto.stock;
    document.getElementById('prodStockMin').value = producto.stockMinimo;
    document.getElementById('prodPrecio').value = producto.precio;
    
    updateProductoCategoriasSelect();
    document.getElementById('prodCategoria').value = producto.categoria;
    
    document.getElementById('modalProductoTitle').textContent = 'Editar Producto';
    document.getElementById('btnEliminarProducto').classList.remove('d-none');
    document.getElementById('btnEliminarProducto').onclick = () => deleteProducto(prodId);
    
    new bootstrap.Modal(document.getElementById('modalProducto')).show();
}

function updateProductoCategoriasSelect() {
    const select = document.getElementById('prodCategoria');
    select.innerHTML = '<option value="">Seleccionar categoría...</option>' +
        DATA_STRUCTURE.categorias.map(cat => 
            `<option value="${cat.id}">${cat.nombre}</option>`
        ).join('');
}

function handleProductoSubmit(e) {
    e.preventDefault();
    
    const codigo = document.getElementById('prodCodigo').value.trim();
    const nombre = document.getElementById('prodNombre').value.trim();
    const categoria = document.getElementById('prodCategoria').value;
    const descripcion = document.getElementById('prodDescripcion').value.trim();
    const stock = parseInt(document.getElementById('prodStock').value) || 0;
    const stockMinimo = parseInt(document.getElementById('prodStockMin').value) || 0;
    const precio = parseFloat(document.getElementById('prodPrecio').value) || 0;

    if (!codigo || !nombre || !categoria) {
        showAlert('Por favor completa todos los campos obligatorios', 'warning');
        return;
    }

    if (currentEditingProductId) {
        // Actualizar
        const producto = DATA_STRUCTURE.productos.find(p => p.id === currentEditingProductId);
        if (producto) {
            producto.codigo = codigo;
            producto.nombre = nombre;
            producto.categoria = categoria;
            producto.descripcion = descripcion;
            producto.stockMinimo = stockMinimo;
            producto.precio = precio;
            // No cambiar el stock al editar
            
            showAlert('Producto actualizado correctamente', 'success');
        }
    } else {
        // Crear nuevo
        const nuevoProducto = {
            id: generateId(),
            codigo,
            nombre,
            categoria,
            descripcion,
            stock,
            stockMinimo,
            precio
        };
        
        DATA_STRUCTURE.productos.push(nuevoProducto);
        showAlert('Producto creado correctamente', 'success');
    }

    saveData();
    loadProductosTable();
    bootstrap.Modal.getInstance(document.getElementById('modalProducto')).hide();
    currentEditingProductId = null;
}

function deleteProducto(prodId) {
    if(!confirm('¿Está seguro que desea eliminar este producto?')) return;
    
    DATA_STRUCTURE.productos = DATA_STRUCTURE.productos.filter(p => p.id !== prodId);
    saveData();
    showAlert('Producto eliminado correctamente', 'success');
    loadProductosTable();
    bootstrap.Modal.getInstance(document.getElementById('modalProducto')).hide();
}

function filterProductos() {
    const search = document.getElementById('searchProductos').value.toLowerCase();
    const categoria = document.getElementById('filterCategoria').value;

    const tbody = document.getElementById('productosTableBody');
    let filtered = DATA_STRUCTURE.productos.filter(prod => {
        const matchSearch = prod.nombre.toLowerCase().includes(search) || 
                           prod.codigo.toLowerCase().includes(search);
        const matchCategoria = !categoria || prod.categoria === categoria;
        return matchSearch && matchCategoria;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay productos que coincidan con el filtro</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(prod => {
        const categoriaObj = getCategoriaById(prod.categoria);
        const stockAlert = prod.stock === 0 ? 'danger' : 
                          prod.stock <= prod.stockMinimo ? 'warning' : 'success';
        const stockBadge = prod.stock === 0 ? 'Agotado' : 
                          prod.stock <= prod.stockMinimo ? 'Bajo Stock' : 'Normal';

        return `
            <tr>
                <td><strong>${prod.codigo}</strong></td>
                <td>${prod.nombre}</td>
                <td>${categoriaObj ? categoriaObj.nombre : 'Sin categoría'}</td>
                <td><strong>${prod.stock}</strong></td>
                <td>${prod.stockMinimo}</td>
                <td>$${prod.precio.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editProducto('${prod.id}')">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <span class="badge badge-${stockAlert}">${stockBadge}</span>
                </td>
            </tr>
        `;
    }).join('');
}

// ================================
// GESTIÓN DE CATEGORÍAS
// ================================

function loadCategoriasTab() {
    const container = document.getElementById('categoriasList');
    
    if (DATA_STRUCTURE.categorias.length === 0) {
        container.innerHTML = '<div class="list-group-item text-center text-muted">No hay categorías</div>';
        return;
    }

    container.innerHTML = DATA_STRUCTURE.categorias.map(cat => `
        <div class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <h6 class="mb-1">${cat.nombre}</h6>
                <small class="text-muted">${cat.descripcion || 'Sin descripción'}</small>
            </div>
            <div>
                <button class="btn btn-sm btn-warning me-2" onclick="editCategoria('${cat.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCategoria('${cat.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function openNewCategoriaModal() {
    currentEditingCategoryId = null;
    document.getElementById('formCategoria').reset();
    document.getElementById('btnEliminarCategoria').classList.add('d-none');
    new bootstrap.Modal(document.getElementById('modalCategoria')).show();
}

function editCategoria(catId) {
    currentEditingCategoryId = catId;
    const categoria = DATA_STRUCTURE.categorias.find(c => c.id === catId);
    
    if (!categoria) return;

    document.getElementById('catNombre').value = categoria.nombre;
    document.getElementById('catDescripcion').value = categoria.descripcion || '';
    document.getElementById('btnEliminarCategoria').classList.remove('d-none');
    document.getElementById('btnEliminarCategoria').onclick = () => deleteCategoria(catId);
    
    new bootstrap.Modal(document.getElementById('modalCategoria')).show();
}

function handleCategoriaSubmit(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('catNombre').value.trim();
    const descripcion = document.getElementById('catDescripcion').value.trim();

    if (!nombre) {
        showAlert('El nombre es obligatorio', 'warning');
        return;
    }

    if (currentEditingCategoryId) {
        const categoria = DATA_STRUCTURE.categorias.find(c => c.id === currentEditingCategoryId);
        if (categoria) {
            categoria.nombre = nombre;
            categoria.descripcion = descripcion;
            showAlert('Categoría actualizada correctamente', 'success');
        }
    } else {
        DATA_STRUCTURE.categorias.push({
            id: generateId(),
            nombre,
            descripcion
        });
        showAlert('Categoría creada correctamente', 'success');
    }

    saveData();
    loadCategoriasTab();
    updateCategoryFilters();
    updateProductoCategoriasSelect();
    bootstrap.Modal.getInstance(document.getElementById('modalCategoria')).hide();
}

function deleteCategoria(catId) {
    if (!confirm('¿Está seguro? Los productos de esta categoría no se eliminarán')) return;
    
    DATA_STRUCTURE.categorias = DATA_STRUCTURE.categorias.filter(c => c.id !== catId);
    saveData();
    showAlert('Categoría eliminada correctamente', 'success');
    loadCategoriasTab();
    updateCategoryFilters();
    bootstrap.Modal.getInstance(document.getElementById('modalCategoria')).hide();
}

function updateCategoryFilters() {
    const select = document.getElementById('filterCategoria');
    select.innerHTML = '<option value="">Todas las categorías</option>' +
        DATA_STRUCTURE.categorias.map(cat => 
            `<option value="${cat.id}">${cat.nombre}</option>`
        ).join('');
}

function updateCategoryFiltersEmpleado() {
    const select = document.getElementById('filterCategoriaEmpleado');
    select.innerHTML = '<option value="">Todas las categorías</option>' +
        DATA_STRUCTURE.categorias.map(cat => 
            `<option value="${cat.id}">${cat.nombre}</option>`
        ).join('');
}

// ================================
// GESTIÓN DE MOVIMIENTOS - EMPLEADO
// ================================

function loadProductosMovimientoForm() {
    const select = document.getElementById('movProducto');
    select.innerHTML = '<option value="">Seleccionar producto...</option>' +
        DATA_STRUCTURE.productos.map(prod => 
            `<option value="${prod.id}">${prod.nombre} (${prod.codigo}) - Stock: ${prod.stock}</option>`
        ).join('');
}

function updateMovimientoProductInfo() {
    const prodId = document.getElementById('movProducto').value;
    const producto = DATA_STRUCTURE.productos.find(p => p.id === prodId);
    // Aquí se podría mostrar info del producto si lo necesitamos
}

function handleMovimientoSubmit(e) {
    e.preventDefault();
    
    const prodId = document.getElementById('movProducto').value;
    const tipo = document.getElementById('movTipo').value;
    const cantidad = parseInt(document.getElementById('movCantidad').value) || 0;
    const razon = document.getElementById('movRazon').value.trim();

    if (!prodId || !tipo || cantidad <= 0) {
        showAlert('Por favor completa todos los campos requeridos', 'warning');
        return;
    }

    const producto = DATA_STRUCTURE.productos.find(p => p.id === prodId);
    if (!producto) {
        showAlert('Producto no encontrado', 'danger');
        return;
    }

    // Validar stock para salidas
    if (tipo === 'salida' && producto.stock < cantidad) {
        showAlert(`Stock insuficiente. Disponible: ${producto.stock}`, 'danger');
        return;
    }

    // Registrar movimiento
    const stockAnterior = producto.stock;
    
    if (tipo === 'entrada') {
        producto.stock += cantidad;
    } else {
        producto.stock -= cantidad;
    }

    const movimiento = {
        id: generateId(),
        fecha: new Date().toLocaleDateString('es-ES'),
        hora: new Date().toLocaleTimeString('es-ES'),
        productId: prodId,
        tipo,
        cantidad,
        razon,
        usuario: currentUser,
        stockAnterior,
        stockNuevo: producto.stock
    };

    DATA_STRUCTURE.movimientos.push(movimiento);
    saveData();

    showAlert(`Movimiento registrado correctamente. Stock actualizado: ${stockAnterior} → ${producto.stock}`, 'success');
    document.getElementById('formMovimiento').reset();
    loadProductosMovimientoForm();
    loadInventarioTabla();
}

function loadInventarioTabla() {
    const tbody = document.getElementById('inventarioTableBody');
    
    if (DATA_STRUCTURE.productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay productos</td></tr>';
        return;
    }

    tbody.innerHTML = DATA_STRUCTURE.productos.map(prod => {
        const categoria = getCategoriaById(prod.categoria);
        let estado = '<span class="badge badge-success">Normal</span>';
        
        if (prod.stock === 0) {
            estado = '<span class="badge badge-danger">Agotado</span>';
        } else if (prod.stock <= prod.stockMinimo) {
            estado = '<span class="badge badge-warning">Bajo Stock</span>';
        }

        return `
            <tr>
                <td>${prod.codigo}</td>
                <td>${prod.nombre}</td>
                <td>${categoria ? categoria.nombre : 'Sin categoría'}</td>
                <td><strong>${prod.stock}</strong></td>
                <td>$${prod.precio.toFixed(2)}</td>
                <td>${estado}</td>
            </tr>
        `;
    }).join('');
}

function filterInventario() {
    const search = document.getElementById('searchInventario').value.toLowerCase();
    const categoria = document.getElementById('filterCategoriaEmpleado').value;

    let filtered = DATA_STRUCTURE.productos.filter(prod => {
        const matchSearch = prod.nombre.toLowerCase().includes(search) || 
                           prod.codigo.toLowerCase().includes(search);
        const matchCategoria = !categoria || prod.categoria === categoria;
        return matchSearch && matchCategoria;
    });

    const tbody = document.getElementById('inventarioTableBody');
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay productos que coincidan</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(prod => {
        const categoria = getCategoriaById(prod.categoria);
        let estado = '<span class="badge badge-success">Normal</span>';
        
        if (prod.stock === 0) {
            estado = '<span class="badge badge-danger">Agotado</span>';
        } else if (prod.stock <= prod.stockMinimo) {
            estado = '<span class="badge badge-warning">Bajo Stock</span>';
        }

        return `
            <tr>
                <td>${prod.codigo}</td>
                <td>${prod.nombre}</td>
                <td>${categoria ? categoria.nombre : 'Sin categoría'}</td>
                <td><strong>${prod.stock}</strong></td>
                <td>$${prod.precio.toFixed(2)}</td>
                <td>${estado}</td>
            </tr>
        `;
    }).join('');
}

// ================================
// HISTORIAL DE MOVIMIENTOS
// ================================

function loadMovimientosTable() {
    const tbody = document.getElementById('movimientosTableBody');
    
    if (DATA_STRUCTURE.movimientos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No hay movimientos registrados</td></tr>';
        return;
    }

    tbody.innerHTML = DATA_STRUCTURE.movimientos.map(mov => {
        const producto = DATA_STRUCTURE.productos.find(p => p.id === mov.productId);
        const tipoClass = mov.tipo === 'entrada' ? 'success' : 'danger';
        const tipoLabel = mov.tipo === 'entrada' ? 'Entrada' : 'Salida';

        return `
            <tr>
                <td>${mov.fecha}</td>
                <td>${mov.hora}</td>
                <td>${producto ? producto.nombre : 'Producto eliminado'}</td>
                <td><span class="badge badge-${tipoClass}">${tipoLabel}</span></td>
                <td>${mov.cantidad}</td>
                <td>${mov.razon || '-'}</td>
                <td>${mov.usuario}</td>
                <td>${mov.stockAnterior}</td>
                <td><strong>${mov.stockNuevo}</strong></td>
            </tr>
        `;
    }).join('');
}

function filterMovimientos() {
    const search = document.getElementById('searchMovimientos').value.toLowerCase();
    const tipo = document.getElementById('filterTipoMovimiento').value;

    let filtered = DATA_STRUCTURE.movimientos.filter(mov => {
        const producto = DATA_STRUCTURE.productos.find(p => p.id === mov.productId);
        const matchSearch = producto && (
            producto.nombre.toLowerCase().includes(search) || 
            producto.codigo.toLowerCase().includes(search)
        );
        const matchTipo = !tipo || mov.tipo === tipo;
        return matchSearch && matchTipo;
    });

    const tbody = document.getElementById('movimientosTableBody');
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No hay movimientos que coincidan</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(mov => {
        const producto = DATA_STRUCTURE.productos.find(p => p.id === mov.productId);
        const tipoClass = mov.tipo === 'entrada' ? 'success' : 'danger';
        const tipoLabel = mov.tipo === 'entrada' ? 'Entrada' : 'Salida';

        return `
            <tr>
                <td>${mov.fecha}</td>
                <td>${mov.hora}</td>
                <td>${producto ? producto.nombre : 'Producto eliminado'}</td>
                <td><span class="badge badge-${tipoClass}">${tipoLabel}</span></td>
                <td>${mov.cantidad}</td>
                <td>${mov.razon || '-'}</td>
                <td>${mov.usuario}</td>
                <td>${mov.stockAnterior}</td>
                <td><strong>${mov.stockNuevo}</strong></td>
            </tr>
        `;
    }).join('');
}

function loadMisMovimientos() {
    const tbody = document.getElementById('misMovimientosTableBody');
    const misMovs = DATA_STRUCTURE.movimientos.filter(m => m.usuario === currentUser);
    
    if (misMovs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No has registrado movimientos</td></tr>';
        return;
    }

    tbody.innerHTML = misMovs.map(mov => {
        const producto = DATA_STRUCTURE.productos.find(p => p.id === mov.productId);
        const tipoClass = mov.tipo === 'entrada' ? 'success' : 'danger';
        const tipoLabel = mov.tipo === 'entrada' ? 'Entrada' : 'Salida';

        return `
            <tr>
                <td>${mov.fecha}</td>
                <td>${mov.hora}</td>
                <td>${producto ? producto.nombre : 'Producto eliminado'}</td>
                <td><span class="badge badge-${tipoClass}">${tipoLabel}</span></td>
                <td>${mov.cantidad}</td>
                <td>${mov.razon || '-'}</td>
            </tr>
        `;
    }).join('');
}

function filterMisMovimientos() {
    const search = document.getElementById('searchMisMovimientos').value.toLowerCase();
    const misMovs = DATA_STRUCTURE.movimientos.filter(m => m.usuario === currentUser);

    let filtered = misMovs.filter(mov => {
        const producto = DATA_STRUCTURE.productos.find(p => p.id === mov.productId);
        return producto && (
            producto.nombre.toLowerCase().includes(search) || 
            producto.codigo.toLowerCase().includes(search)
        );
    });

    const tbody = document.getElementById('misMovimientosTableBody');
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay movimientos que coincidan</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(mov => {
        const producto = DATA_STRUCTURE.productos.find(p => p.id === mov.productId);
        const tipoClass = mov.tipo === 'entrada' ? 'success' : 'danger';
        const tipoLabel = mov.tipo === 'entrada' ? 'Entrada' : 'Salida';

        return `
            <tr>
                <td>${mov.fecha}</td>
                <td>${mov.hora}</td>
                <td>${producto ? producto.nombre : 'Producto eliminado'}</td>
                <td><span class="badge badge-${tipoClass}">${tipoLabel}</span></td>
                <td>${mov.cantidad}</td>
                <td>${mov.razon || '-'}</td>
            </tr>
        `;
    }).join('');
}

// ================================
// REPORTES Y ESTADÍSTICAS
// ================================

function loadReportes() {
    // Estadísticas principales
    const totalProductos = DATA_STRUCTURE.productos.length;
    const bajoStock = DATA_STRUCTURE.productos.filter(p => p.stock > 0 && p.stock <= p.stockMinimo).length;
    const sinStock = DATA_STRUCTURE.productos.filter(p => p.stock === 0).length;
    const totalMovimientos = DATA_STRUCTURE.movimientos.length;

    document.getElementById('estadTotalProductos').textContent = totalProductos;
    document.getElementById('estadBajoStock').textContent = bajoStock;
    document.getElementById('estadSinStock').textContent = sinStock;
    document.getElementById('estadTotalMovimientos').textContent = totalMovimientos;

    // Productos con bajo stock
    const productosConBajoStock = DATA_STRUCTURE.productos.filter(p => 
        p.stock === 0 || p.stock <= p.stockMinimo
    ).sort((a, b) => a.stock - b.stock);

    const bajStockContainer = document.getElementById('reporteBajoStock');
    if (productosConBajoStock.length === 0) {
        bajStockContainer.innerHTML = '<div class="list-group-item text-center text-muted">Todos los productos tienen stock normal</div>';
    } else {
        bajStockContainer.innerHTML = productosConBajoStock.map(prod => {
            const statusClass = prod.stock === 0 ? 'danger' : 'warning';
            return `
                <div class="list-group-item d-flex justify-content-between">
                    <div>
                        <h6 class="mb-1">${prod.nombre}</h6>
                        <small class="text-muted">${prod.codigo}</small>
                    </div>
                    <div class="text-end">
                        <strong class="text-${statusClass}">${prod.stock} unidades</strong><br>
                        <small class="text-muted">Mín: ${prod.stockMinimo}</small>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Top 5 productos más movidos
    const movimientosContados = {};
    DATA_STRUCTURE.movimientos.forEach(mov => {
        movimientosContados[mov.productId] = (movimientosContados[mov.productId] || 0) + 1;
    });

    const topProductos = Object.entries(movimientosContados)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([prodId, count]) => {
            const producto = DATA_STRUCTURE.productos.find(p => p.id === prodId);
            return { producto, count };
        })
        .filter(item => item.producto);

    const topContainer = document.getElementById('reporteTopProductos');
    if (topProductos.length === 0) {
        topContainer.innerHTML = '<div class="list-group-item text-center text-muted">No hay movimientos</div>';
    } else {
        topContainer.innerHTML = topProductos.map((item, index) => `
            <div class="list-group-item d-flex justify-content-between">
                <div>
                    <h6 class="mb-1">${index + 1}. ${item.producto.nombre}</h6>
                    <small class="text-muted">${item.producto.codigo}</small>
                </div>
                <div class="text-end">
                    <strong class="text-info">${item.count} movimientos</strong>
                </div>
            </div>
        `).join('');
    }
}

// ================================
// FUNCIONES AUXILIARES
// ================================

function getCategoriaById(catId) {
    return DATA_STRUCTURE.categorias.find(c => c.id === catId);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function showAlert(mensaje, tipo = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 250px;';
    alertDiv.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    const bsAlert = new bootstrap.Alert(alertDiv);
    setTimeout(() => {
        bsAlert.close();
        alertDiv.remove();
    }, 4000);
}

// ================================
// EXPORTAR FUNCIONES GLOBALES
// ================================

window.editProducto = editProducto;
window.deleteProducto = deleteProducto;
window.editCategoria = editCategoria;
window.deleteCategoria = deleteCategoria;
window.openNewProductModal = openNewProductModal;
window.openNewCategoriaModal = openNewCategoriaModal;
