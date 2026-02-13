-- 1. Crear base de datos

-- Base principal del ERP
CREATE DATABASE ERPZapateria;
GO

USE ERPZapateria;
GO

-- 2. Creacion de Tablas

-- Catalogo de roles de acceso
CREATE TABLE Roles (
    IdRol INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL UNIQUE,
    Activo BIT NOT NULL DEFAULT 1
);

-- Usuarios del sistema
CREATE TABLE Usuarios (
    IdUsuario INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    IdRol INT NOT NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Clientes finales
CREATE TABLE Clientes (
    IdCliente INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(150) NOT NULL,
    NIT NVARCHAR(20),
    Email NVARCHAR(100),
    Telefono NVARCHAR(20),
    Direccion NVARCHAR(250),
    Activo BIT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
);

-- Categorias de producto
CREATE TABLE Categorias (
    IdCategoria INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Activo BIT NOT NULL DEFAULT 1
);

-- Productos disponibles en catalogo
CREATE TABLE Productos (
    IdProducto INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(150) NOT NULL,
    Descripcion NVARCHAR(300),
    Precio DECIMAL(18,2) NOT NULL,
    IdCategoria INT NOT NULL,
    StockMinimo INT NOT NULL DEFAULT 0,
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE()
);

-- Stock por producto
CREATE TABLE Inventario (
    IdInventario INT IDENTITY(1,1) PRIMARY KEY,
    IdProducto INT NOT NULL,
    CantidadDisponible INT NOT NULL DEFAULT 0,
    UltimaActualizacion DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT UQ_Inventario_Producto UNIQUE (IdProducto)
);

-- Movimientos de entrada y salida
CREATE TABLE MovimientosInventario (
    IdMovimiento INT IDENTITY(1,1) PRIMARY KEY,
    IdProducto INT NOT NULL,
    TipoMovimiento NVARCHAR(20) NOT NULL, -- Entrada / Salida
    Cantidad INT NOT NULL,
    Referencia NVARCHAR(100),
    Fecha DATETIME NOT NULL DEFAULT GETDATE()
);

-- Encabezado de pedidos
CREATE TABLE Pedidos (
    IdPedido INT IDENTITY(1,1) PRIMARY KEY,
    IdCliente INT NOT NULL,
    IdUsuario INT NOT NULL,
    Fecha DATETIME NOT NULL DEFAULT GETDATE(),
    Total DECIMAL(18,2) NOT NULL,
    Estado NVARCHAR(50) NOT NULL DEFAULT 'Pendiente'
);

-- Lineas de pedido
CREATE TABLE PedidoDetalle (
    IdDetalle INT IDENTITY(1,1) PRIMARY KEY,
    IdPedido INT NOT NULL,
    IdProducto INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(18,2) NOT NULL,
    Subtotal DECIMAL(18,2) NOT NULL
);

-- Proveedores
CREATE TABLE Proveedores (
    IdProveedor INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(150) NOT NULL,
    Telefono NVARCHAR(20),
    Email NVARCHAR(100),
    Activo BIT NOT NULL DEFAULT 1
);

-- Encabezado de compras
CREATE TABLE Compras (
    IdCompra INT IDENTITY(1,1) PRIMARY KEY,
    IdProveedor INT NOT NULL,
    Fecha DATETIME NOT NULL DEFAULT GETDATE(),
    Total DECIMAL(18,2) NOT NULL
);

-- Lineas de compra
CREATE TABLE CompraDetalle (
    IdDetalleCompra INT IDENTITY(1,1) PRIMARY KEY,
    IdCompra INT NOT NULL,
    IdProducto INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(18,2) NOT NULL,
    Subtotal DECIMAL(18,2) NOT NULL
);

-- Registro simple de eventos
CREATE TABLE Logs (
    IdLog INT IDENTITY(1,1) PRIMARY KEY,
    Nivel NVARCHAR(50),
    Mensaje NVARCHAR(MAX),
    StackTrace NVARCHAR(MAX),
    Fecha DATETIME NOT NULL DEFAULT GETDATE()
);

-- 3. Indices

-- Busqueda rapida de usuarios y productos
CREATE INDEX IX_Usuarios_Username ON Usuarios(Username);
CREATE INDEX IX_Productos_Nombre ON Productos(Nombre);
CREATE INDEX IX_Productos_Categoria ON Productos(IdCategoria);
CREATE INDEX IX_Movimientos_Producto ON MovimientosInventario(IdProducto);
CREATE INDEX IX_PedidoDetalle_Pedido ON PedidoDetalle(IdPedido);
CREATE INDEX IX_PedidoDetalle_Producto ON PedidoDetalle(IdProducto);

-- 4. Relaciones

-- Usuarios -> Roles
ALTER TABLE Usuarios
ADD CONSTRAINT FK_Usuarios_Roles
    FOREIGN KEY (IdRol) REFERENCES Roles(IdRol);

-- Productos -> Categorias
ALTER TABLE Productos
ADD CONSTRAINT FK_Productos_Categorias
    FOREIGN KEY (IdCategoria) REFERENCES Categorias(IdCategoria);

-- Inventario -> Productos
ALTER TABLE Inventario
ADD CONSTRAINT FK_Inventario_Productos
    FOREIGN KEY (IdProducto) REFERENCES Productos(IdProducto);

-- MovimientosInventario -> Productos
ALTER TABLE MovimientosInventario
ADD CONSTRAINT FK_Movimientos_Producto
    FOREIGN KEY (IdProducto) REFERENCES Productos(IdProducto);

-- Pedidos -> Clientes / Usuarios
ALTER TABLE Pedidos
ADD CONSTRAINT FK_Pedidos_Clientes
    FOREIGN KEY (IdCliente) REFERENCES Clientes(IdCliente);

ALTER TABLE Pedidos
ADD CONSTRAINT FK_Pedidos_Usuarios
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario);

-- PedidoDetalle -> Pedidos / Productos
ALTER TABLE PedidoDetalle
ADD CONSTRAINT FK_PedidoDetalle_Pedido
    FOREIGN KEY (IdPedido) REFERENCES Pedidos(IdPedido);

ALTER TABLE PedidoDetalle
ADD CONSTRAINT FK_PedidoDetalle_Producto
    FOREIGN KEY (IdProducto) REFERENCES Productos(IdProducto);

-- Compras -> Proveedores
ALTER TABLE Compras
ADD CONSTRAINT FK_Compras_Proveedor
    FOREIGN KEY (IdProveedor) REFERENCES Proveedores(IdProveedor);

-- CompraDetalle -> Compras / Productos
ALTER TABLE CompraDetalle
ADD CONSTRAINT FK_CompraDetalle_Compra
    FOREIGN KEY (IdCompra) REFERENCES Compras(IdCompra);

ALTER TABLE CompraDetalle
ADD CONSTRAINT FK_CompraDetalle_Producto
    FOREIGN KEY (IdProducto) REFERENCES Productos(IdProducto);


-- 5. Datos iniciales

-- Insertar rol admin
INSERT INTO Roles (Nombre, Activo)
VALUES ('Admin', 1);

-- Insertar usuario admin con password hash (bcrypt de '123456')
INSERT INTO Usuarios (Username, PasswordHash, IdRol, Activo, FechaCreacion)
VALUES (
    'admin',
    '$2a$11$arh.SW8rpeUQjupDJ04ql.fhm/kmCcTJ/X90gaSdCQzDoxcC8Sq9u',
    1,
    1,
    GETDATE()
);
