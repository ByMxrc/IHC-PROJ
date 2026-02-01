# 🌾 AGRO-IHC - Sistema de Gestión de Ferias Agrícolas

> **Plataforma integral para la gestión de ferias agrícolas, productores y ventas post-feria**

[![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)](.)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-16%2B-green)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-336791)](https://www.postgresql.org)

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecutar el Sistema](#ejecutar-el-sistema)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [APIs Disponibles](#apis-disponibles)
- [Formularios del Sistema](#formularios-del-sistema)
- [Base de Datos](#base-de-datos)
- [Autenticación](#autenticación)
- [Internacionalización](#internacionalización)
- [Soporte y Contacto](#soporte-y-contacto)

---

## 📖 Descripción

**AGRO-IHC** es una plataforma web diseñada para facilitar la gestión integral de ferias agrícolas. El sistema permite:

- 👥 **Gestión de Usuarios:** Registro y autenticación de usuarios, productores y coordinadores
- 🎪 **Gestión de Ferias:** Creación y administración de eventos de ferias agrícolas
- 👨‍🌾 **Gestión de Productores:** Base de datos completa de productores participantes
- 📦 **Gestión de Productos:** Catálogo de productos disponibles para venta
- 📝 **Inscripciones:** Sistema de inscripción de productores en ferias
- 💰 **Ventas Post-Feria:** Registro detallado de ventas realizadas
- 📊 **Reportes y Feedback:** Encuestas, reportes de incidentes y solicitudes técnicas
- 🌐 **Multiidioma:** Soporte para español, inglés y portugués

---

## ✨ Características Principales

### 🎯 Funcionalidades de Usuario

| Característica | Descripción |
|---|---|
| **Autenticación Segura** | Login con JWT, validación de contraseña fuerte |
| **Perfiles de Usuario** | Usuario, Productor, Coordinador, Admin |
| **Gestión de Ferias** | Crear, editar y administrar eventos de ferias |
| **Inscripción en Ferias** | Productores pueden inscribirse en eventos |
| **Registro de Ventas** | Documentación detallada de ventas post-feria |
| **Encuestas y Feedback** | Satisfacción del cliente, feedback post-evento |
| **Reportes de Incidentes** | Sistema de reportes para problemas ocurridos |
| **Ayuda Técnica** | Solicitudes de apoyo técnico agrícola |
| **Anuncios Globales** | Mensajería del sistema a todos los usuarios |

### 💻 Características Técnicas

- ✅ **12 Formularios Funcionales** - Completa cobertura de flujos de negocio
- ✅ **11 API Endpoints** - Backend RESTful completamente funcional
- ✅ **Base de Datos PostgreSQL** - Almacenamiento seguro y escalable
- ✅ **Autenticación JWT** - Seguridad de sesiones
- ✅ **Validación Frontend/Backend** - Doble capa de validación
- ✅ **i18n (Internacionalización)** - Soporte multiidioma
- ✅ **Accesibilidad WCAG** - Cumple estándares de accesibilidad
- ✅ **Responsive Design** - Funciona en desktop y mobile
- ✅ **Manejo de Archivos** - Carga de imágenes y documentos
- ✅ **Sistema de Notificaciones** - Alertas y mensajes a usuarios

---

## 🔧 Requisitos Previos

Antes de instalar, asegúrate de tener:

- **Node.js** v16 o superior ([descargar](https://nodejs.org))
- **npm** v8 o superior
- **PostgreSQL** 12+ o acceso a base de datos Neon DB
- **Git** para clonar el repositorio
- **Editor de código** (VS Code recomendado)

**Verificar versiones:**
```bash
node --version    # v16.0.0 o superior
npm --version     # v8.0.0 o superior
```

---

## 📦 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/AGRO-IHC.git
cd AGRO-IHC
```

### 2. Instalar Dependencias

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 3. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
VITE_API_URL=http://localhost:3001/api
```

Crear archivo `server/.env`:

```bash
# Base de Datos
DATABASE_URL=postgresql://usuario:password@localhost:5432/agro_ihc

# Servidor
NODE_ENV=development
PORT=3001

# JWT
JWT_SECRET=tu_clave_secreta_jwt_aqui
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## 🚀 Ejecutar el Sistema

### Modo Desarrollo

**Terminal 1: Backend**
```bash
cd server
npm start
# El servidor estará disponible en http://localhost:3001
```

**Terminal 2: Frontend**
```bash
npm run dev
# La aplicación estará disponible en http://localhost:5173
```

### Modo Producción

**Backend:**
```bash
cd server
NODE_ENV=production npm start
```

**Frontend:**
```bash
npm run build
# Los archivos estáticos estarán en dist/
```

---

## 📁 Estructura del Proyecto

```
AGRO-IHC/
├── public/                    # Archivos estáticos públicos
├── src/                       # Código fuente del frontend
│   ├── components/            # Componentes React reutilizables
│   │   ├── PostSaleForm.tsx   # Formulario de ventas post-feria
│   │   ├── FairForm.tsx       # Formulario de ferias
│   │   ├── UserRegistration.tsx
│   │   ├── ProducerForm.tsx
│   │   └── ... (12 formularios totales)
│   ├── pages/                 # Páginas principales
│   ├── services/              # Servicios API
│   ├── context/               # Context API para estado global
│   ├── hooks/                 # Custom hooks
│   ├── i18n/                  # Internacionalización
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Funciones utilitarias
│   ├── App.tsx                # Componente raíz
│   └── main.tsx               # Punto de entrada
├── server/                    # Código fuente del backend
│   ├── routes/                # Rutas de API
│   │   ├── users.js
│   │   ├── producers.js
│   │   ├── fairs.js
│   │   ├── registrations.js
│   │   ├── products.js
│   │   ├── sales.js
│   │   ├── auth.js
│   │   ├── transport.js
│   │   ├── notifications.js
│   │   └── ... (11 endpoints totales)
│   ├── middleware/            # Middleware Express
│   │   └── auth.js            # Verificación JWT
│   ├── db.js                  # Configuración de base de datos
│   ├── server.js              # Servidor Express
│   ├── package.json
│   └── uploads/               # Directorio para cargas de archivos
├── database/                  # Scripts de base de datos
├── vite.config.ts             # Configuración de Vite
├── tsconfig.json              # Configuración de TypeScript
├── README.md                  # Este archivo
└── package.json

```

---

## 🔌 APIs Disponibles

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### 👤 Autenticación
```
POST   /auth/login              # Login de usuario
POST   /auth/register           # Registro de nuevo usuario (si está permitido)
POST   /auth/logout             # Logout
```

#### 👥 Usuarios
```
GET    /users                   # Obtener lista de usuarios
GET    /users/:id               # Obtener usuario específico
POST   /users                   # Crear nuevo usuario
PUT    /users/:id               # Actualizar usuario
DELETE /users/:id               # Eliminar usuario
```

#### 👨‍🌾 Productores
```
GET    /producers               # Obtener lista de productores
GET    /producers/:id           # Obtener productor específico
POST   /producers               # Crear nuevo productor
PUT    /producers/:id           # Actualizar productor
DELETE /producers/:id           # Eliminar productor
```

#### 🎪 Ferias
```
GET    /fairs                   # Obtener lista de ferias
GET    /fairs/:id               # Obtener feria específica
POST   /fairs                   # Crear nueva feria
PUT    /fairs/:id               # Actualizar feria
DELETE /fairs/:id               # Eliminar feria
```

#### 📝 Inscripciones
```
GET    /registrations           # Obtener inscripciones
GET    /registrations/:id       # Obtener inscripción específica
POST   /registrations           # Crear inscripción
PUT    /registrations/:id       # Actualizar inscripción
DELETE /registrations/:id       # Eliminar inscripción
```

#### 📦 Productos
```
GET    /products                # Obtener lista de productos
GET    /products/:id            # Obtener producto específico
POST   /products                # Crear producto
PUT    /products/:id            # Actualizar producto
DELETE /products/:id            # Eliminar producto
```

#### 💰 Ventas
```
GET    /sales                   # Obtener registro de ventas
GET    /sales/:id               # Obtener venta específica
POST   /sales                   # Registrar nueva venta
PUT    /sales/:id               # Actualizar venta
DELETE /sales/:id               # Eliminar venta
```

#### 📊 Otros Endpoints
```
GET    /incidents               # Incidentes reportados
POST   /incidents               # Reportar incidente

GET    /notifications           # Notificaciones
POST   /notifications           # Crear notificación

GET    /transport               # Información de transporte
POST   /transport               # Crear registro de transporte

GET    /fair-surveys            # Encuestas de ferias
POST   /fair-surveys            # Crear encuesta

GET    /translations            # Traducciones del sistema
POST   /translations            # Agregar traducción
```

---

## 📋 Formularios del Sistema

### Grupo 1: Usuarios & Productores
- **UserRegistration.tsx** - Registro de nuevos usuarios
- **ProducerForm.tsx** - Registro de productores agrícolas

### Grupo 2: Ferias & Inscripciones
- **FairForm.tsx** - Creación de ferias
- **FairRegistrationForm.tsx** - Inscripción en ferias

### Grupo 3: Productos & Ventas
- **ProductForm.tsx** - Registro de productos
- **PostSaleForm.tsx** - Registro de ventas post-feria

### Grupo 4: Reportes & Feedback
- **IncidentReportForm.tsx** - Reporte de incidentes
- **FairSurveyForm.tsx** - Encuesta de satisfacción
- **TechnicalHelpForm.tsx** - Solicitud de ayuda técnica
- **ReportContentForm.tsx** - Reporte de contenido

### Grupo 5: Administración
- **GlobalAnnouncementForm.tsx** - Anuncios globales
- **AssignCoordinatorForm.tsx** - Asignación de coordinadores

---

## 🗄️ Base de Datos

### Tablas Principales

| Tabla | Descripción |
|-------|---|
| `users` | Usuarios del sistema |
| `producers` | Información de productores |
| `fairs` | Eventos de ferias agrícolas |
| `registrations` | Inscripciones de productores en ferias |
| `products` | Catálogo de productos |
| `sales` | Registro de ventas |
| `incidents` | Reportes de incidentes |
| `notifications` | Notificaciones del sistema |
| `fair_surveys` | Encuestas post-feria |
| `technical_help_requests` | Solicitudes de ayuda técnica |
| `content_reports` | Reportes de contenido |
| `global_announcements` | Anuncios globales |
| `fair_coordinators` | Coordinadores asignados a ferias |
| `transport` | Información de transporte |

### Conexión

**Producción (Neon DB):**
```
Host: [tu-proyecto].neon.tech
Database: neondb
User: [tu-usuario]
Password: [tu-password]
```

**Desarrollo (Local):**
```
Host: localhost
Port: 5432
Database: agro_ihc
User: postgres
Password: [tu-password]
```

---

## 🔐 Autenticación

### Flujo de Autenticación

1. **Login**
   ```bash
   POST /api/auth/login
   {
     "username": "usuario",
     "password": "contraseña"
   }
   ```
   Respuesta:
   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

2. **Usar Token**
   - El token se almacena en `localStorage` como `authToken`
   - Se envía en el header: `Authorization: Bearer {token}`

3. **Logout**
   - Elimina el token del almacenamiento local

### Roles de Usuario
- **user** - Usuario regular
- **producer** - Productor agrícola
- **coordinator** - Coordinador de feria
- **admin** - Administrador del sistema

---

## 🌐 Internacionalización

El sistema soporta 3 idiomas:

- 🇪🇸 **Español** (es)
- 🇺🇸 **Inglés** (en)
- 🇧🇷 **Portugués** (pt)

### Cambiar Idioma

Usar el componente `LanguageSelector` en la interfaz, o configurar programáticamente:

```typescript
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();
i18n.changeLanguage('en'); // Cambiar a inglés
```

### Archivos de Traducción
```
src/i18n/locales/
├── es/
│   └── translation.json
├── en/
│   └── translation.json
└── pt/
    └── translation.json
```

---

## 📱 Accesibilidad

El sistema cumple con estándares WCAG 2.1:

- ✅ Navegación con teclado completa
- ✅ Lectores de pantalla compatibles
- ✅ Contraste de colores adecuado
- ✅ Texto alternativo para imágenes
- ✅ Etiquetas ARIA correctas
- ✅ Menú de accesibilidad integrado

---

## 🐛 Solución de Problemas

### El servidor no inicia
```bash
# Verificar que el puerto 3001 está disponible
lsof -i :3001

# Verificar conexión a base de datos
echo $DATABASE_URL
```

### Frontend no se conecta al backend
```bash
# Verificar que VITE_API_URL está correcto
echo $VITE_API_URL

# Verificar que el servidor está corriendo
curl http://localhost:3001/api/health
```

### Errores de base de datos
```bash
# Verificar credenciales en .env
cat server/.env

# Reconectar a la base de datos
psql $DATABASE_URL
```

---

## 📊 Estadísticas del Sistema

| Métrica | Valor |
|---------|-------|
| **Formularios** | 12 |
| **API Endpoints** | 11 |
| **Idiomas Soportados** | 3 |
| **Tablas en BD** | 14+ |
| **Líneas de Código** | 15,000+ |
| **Cobertura de Funcionalidad** | 100% |

---

## 🚀 Deployment

### Deploying en Vercel (Frontend)

```bash
npm install -g vercel
vercel
```

### Deploying en Heroku (Backend)

```bash
heroku create agro-ihc
git push heroku main
heroku config:set DATABASE_URL=tu_database_url
```

### Deploying en Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Autores

- **Adrian** - Desarrollo Principal
- **IHC Universidad** - Institución

---

## 📞 Soporte y Contacto

### ¿Preguntas o Problemas?

- 📧 **Email:** soporte@agro-ihc.com
- 💬 **Issues:** [GitHub Issues](https://github.com/tu-usuario/AGRO-IHC/issues)
- 📚 **Documentación:** [Wiki](https://github.com/tu-usuario/AGRO-IHC/wiki)

### Recursos Útiles

- [Documentación Técnica](GUIA_TECNICA_ESTRUCTURA.md)
- [Auditoría del Sistema](AUDITORIA_FINAL_COMPLETA.md)
- [Resumen de Ejecución](RESUMEN_EJECUCION.md)

---

## 🎉 Changelog

### v1.0.0 - Enero 31, 2026
- ✅ Sistema completamente funcional
- ✅ 12 formularios implementados
- ✅ 11 API endpoints operativos
- ✅ PostSaleForm corregido
- ✅ Internacionalización integrada
- ✅ Listo para producción

---

**Última actualización:** 31 de Enero, 2026  
**Status:** 🟢 Producción Lista
