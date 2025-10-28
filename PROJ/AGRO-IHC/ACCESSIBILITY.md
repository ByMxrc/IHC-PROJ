# Sistema de Accesibilidad - AgroFeria

## 🎨 Características de Accesibilidad Implementadas

### 1. **Temas de Color**

El sistema incluye 5 modos de visualización para diferentes necesidades:

#### ☀️ **Modo Claro (Light)**
- Fondo blanco con texto oscuro
- Alto contraste para lectura cómoda
- Tema por defecto del sistema

#### 🌙 **Modo Oscuro (Dark)**
- Fondo oscuro con texto claro
- Reduce fatiga visual en ambientes con poca luz
- Ideal para uso nocturno

#### 🟢 **Deuteranopía**
- Optimizado para personas con dificultad para distinguir verde/rojo
- Usa paleta azul/amarillo
- Ceguera al color verde más común (5% de hombres)

#### 🔴 **Protanopía**
- Adaptado para dificultad con el color rojo
- Paleta azul/amarillo oscuro
- Afecta al 1% de hombres

#### 🔵 **Tritanopía**
- Diseñado para dificultad con azul/amarillo
- Usa paleta rosa/turquesa
- Condición más rara (0.01% de la población)

### 2. **Idiomas Disponibles**

- 🇪🇸 **Español**: Idioma por defecto
- 🇺🇸 **English**: Interfaz completamente traducida

### 3. **Navegación Optimizada**

#### Top Bar Compacta
- **Logo**: Acceso rápido a inicio
- **Controles de Tema**: Cambio inmediato de esquema de colores
- **Selector de Idioma**: Cambio de idioma al instante
- **Login/Usuario**: Siempre visible en esquina superior derecha

#### Navegación Desplegable
- Se muestra solo cuando el usuario está autenticado
- Ocupa menos espacio cuando está contraída
- Botón de toggle para expandir/contraer
- Grid responsive de opciones con iconos grandes

### 4. **Persistencia de Configuración**

- Las preferencias se guardan en `localStorage`
- Al recargar la página, se mantienen:
  - Tema seleccionado
  - Idioma preferido
  - Sesión de usuario
  - Contenido personalizado de inicio

### 5. **Cumplimiento de Estándares**

#### ISO 9241-11 - Usabilidad
- ✅ **Eficacia**: Controles claros y accesibles
- ✅ **Eficiencia**: Cambios instantáneos sin recargar
- ✅ **Satisfacción**: Múltiples opciones de personalización

#### WCAG 2.1 AA
- ✅ Contraste de color adecuado en todos los temas
- ✅ Textos legibles con tamaños mínimos
- ✅ Áreas clicables mínimo 44x44px
- ✅ Navegación por teclado completa
- ✅ ARIA labels en componentes interactivos

## 🚀 Uso del Sistema

### Cambiar Tema
1. Click en botón de tema (☀️/🌙/🟢/🔴/🔵)
2. Seleccionar tema deseado del menú desplegable
3. El cambio es inmediato

### Cambiar Idioma
1. Click en botón de idioma (🇪🇸/🇺🇸)
2. Seleccionar idioma deseado
3. Toda la interfaz se traduce al instante

### Iniciar Sesión
1. Click en "Iniciar Sesión" (esquina superior derecha)
2. Ingresar credenciales:
   - Usuario: `admin`
   - Contraseña: `admin123`
3. El menú de navegación se expande automáticamente

### Navegar
1. Con sesión iniciada, click en botón ▼ para expandir menú
2. Seleccionar opción deseada del grid
3. Click en ▲ para contraer y ganar espacio

## 💡 Beneficios

### Para Usuarios con Daltonismo
- Interfaces diseñadas específicamente para cada tipo
- Colores con alto contraste y diferenciación
- Iconos distintivos además de colores

### Para Todos los Usuarios
- Flexibilidad en preferencias visuales
- Interfaz multiidioma
- Navegación optimizada y compacta
- Personalización persistente

## 🔧 Implementación Técnica

### Contextos React
- `AccessibilityContext`: Gestiona tema e idioma
- `AuthContext`: Maneja autenticación
- `HomeContentContext`: Contenido editable

### CSS Variables
- Todas las variables de color en `themes.css`
- Cambio dinámico mediante clases en `<body>`
- Transiciones suaves entre temas

### Traducciones
- Sistema `t()` para strings
- Diccionarios completos en español e inglés
- Fácil extensión a nuevos idiomas

## 📱 Responsive Design

- ✅ Desktop: Navegación completa expandida
- ✅ Tablet: Controles compactos adaptados
- ✅ Móvil: Interfaz optimizada touch-friendly

---

**Desarrollado con estándares ISO 9241-11 y ISO 9241-210**
