# Tarea 3 — Formulario de Registro (Angular)

Este proyecto implementa un formulario de registro de usuario
## Características
- Campos: nombre, correo, edad, contraseña, confirmar contraseña y aceptación de términos.
- Validaciones:
  - Nombre: requerido y mínimo 2 caracteres.
  - Correo: formato válido y requerido.
  - Edad: requerida y mínimo 18 años.
  - Contraseña: requerida y mínimo 8 caracteres.
  - Confirmar contraseña: debe coincidir.
  - Términos: obligatorio marcar.
- El botón “Crear cuenta” permanece deshabilitado mientras el formulario sea inválido.
- Al enviar, los datos se imprimen en la consola del navegador.

## Ejecución
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Levantar servidor de desarrollo:
   ```bash
   ng serve -o
   ```
3. Visitar [http://localhost:4200/registro](http://localhost:4200/registro)

---