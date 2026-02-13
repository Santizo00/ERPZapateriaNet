# Validación JWT - ERPZapateria

## Problemas Encontrados

### 1. ❌ FORMATO DEL TOKEN EN POSTMAN (CRÍTICO)
En la imagen del GET /api/productos, el Authorization header muestra solo el token sin "Bearer " al frente.
**Debe ser:** `Bearer <token_aqui>`

### 2. ⚠️ Inconsistencia en appsettings.json
Verifica que el nombre de la clave sea consistente:
```json
"Jwt": {
    "Key": "9mK2xR5pL8qWsD1tUvFgHiJ4KlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEf",
    "ExpireMinutes": 60,  // Debe coincidir con JwtHelper.cs
    "Issuer": "ERPZapateria",
    "Audience": "ERPZapateriaUsers"
}
```

### 3. ⚠️ ValidateIssuer y ValidateAudience
En ServiceCollectionExtensions.cs se validan Issuer y Audience:
- Issuer debe ser: `ERPZapateria`
- Audience debe ser: `ERPZapateriaUsers`

Si estos no coinciden exactamente en appsettings.json, fallará.

---

## Solución Rápida

### En Postman:
1. Ve a **Authorization** tab
2. Selecciona **Bearer Token**
3. Pega el token (sin el "Bearer" prefijo - Postman lo agrega automáticamente)
4. O copia el token del login y úsalo en el header manualmente:
   ```
   Authorization: Bearer eyJhbGc...
   ```

### En appsettings.json:
Verifica que sea:
```json
{
  "Jwt": {
    "Key": "9mK2xR5pL8qWsD1tUvFgHiJ4KlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEf",
    "ExpireMinutes": 60,
    "Issuer": "ERPZapateria",
    "Audience": "ERPZapateriaUsers"
  }
}
```

---

## Checklist de Validación

- [ ] Token tiene formato "Bearer <token_aqui>" en Authorization header
- [ ] appsettings.json tiene Issuer = "ERPZapateria"
- [ ] appsettings.json tiene Audience = "ERPZapateriaUsers" 
- [ ] Token no está expirado (exp claim en JWT)
- [ ] Usuario existe en DB y está activo (Activo = 1)
- [ ] La contraseña se validó correctamente con BCrypt
- [ ] La clave JWT en appsettings.json tiene 64 caracteres exactamente

---

## Validar Token en jwt.io

Decodifica el token en https://jwt.io y verifica:

```json
{
  "iss": "ERPZapateria",          // Issuer
  "aud": "ERPZapateriaUsers",     // Audience
  "nameid": "1",                  // Usuario ID
  "unique_name": "admin",         // Username
  "role": "Administrador",        // Rol desde DB
  "exp": 1707891234              // Expiration time (Unix timestamp)
}
```

Si alguno no coincide exactamente, fallará la validación.

---

## Próximos Pasos

1. Valida que el Authorization header sea: `Authorization: Bearer [token_aqui]`
2. Verifica que appsettings.json tenga Issuer y Audience correctos
3. Decodifica el token en jwt.io y verifica los claims
4. Si aún falla, agrega logs en Program.cs para ver el error exacto

