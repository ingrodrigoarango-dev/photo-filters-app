---
description: Workflow Gitflow inicial para proyectos.
---

# Workflow Gitflow Simplificado con Alias

Este documento describe un flujo de trabajo básico para simular Gitflow en Fedora utilizando alias configurados en `.gitconfig`.  

---

## Inicialización del flujo

Ejecuta el comando:
bash
git flow-init


Ejecuta el comando:
bash
git flow-feature-start <nombre>
<nombre> debe ser un identificador corto y descriptivo de la funcionalidad.

Ejemplos: login, checkout, api-refactor.
Antes de ejecutar, puedes preguntar al usuario qué nombre desea usar.
Después de crear la rama feature:

bash
git add .
git commit -m "<mensaje>"
Pregunta al usuario qué mensaje de commit desea usar.

Una vez recibido, ejecuta el commit para registrar los cambios.
Ejecuta el comando:
bash
git flow-feature-finish <nombre>
Usa el mismo <nombre> que se indicó en el paso 2.

Este comando fusiona la rama feature en develop y elimina la rama temporal.
