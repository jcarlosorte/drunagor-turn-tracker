# Probar el guardado de partidas (local y nube)

Guía para lanzar la app en tu máquina y validar **Guardar / Cargar / Borrar** partidas con nombre.  
No cambia las reglas del juego; solo añade persistencia.

---

## 1. Arrancar en local (obligatorio)

```bash
git clone <url-del-fork-o-rama>
cd drunagor-turn-tracker
npm install
npm run dev
```

Abre la URL que imprime Vite, normalmente:

`http://localhost:5173/drunagor-turn-tracker/`

Flujo mínimo:

1. Configura héroes / expansiones / tracker como siempre.
2. Entra en la pantalla de control de turnos (`/init`).
3. Menú → **Partidas** (o el botón de guardar/cargar).
4. Elige pestaña **Este dispositivo** o **Nube (Google)**.

---

## 2. Probar sin Firebase (recomendado primero)

La pestaña **Este dispositivo** usa IndexedDB del navegador. **No hace falta cuenta ni `.env.local`.**

Checklist:

1. Coloca algunos monstruos, baja vidas, aplica estados, saca fichas de la bolsa.
2. **Guardar** con un nombre (ej. `prueba-1`).
3. Cambia algo en la mesa (o recarga la página con F5).
4. **Cargar** `prueba-1` → debe restaurar vidas, estados, bolsa, turnos, flags, etc.
5. **Borrar** el slot y comprobar que desaparece de la lista.

Si esto falla, el resto (nube) no hace falta hasta arreglarlo.

Límite orientativo: unas 20 partidas locales por navegador/perfil.

---

## 3. Crear Firebase paso a paso (nube)

Plan **Spark (gratis)** basta. No hace falta tarjeta si no sales del free tier.

### ¿Hay que “dar de alta” correos?

**No.** Con Google Auth activo, cualquiera entra con **su** Gmail. El primer login crea el usuario solo.  
Cada cuenta tiene sus partidas en `users/{uid}/saves` (no se mezclan).

---

### 3.1 Crear el proyecto

1. Entra en [Firebase Console](https://console.firebase.google.com/) con tu cuenta Google.
2. **Add project** / **Crear un proyecto**.
3. Nombre sugerido: `drunagor-turn-tracker` (o el que quieras).
4. Google Analytics: puedes **desactivarlo** (no lo usa esta app).
5. Espera a que termine y pulsa **Continue** / **Continuar**.

---

### 3.2 Registrar la app web (para obtener las claves)

1. En la portada del proyecto, pulsa el icono **Web** (`</>`).
2. Nickname: `drunagor-web` (da igual).
3. **No** marques “Also set up Firebase Hosting” (esta app va en GitHub Pages).
4. **Register app** / **Registrar app**.
5. Te mostrará un objeto `firebaseConfig` parecido a esto:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

6. Déjalo a mano (o cópialo); en el paso 3.6 lo pegarás en `.env.local`.
7. **Continue to console**.

Si se te cierra el asistente: ⚙️ **Project settings** → apartado **Your apps** → app Web → **Config**.

---

### 3.3 Activar Authentication con Google

1. Menú izquierdo → **Build** → **Authentication**.
2. **Get started** / **Comenzar** (solo la primera vez).
3. Pestaña **Sign-in method** / **Método de acceso**.
4. Pulsa **Google** → **Enable** / **Activar**.
5. Elige un **Project support email** (tu Gmail) → **Save**.

#### Dominios autorizados

1. En Authentication → pestaña **Settings** / **Configuración**.
2. **Authorized domains** / **Dominios autorizados**.
3. Debe existir **`localhost`** (suele venir por defecto).
4. Si publicas en GitHub Pages, **Add domain**:
   - `jcarlosorte.github.io`
5. Guarda.

Sin el dominio correcto verás errores tipo `auth/unauthorized-domain`.

---

### 3.4 Crear Firestore

1. Menú izquierdo → **Build** → **Firestore Database**.
2. **Create database** / **Crear base de datos**.
3. Ubicación: la que prefieras (ej. `europe-west` / `eur3`). **No se puede cambiar después** con facilidad; elige cerca de tus usuarios.
4. Modo de inicio:
   - **Production mode** (recomendado) y luego pegas las reglas del paso 3.5, **o**
   - **Test mode** solo para pruebas rápidas (caduca; sustituye las reglas sí o sí).
5. **Enable** / **Crear**.

No hace falta crear colecciones a mano: al guardar la primera partida aparecerá `users → {uid} → saves → {saveId}`.

---

### 3.5 Publicar las reglas de seguridad

1. En Firestore → pestaña **Rules** / **Reglas**.
2. Sustituye **todo** el contenido por esto y pulsa **Publish** / **Publicar**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/saves/{saveId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Significado: solo un usuario logado puede leer/escribir **sus** documentos bajo `users/{suUid}/saves/...`.  
Si las reglas quedan en denegado por defecto, el login funcionará pero **Guardar** fallará (`permission-denied`).

---

### 3.6 Pegar la config en `.env.local`

En la raíz del repo:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` (nunca lo subas a Git):

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

Correspondencia con el objeto de la consola:

| Campo Firebase | Variable en `.env.local` |
|----------------|--------------------------|
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

**Importante:** reinicia Vite (`Ctrl+C` y otra vez `npm run dev`). Las variables `VITE_*` solo se leen al arrancar.

---

### 3.7 Probar la nube en la app

1. Abre `http://localhost:5173/drunagor-turn-tracker/`.
2. **Iniciar sesión con Google** → elige tu correo (permite popups).
3. Menú → **Partidas** → pestaña **Nube (Google)**.
4. Guarda una partida con nombre → recarga → Cargar.
5. En la consola Firebase → Firestore: deberías ver `users / {uid} / saves / ...`.

Checklist rápido:

- [ ] Proyecto creado  
- [ ] App Web registrada (claves visibles)  
- [ ] Google Auth activado  
- [ ] `localhost` (y Pages si aplica) en dominios autorizados  
- [ ] Firestore creado  
- [ ] Reglas publicadas  
- [ ] `.env.local` relleno y Vite reiniciado  
- [ ] Login + Guardar + Cargar OK  

---

## 4. Dos formas de tener Firebase (elige una)

### A) Tu propio proyecto (recomendado si eres el mantenedor)

Tú creas el proyecto Firebase del tracker, pones las claves en `.env.local` (y en GitHub Actions / Pages si publicas build).  
Cualquiera que use la web publicada podrá entrar con **su** Google; los datos van a **tu** Firestore bajo `users/{uid}/...`.

Ventaja: controlas el proyecto, dominios y reglas.  
No necesitas que nadie más te “dé de alta”.

### B) Probar contra el proyecto de quien desarrolló el feature

Si te pasan un `.env.local` por un canal privado (nunca en el PR ni en el chat público):

- Entras con **tu** Gmail en **su** proyecto Firebase.
- Tus partidas nube se guardan en su Firestore (bajo tu `uid`).
- Ellos **no** tienen que registrar tu email; solo que Google Auth y `localhost` estén activos.

Para que también vean el proyecto en la consola (reglas, usuarios, uso), pueden añadirte como **colaborador** del proyecto Firebase (IAM), pero eso es opcional: **para jugar/probar el login basta el `.env.local`**.

---

## 5. GitHub Pages (cuando quieras publicar)

1. Build: `npm run build` (salida en `dist/`).
2. En Firebase → Authorized domains → añade `jcarlosorte.github.io`.
3. Las variables `VITE_FIREBASE_*` deben estar disponibles **en el momento del build** (no se leen desde `.env.local` en el navegador del usuario final de otra forma).

Sin esas claves en el build, la pestaña nube no funcionará en la web publicada; la local (IndexedDB) sí, en cada dispositivo por separado.

---

## 6. Qué no hace falta

- No hace falta Firebase para la pestaña **Este dispositivo**.
- No hace falta crear usuarios a mano en Authentication (el primer login con Google los crea).
- No hace falta cambiar reglas del juego ni datos de enemigos/héroes.
- No subas `.env.local` al repositorio (está en `.gitignore`).

---

## 7. Problemas frecuentes

| Síntoma | Qué mirar |
|---------|-----------|
| Botón Google no hace nada / “Firebase not configured” | Falta `.env.local` o no reiniciaste Vite |
| Popup de Google bloqueado | Permite popups para `localhost` |
| `auth/unauthorized-domain` | Añade el dominio en Authentication → Authorized domains |
| Error al guardar en nube / permission denied | Reglas Firestore no publicadas o mal copiadas |
| Login OK pero lista vacía | Estás en otra cuenta Google, u otra pestaña (local vs nube) |
| Tras Cargar, el turno “salta” solo | Espera ~3 s (protección post-carga); si sigue mal, reporta el caso |

---

## 8. Resumen rápido para el autor

1. `npm i` → `npm run dev` → prueba **Este dispositivo** (sin Firebase).  
2. Si quieres nube: crea **tu** proyecto Firebase (o usa un `.env.local` compartido en privado).  
3. Tu correo **no** se registra a mano: inicias sesión con Google y listo.  
4. Cada jugador = su Google = sus partidas en `users/{uid}/saves`.
