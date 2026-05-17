# Backend estilo STRAPY para el Frontend de la pagina web de titi makeUp

## Configuracion

1. Copia `.env.example` a `.env`.
2. Configura las variables SMTP y correos de envio.
3. Instala dependencias con `npm install`.
4. Levanta el servidor con `npm run dev`.

## Endpoint de contacto

- Metodo: `POST`
- URL: `/contact`
- Body JSON:

```json
{
  "name": "Ana Perez",
  "email": "ana@mail.com",
  "phone": "+34 600 000 000",
  "message": "Hola, me interesa un servicio de maquillaje para boda"
}
```

Respuesta exitosa:

```json
{
  "message": "Mensaje enviado correctamente"
}
```

## Configuracion de Gmail

Para usar contraseña normal de Gmail:

1. En `.env`, pon tu Gmail en `SMTP_USER`.
2. Pon tu contraseña de Gmail en `SMTP_PASS`.
3. Si Gmail bloquea el envío, activa "Acceso de apps menos seguras" en tu cuenta de Google.

## Flujo de emails

Cuando el cliente envía un formulario:

1. Se envía confirmación al cliente (email del formulario) con tu nombre.
2. Se envía notificación al propietario (`CONTACT_TO_EMAIL`) con nombre, email, teléfono y mensaje completo.
3. El propietario puede responder directo al email del cliente usando "Responder"
