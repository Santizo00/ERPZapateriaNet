-- Tipos
-- Detalle de pedido enviado desde la aplicacion
CREATE TYPE PedidoDetalleType AS TABLE
(
    IdProducto INT,
    Cantidad INT,
    PrecioUnitario DECIMAL(18,2)
);
GO

-- Procedimientos
-- Autenticacion por usuario activo
CREATE PROCEDURE sp_LoginUsuario
    @Username NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        u.IdUsuario,
        u.Username,
        u.PasswordHash,
        r.Nombre AS Rol
    FROM Usuarios u
    INNER JOIN Roles r ON u.IdRol = r.IdRol
    WHERE u.Username = @Username
      AND u.Activo = 1;
END
GO

-- Ajuste de inventario con registro de movimiento
CREATE PROCEDURE sp_ActualizarInventario
    @IdProducto INT,
    @Cantidad INT,
    @TipoMovimiento NVARCHAR(20) -- 'Entrada' o 'Salida'
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        IF @TipoMovimiento = 'Salida'
        BEGIN
            IF (SELECT CantidadDisponible FROM Inventario WHERE IdProducto = @IdProducto) < @Cantidad
            BEGIN
                RAISERROR('Stock insuficiente', 16, 1);
            END

            UPDATE Inventario
            SET CantidadDisponible = CantidadDisponible - @Cantidad,
                UltimaActualizacion = GETDATE()
            WHERE IdProducto = @IdProducto;
        END
        ELSE
        BEGIN
            UPDATE Inventario
            SET CantidadDisponible = CantidadDisponible + @Cantidad,
                UltimaActualizacion = GETDATE()
            WHERE IdProducto = @IdProducto;
        END

        INSERT INTO MovimientosInventario (IdProducto, TipoMovimiento, Cantidad, Fecha)
        VALUES (@IdProducto, @TipoMovimiento, @Cantidad, GETDATE());

        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW;
    END CATCH
END
GO

-- Creacion de pedido con detalle e impacto en inventario
CREATE PROCEDURE sp_CrearPedido
    @IdCliente INT,
    @IdUsuario INT,
    @Detalle PedidoDetalleType READONLY
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdPedido INT;
    DECLARE @Total DECIMAL(18,2) = 0;

    BEGIN TRY
        BEGIN TRAN;

        -- Calcular total
        SELECT @Total = SUM(Cantidad * PrecioUnitario)
        FROM @Detalle;

        -- Insertar pedido
        INSERT INTO Pedidos (IdCliente, IdUsuario, Fecha, Total, Estado)
        VALUES (@IdCliente, @IdUsuario, GETDATE(), @Total, 'Completado');

        SET @IdPedido = SCOPE_IDENTITY();

        -- Insertar detalle
        INSERT INTO PedidoDetalle (IdPedido, IdProducto, Cantidad, PrecioUnitario, Subtotal)
        SELECT
            @IdPedido,
            IdProducto,
            Cantidad,
            PrecioUnitario,
            Cantidad * PrecioUnitario
        FROM @Detalle;

        -- Actualizar inventario producto por producto
        DECLARE @IdProducto INT, @Cantidad INT;

        DECLARE cursor_detalle CURSOR FOR
        SELECT IdProducto, Cantidad FROM @Detalle;

        OPEN cursor_detalle;
        FETCH NEXT FROM cursor_detalle INTO @IdProducto, @Cantidad;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            EXEC sp_ActualizarInventario @IdProducto, @Cantidad, 'Salida';
            FETCH NEXT FROM cursor_detalle INTO @IdProducto, @Cantidad;
        END

        CLOSE cursor_detalle;
        DEALLOCATE cursor_detalle;

        COMMIT;

        SELECT @IdPedido AS IdPedidoGenerado;

    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW;
    END CATCH
END
GO

-- Consulta de ventas por rango opcional de fechas
CREATE PROCEDURE sp_ConsultarVentas
    @FechaInicio DATETIME = NULL,
    @FechaFin DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        p.IdPedido,
        p.Fecha,
        c.Nombre AS Cliente,
        u.Username AS Vendedor,
        p.Total,
        p.Estado
    FROM Pedidos p
    INNER JOIN Clientes c ON p.IdCliente = c.IdCliente
    INNER JOIN Usuarios u ON p.IdUsuario = u.IdUsuario
    WHERE
        (@FechaInicio IS NULL OR p.Fecha >= @FechaInicio)
        AND
        (@FechaFin IS NULL OR p.Fecha <= @FechaFin)
    ORDER BY p.Fecha DESC;
END
GO




