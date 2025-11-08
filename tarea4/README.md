# Tarea 4 — Chat en tiempo real

Proyecto desarrollado para la materia **Desarrollo de Cliente (ITESO)**.  
Este proyecto implementa un **chat en tiempo real** usando **Angular** en el cliente y **Node.js + Socket.IO** en el servidor.

---

## Tecnologías utilizadas

- **Angular 19**
- **Node.js + Express**
- **Socket.IO** (para la comunicación en tiempo real)
- **TypeScript**
- **RxJS**
- **HTML + SCSS**

---

## Instalación

1. Abrir una terminal en la carpeta del proyecto:

   ```bash
   cd tarea4
   ```

2. Instalar las dependencias necesarias:

   ```bash
   npm install
   ```

---

## Ejecución del servidor (Node.js)

1. Iniciar el servidor de sockets:

   ```bash
   npm run server
   ```

2. Se ve en consola:

   ```
   Servidor Socket.IO en http://localhost:3000
   ```

3. Para probar la salud del servidor en el navegador:
   ```
   http://localhost:3000/health
   ```
   Respuesta esperada:
   ```json
   { "status": "ok" }
   ```

---

## Ejecución del cliente (Angular)

1. Abrir otra terminal (sin cerrar el servidor) y ejecuta:

   ```bash
   npm start
   ```

2. Esperar a que Angular compile y abre:
   ```
   http://localhost:4200
   ```

---

## Cómo probar el chat

1. Abrir **dos pestañas o navegadores distintos** en `http://localhost:4200`.
2. En cada uno, ingresa un nombre diferente (por ejemplo “Omar” y “Ana”).
3. Envía mensajes desde ambos lados.

Se ven:
- Mensajes en tiempo real en ambos chats.
- Notificaciones cuando un nuevo usuario se conecta.
- Cuando se desconecta
---


