# 📘 Drunagor Turn Tracker

WebApp gratuita para el control de turnos en el juego **Chronicles of Drunagor**, diseñada con React + Vite y desplegada en GitHub Pages.

---

## 🚀 Funcionalidades principales

- Selección de héroes y enemigos con datos personalizados.
- Gestión de turnos automática según reglas del juego.
- Configuración de idioma (actualmente solo español e inglés).
- Soporte para expansiones que amplían enemigos y héroes.
- Control de vida, efectos y estados alterados.
- Interfaz clara y accesible para dispositivos móviles y escritorio.

---

## 📦 Instalación y ejecución local

```bash
git clone https://github.com/jcarlosorte/drunagor-turn-tracker.git
cd drunagor-turn-tracker
npm install
npm run dev
```

## 💾 Guardado de partidas

- **Este dispositivo** (IndexedDB): sin cuenta ni Firebase.
- **Nube (Google)** (Firestore): opcional, login con cualquier Gmail.

Guía paso a paso (local, Firebase, GitHub Pages, fallos comunes):

→ **[docs/probar-guardado.md](docs/probar-guardado.md)**

### Firebase

No hay que “dar de alta” correos: con **Authentication → Google**, cada persona entra con **su** Gmail.

Creación del proyecto **paso a paso** (app web, Auth, Firestore, reglas, `.env.local`):

→ **[docs/probar-guardado.md § 3](docs/probar-guardado.md#3-crear-firebase-paso-a-paso-nube)**

Si solo quieres probar el feature: empieza por la pestaña **Este dispositivo**; la nube puede esperar.
