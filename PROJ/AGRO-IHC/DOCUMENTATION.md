# 🌾 Sistema de Gestión de Ferias Agroproductivas

Sistema web para la gestión integral de ferias agroproductivas, desarrollado siguiendo las normas **ISO 9241-11** (Usabilidad) e **ISO 9241-210** (Diseño Centrado en el Usuario).

## 📋 Descripción del Proyecto

Este sistema permite la gestión completa de ferias agroproductivas, incluyendo:
- ✅ Inscripción y gestión de productores agrícolas
- 📅 Calendario y administración de ferias
- 📝 Sistema de inscripciones a eventos
- 🚚 Logística y coordinación de transporte
- 💰 Registro de comercialización y ventas
- 📊 Reportes y estadísticas

## 🎯 Etapas del Proyecto

### 1️⃣ CONTEXTO

#### Usuarios del Sistema
- **Productores Agrícolas**: Registran sus datos y se inscriben a ferias
- **Administradores de Ferias**: Gestionan eventos y coordinan logística
- **Personal de Transporte**: Coordinan el traslado de productos
- **Analistas**: Generan reportes y estadísticas

#### Dispositivos Soportados (Responsive Design)
- 📱 Móviles (320px - 767px)
- 📱 Tablets (768px - 1023px)
- 💻 Escritorio (1024px+)

#### Tecnologías de Desarrollo
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Estilos**: CSS Modules
- **Validación**: Custom validators
- **Estándares**: ISO 9241-11 & ISO 9241-210

### 2️⃣ REQUISITOS

#### Factores de Usabilidad (ISO 9241-11)

**Eficacia**: El sistema permite completar tareas exitosamente
- ✅ Formularios con validación en tiempo real
- ✅ Mensajes de error claros y específicos
- ✅ Confirmación de acciones importantes

**Eficiencia**: Tareas realizadas con mínimo esfuerzo
- ✅ Navegación intuitiva con máximo 2 clics
- ✅ Autocompletado y valores predeterminados
- ✅ Atajos de teclado y accesibilidad

**Satisfacción**: Interfaz agradable y fácil de usar
- ✅ Diseño visual atractivo y profesional
- ✅ Feedback visual inmediato
- ✅ Experiencia consistente en todas las pantallas

#### Requisitos Funcionales
1. **RF-01**: Sistema de registro de productores con validación completa
2. **RF-02**: Gestión de ferias con control de fechas y capacidad
3. **RF-03**: Inscripciones a ferias con verificación de cupos
4. **RF-04**: Coordinación de transporte y logística
5. **RF-05**: Registro de ventas y comercialización
6. **RF-06**: Generación de reportes y estadísticas

#### Requisitos No Funcionales con Usabilidad
1. **RNF-01**: Tiempo de respuesta < 2 segundos
2. **RNF-02**: Disponibilidad 99.9%
3. **RNF-03**: Accesibilidad WCAG 2.1 AA
4. **RNF-04**: Responsive design en todos los dispositivos
5. **RNF-05**: Contraste de colores mínimo 4.5:1
6. **RNF-06**: Touch targets mínimo 44x44px

### 3️⃣ DESARROLLO PROTOTIPO

#### Parámetros de Usabilidad en Menú
✅ **Navegación Clara**
- Iconos descriptivos para cada sección
- Indicador visual de página activa
- Menú hamburguesa en dispositivos móviles
- Máximo 7 opciones (límite de memoria de trabajo)

✅ **Accesibilidad**
- ARIA labels en todos los elementos interactivos
- Navegación por teclado completa
- Focus visible en todos los elementos
- Contraste WCAG AA compliant

✅ **Responsive**
- Mobile-first design
- Breakpoints en 768px y 480px
- Touch targets > 44px
- Menú adaptativo

#### Parámetros de Usabilidad en Formularios (70% Funcional)

**Formulario de Productor** ✅
- ✅ Validación en tiempo real
- ✅ Mensajes de error específicos
- ✅ Campos agrupados lógicamente
- ✅ Indicadores de campos requeridos (*)
- ✅ Prevención de errores con tipos de input adecuados
- ✅ Feedback visual (colores, iconos)
- ✅ Confirmación antes de enviar
- ✅ Datos de ejemplo: 1 productor precargado

**Formulario de Feria** ✅
- ✅ Validación de fechas y capacidad
- ✅ Selección múltiple de categorías
- ✅ Campos de fecha con datetime-local
- ✅ Prevención de fechas pasadas
- ✅ Validación de rango de fechas
- ✅ Datos de ejemplo: 1 feria precargada

**Formulario de Inscripción** ✅
- ✅ Selección dinámica de productores/ferias
- ✅ Verificación de cupos disponibles
- ✅ Opción de transporte con checkbox
- ✅ Información contextual de feria seleccionada
- ✅ Validación de cantidades

### 4️⃣ PRUEBAS

#### Modelos de Pruebas de Usabilidad Implementadas

**1. Pruebas de Navegación**
- ✅ Todos los menús navegables
- ✅ Breadcrumbs implícitos (título de página)
- ✅ Estado activo visible

**2. Pruebas de Formularios**
- ✅ Validación funcionando al 70%
- ✅ Mensajes de error claros
- ✅ Prevención de envío con errores
- ✅ Feedback visual de éxito

**3. Pruebas de Responsive**
- ✅ Layout adaptativo en 3 breakpoints
- ✅ Touch targets > 44px en móvil
- ✅ Menú hamburguesa funcional

**4. Pruebas de Accesibilidad**
- ✅ ARIA labels implementados
- ✅ Navegación por teclado
- ✅ Contraste de colores adecuado
- ✅ Focus visible

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview
```

### Acceso
El sistema estará disponible en: `http://localhost:5173`

## 📁 Estructura del Proyecto

```
AGRO-IHC/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Navigation.tsx   # Menú de navegación
│   │   ├── ProducerForm.tsx # Formulario de productores
│   │   ├── FairForm.tsx     # Formulario de ferias
│   │   └── FairRegistrationForm.tsx
│   ├── pages/               # Páginas principales
│   │   ├── HomePage.tsx
│   │   ├── ProducersPage.tsx
│   │   ├── FairsPage.tsx
│   │   ├── RegistrationsPage.tsx
│   │   ├── TransportPage.tsx
│   │   ├── SalesPage.tsx
│   │   └── ReportsPage.tsx
│   ├── types/               # Definiciones TypeScript
│   │   └── index.ts
│   ├── utils/               # Utilidades y validadores
│   │   └── validation.ts
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Características de Usabilidad

### Diseño Visual
- ✅ Paleta de colores verde (#2e7d32) representando agricultura
- ✅ Espaciado consistente y respirable
- ✅ Tipografía legible (Segoe UI, Tahoma)
- ✅ Iconos descriptivos (emojis universales)

### Interacción
- ✅ Feedback inmediato en todas las acciones
- ✅ Animaciones suaves y no intrusivas
- ✅ Estados hover, focus y active bien definidos
- ✅ Confirmaciones para acciones importantes

### Accesibilidad
- ✅ ARIA labels en elementos interactivos
- ✅ Navegación por teclado (Tab, Enter, Esc)
- ✅ Contraste mínimo 4.5:1 (WCAG AA)
- ✅ Touch targets > 44x44px (Apple HIG)
- ✅ Soporte para reduced motion

### Responsive Design
- ✅ Mobile-first approach
- ✅ Grids flexibles y adaptables
- ✅ Imágenes y media queries optimizadas
- ✅ Menú hamburguesa en móviles

## 📊 Cumplimiento de Normas

### ISO 9241-11 (Usabilidad)
✅ **Eficacia**: Tareas completables exitosamente
✅ **Eficiencia**: Mínimo esfuerzo requerido  
✅ **Satisfacción**: Interfaz agradable y fácil

### ISO 9241-210 (Diseño Centrado en el Usuario)
✅ Desarrollo iterativo
✅ Participación activa de usuarios
✅ Diseño basado en tareas reales
✅ Evaluación continua de usabilidad

## 🔧 Tecnologías Utilizadas

- **React 19.1.1**: Framework UI
- **TypeScript 5.9.3**: Tipado estático
- **Vite 7.1.7**: Build tool rápido
- **ESLint**: Linting de código
- **CSS3**: Estilos con variables CSS

## 👥 Autor

Proyecto desarrollado para el curso de Interacción Humano-Computadora (IHC)

## 📄 Licencia

Este proyecto es de uso académico.

---

**Nota**: Este sistema implementa formularios con funcionalidad al 70% según los requisitos del proyecto. Las validaciones, feedback visual y parámetros de usabilidad están completamente implementados en los formularios de Productor, Feria e Inscripción.
