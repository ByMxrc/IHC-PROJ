# Funcionalidades Pendientes - Sistema AgroFeria

## Estado Actual vs Requisitos

### ✅ Implementado
1. **Responsive** - Todos los componentes son responsivos con media queries
2. **Diseño común de formularios** - Estilos estandarizados en todos los formularios
3. **Acceso al Sistema (login)** - LoginModal y Login con validaciones
4. **Tablas de usuarios (DB)** - Diagrama ER completo en DATABASE-ER-DIAGRAM.md

### ❌ Por Implementar

## 1. Recordar Usuario/Sesión ⏳

### Archivos a modificar:
- `src/components/LoginModal.tsx`
- `src/components/Login.tsx`
- `src/context/AuthContext.tsx`

### Implementación:

#### LoginModal.tsx y Login.tsx
```tsx
// Agregar estado para checkbox
const [rememberMe, setRememberMe] = useState(false);

// En el formulario, agregar:
<div className="form-group-checkbox">
  <label className="checkbox-label">
    <input
      type="checkbox"
      checked={rememberMe}
      onChange={(e) => setRememberMe(e.target.checked)}
      className="checkbox-input"
    />
    <span>Recordar sesión</span>
  </label>
</div>

// Pasar rememberMe al login
login(formData.username, formData.password, rememberMe);
```

#### AuthContext.tsx
```tsx
// Modificar función login
const login = (username: string, password: string, rememberMe: boolean = false): boolean => {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const sessionExpiry = rememberMe 
      ? Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 días
      : Date.now() + (24 * 60 * 60 * 1000); // 1 día
    
    const sessionData = {
      user: ADMIN_CREDENTIALS.user,
      expiresAt: sessionExpiry,
      rememberMe
    };
    
    setAuthState({
      isAuthenticated: true,
      user: ADMIN_CREDENTIALS.user,
    });
    
    localStorage.setItem('session', JSON.stringify(sessionData));
    return true;
  }
  return false;
};

// Verificar expiración al cargar
const savedSession = localStorage.getItem('session');
if (savedSession) {
  const session = JSON.parse(savedSession);
  if (Date.now() < session.expiresAt) {
    // Sesión válida
    setAuthState({
      isAuthenticated: true,
      user: session.user,
    });
  } else {
    // Sesión expirada
    localStorage.removeItem('session');
  }
}
```

---

## 2. Recuperar Contraseña 📧

### Archivos a crear:
- `src/components/PasswordRecovery.tsx`
- `src/components/PasswordRecovery.css`

### Implementación:

```tsx
// PasswordRecovery.tsx
import { useState } from 'react';
import { validateEmail } from '../utils/validation';
import './PasswordRecovery.css';

export default function PasswordRecovery({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSendCode = () => {
    if (validateEmail(email)) {
      // Simular envío de código
      console.log('Código enviado a:', email);
      setStep('code');
    }
  };

  const handleVerifyCode = () => {
    // Simular verificación de código
    if (code === '123456') {
      setStep('success');
    }
  };

  return (
    <div className="password-recovery-modal">
      {step === 'email' && (
        <div>
          <h2>Recuperar Contraseña</h2>
          <p>Ingrese su correo electrónico</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
          />
          <button onClick={handleSendCode}>Enviar código</button>
        </div>
      )}
      
      {step === 'code' && (
        <div>
          <h2>Verificar Código</h2>
          <p>Ingrese el código enviado a {email}</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nueva contraseña"
          />
          <button onClick={handleVerifyCode}>Verificar y cambiar</button>
        </div>
      )}

      {step === 'success' && (
        <div>
          <h2>✅ Contraseña actualizada</h2>
          <button onClick={onClose}>Cerrar</button>
        </div>
      )}
    </div>
  );
}
```

### Agregar link en Login
```tsx
<div className="login-footer-links">
  <button onClick={() => setShowRecovery(true)} className="link-button">
    ¿Olvidaste tu contraseña?
  </button>
</div>
```

---

## 3. Bloqueo Temporal (Seguridad) 🔒

### Archivos a modificar:
- `src/context/AuthContext.tsx`

### Implementación:

```tsx
// En AuthContext
interface LoginAttempt {
  username: string;
  attempts: number;
  blockedUntil: number | null;
}

const [loginAttempts, setLoginAttempts] = useState<Record<string, LoginAttempt>>(() => {
  const saved = localStorage.getItem('loginAttempts');
  return saved ? JSON.parse(saved) : {};
});

const login = (username: string, password: string, rememberMe: boolean = false): 
  { success: boolean; message?: string } => {
  
  // Verificar si está bloqueado
  const attempt = loginAttempts[username];
  if (attempt?.blockedUntil && Date.now() < attempt.blockedUntil) {
    const minutesLeft = Math.ceil((attempt.blockedUntil - Date.now()) / 60000);
    return {
      success: false,
      message: `Cuenta bloqueada. Intente en ${minutesLeft} minutos.`
    };
  }

  // Verificar credenciales
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    // Login exitoso - resetear intentos
    const newAttempts = { ...loginAttempts };
    delete newAttempts[username];
    setLoginAttempts(newAttempts);
    localStorage.setItem('loginAttempts', JSON.stringify(newAttempts));
    
    // ... resto del código de login exitoso
    return { success: true };
  }

  // Login fallido - incrementar intentos
  const currentAttempts = (attempt?.attempts || 0) + 1;
  const newAttempt: LoginAttempt = {
    username,
    attempts: currentAttempts,
    blockedUntil: currentAttempts >= 3 
      ? Date.now() + (15 * 60 * 1000) // 15 minutos
      : null
  };

  const newAttempts = { ...loginAttempts, [username]: newAttempt };
  setLoginAttempts(newAttempts);
  localStorage.setItem('loginAttempts', JSON.stringify(newAttempts));

  if (newAttempt.blockedUntil) {
    return {
      success: false,
      message: 'Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.'
    };
  }

  return {
    success: false,
    message: `Credenciales incorrectas. Intento ${currentAttempts}/3`
  };
};
```

---

## 4. Ver/Editar Perfil 👤

### Archivos a crear:
- `src/pages/ProfilePage.tsx`
- `src/pages/ProfilePage.css`
- `src/components/ProfileEditor.tsx`
- `src/components/ProfileEditor.css`

### Implementación:

```tsx
// ProfilePage.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileEditor from '../components/ProfileEditor';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Mi Perfil</h1>
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancelar' : 'Editar Perfil'}
        </button>
      </div>

      {isEditing ? (
        <ProfileEditor user={user} onSave={() => setIsEditing(false)} />
      ) : (
        <div className="profile-view">
          <div className="profile-field">
            <label>Usuario:</label>
            <span>{user?.username}</span>
          </div>
          <div className="profile-field">
            <label>Nombre:</label>
            <span>{user?.name}</span>
          </div>
          <div className="profile-field">
            <label>Rol:</label>
            <span>{user?.role}</span>
          </div>
        </div>
      )}

      <div className="profile-actions">
        <button className="btn-danger">Cambiar Contraseña</button>
        <button className="btn-secondary">Eliminar Cuenta</button>
      </div>
    </div>
  );
}
```

```tsx
// ProfileEditor.tsx
export default function ProfileEditor({ user, onSave }: Props) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Guardar cambios
    onSave();
  };

  return (
    <form className="profile-editor" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nombre completo</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      
      <div className="form-group">
        <label>Correo electrónico</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>

      <button type="submit" className="btn-primary">
        Guardar Cambios
      </button>
    </form>
  );
}
```

### Agregar al Navigation
```tsx
<li onClick={() => onNavigate('profile')}>
  <span className="menu-icon">👤</span>
  Perfil
</li>
```

---

## 5. Términos y Condiciones / Política de Privacidad 📄

### Archivos a crear:
- `src/components/TermsModal.tsx`
- `src/components/TermsModal.css`
- `src/components/PrivacyModal.tsx`
- `src/components/PrivacyModal.css`

### Implementación:

```tsx
// TermsModal.tsx
export default function TermsModal({ isOpen, onAccept, onDecline }: Props) {
  return (
    <div className="terms-modal">
      <div className="terms-content">
        <h2>Términos y Condiciones</h2>
        <div className="terms-text">
          <h3>1. Aceptación de Términos</h3>
          <p>
            Al utilizar el Sistema de Gestión de Ferias Agroproductivas,
            usted acepta estar sujeto a estos Términos y Condiciones...
          </p>

          <h3>2. Uso del Sistema</h3>
          <p>
            El sistema está diseñado para la gestión de ferias agroproductivas...
          </p>

          <h3>3. Responsabilidades del Usuario</h3>
          <ul>
            <li>Mantener la confidencialidad de sus credenciales</li>
            <li>Proporcionar información veraz y actualizada</li>
            <li>No utilizar el sistema para fines ilícitos</li>
          </ul>

          <h3>4. Protección de Datos</h3>
          <p>
            Nos comprometemos a proteger su información personal de acuerdo
            con nuestra Política de Privacidad y las leyes aplicables...
          </p>

          <h3>5. Modificaciones</h3>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier
            momento. Se notificará a los usuarios de cambios significativos...
          </p>

          <p className="terms-date">Última actualización: 2 de noviembre de 2025</p>
        </div>

        <div className="terms-actions">
          <button className="btn-secondary" onClick={onDecline}>
            Rechazar
          </button>
          <button className="btn-primary" onClick={onAccept}>
            Aceptar Términos
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Integración en Login
```tsx
// Mostrar al primer login
useEffect(() => {
  const termsAccepted = localStorage.getItem('terms Accepted');
  if (!termsAccepted && isAuthenticated) {
    setShowTerms(true);
  }
}, [isAuthenticated]);

const handleAcceptTerms = () => {
  localStorage.setItem('termsAccepted', 'true');
  localStorage.setItem('termsAcceptedDate', new Date().toISOString());
  setShowTerms(false);
};
```

---

## 6. Sistema de Notificaciones 🔔

### Archivos a crear:
- `src/components/NotificationBell.tsx`
- `src/components/NotificationBell.css`
- `src/components/NotificationList.tsx`
- `src/components/NotificationList.css`
- `src/context/NotificationContext.tsx`

### Implementación:

```tsx
// NotificationContext.tsx
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  category: 'system' | 'fair' | 'registration' | 'transport' | 'security';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export function NotificationProvider({ children }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      isRead: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount: notifications.filter(n => !n.isRead).length,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
```

```tsx
// NotificationBell.tsx
export default function NotificationBell() {
  const { notifications, unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="notification-bell">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bell-button"
        aria-label={`Notificaciones (${unreadCount} sin leer)`}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <NotificationList
          notifications={notifications}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
```

### Agregar en Navigation
```tsx
<div className="top-bar-controls">
  <NotificationBell />
  {/* otros controles */}
</div>
```

### Ejemplos de uso
```tsx
// Al aprobar una inscripción
addNotification({
  title: 'Inscripción aprobada',
  message: 'Tu inscripción a la feria ha sido aprobada',
  type: 'success',
  category: 'registration',
  actionUrl: '/registrations',
});

// Al bloquear cuenta
addNotification({
  title: 'Alerta de seguridad',
  message: 'Demasiados intentos de login fallidos',
  type: 'error',
  category: 'security',
});
```

---

## 7. Ayuda Contextual ❓

### Archivos a crear:
- `src/components/HelpButton.tsx`
- `src/components/HelpButton.css`
- `src/components/HelpModal.tsx`
- `src/components/HelpModal.css`

### Implementación:

```tsx
// HelpButton.tsx
export default function HelpButton({ pageKey }: { pageKey: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const getHelpContent = (key: string) => {
    const helpContent: Record<string, any> = {
      'home': {
        title: 'Página Principal',
        content: 'Bienvenido al sistema de gestión de ferias agroproductivas...',
        video: null,
      },
      'producers': {
        title: 'Gestión de Productores',
        content: `
          En esta sección puedes:
          - Ver lista de productores registrados
          - Agregar nuevo productor
          - Editar información de productores
          - Ver historial de participaciones
        `,
        video: null,
      },
      'fairs': {
        title: 'Gestión de Ferias',
        content: `
          Aquí puedes administrar las ferias:
          - Crear nuevas ferias
          - Editar fechas y ubicaciones
          - Ver inscripciones
          - Generar reportes
        `,
        video: null,
      },
      // más páginas...
    };

    return helpContent[key] || helpContent['home'];
  };

  const help = getHelpContent(pageKey);

  return (
    <>
      <button
        className="help-button-float"
        onClick={() => setIsOpen(true)}
        aria-label="Ayuda"
      >
        ❓
      </button>

      {isOpen && (
        <HelpModal
          title={help.title}
          content={help.content}
          videoUrl={help.video}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
```

### Agregar en cada página
```tsx
// En HomePage.tsx, ProducersPage.tsx, etc.
return (
  <div className="page">
    {/* contenido */}
    <HelpButton pageKey="home" />
  </div>
);
```

---

## 8. Registro de Nuevo Usuario 📝

### Archivos a crear:
- `src/components/UserRegistration.tsx`
- `src/components/UserRegistration.css`

### Implementación:

```tsx
// UserRegistration.tsx
export default function UserRegistration() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
    role: 'producer' as 'admin' | 'producer' | 'coordinator',
    acceptTerms: false,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      // error
      return;
    }

    if (!formData.acceptTerms) {
      // error
      return;
    }

    // Crear usuario
    console.log('Creando usuario:', formData);
  };

  return (
    <form className="user-registration" onSubmit={handleSubmit}>
      <h2>Registro de Usuario</h2>

      <div className="form-group">
        <label>Nombre de usuario *</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Nombre completo *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Correo electrónico *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Contraseña *</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Confirmar contraseña *</label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Tipo de usuario *</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value as any})}
        >
          <option value="producer">Productor</option>
          <option value="coordinator">Coordinador</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div className="form-group-checkbox">
        <label>
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
          />
          Acepto los términos y condiciones
        </label>
      </div>

      <button type="submit" className="btn-primary">
        Registrar Usuario
      </button>
    </form>
  );
}
```

---

## Prioridad de Implementación

### Fase 1 - Crítico (Seguridad)
1. ✅ Bloqueo temporal (seguridad)
2. ✅ Términos y condiciones
3. ✅ Recordar sesión

### Fase 2 - Alta prioridad (Usabilidad)
4. ✅ Recuperar contraseña
5. ✅ Ver/Editar perfil
6. ✅ Notificaciones

### Fase 3 - Media prioridad (Funcionalidad)
7. ✅ Ayuda contextual
8. ✅ Registro de usuarios

## Archivos de Configuración Necesarios

### tsconfig.json
Ya existe, verificar que incluya:
```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true
  }
}
```

### package.json
Dependencias adicionales necesarias:
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-i18next": "^14.x",
    "i18next": "^23.x"
  }
}
```

## Notas de Implementación

1. **localStorage vs sessionStorage**: Usar localStorage para "recordar sesión", sessionStorage para sesiones temporales

2. **Seguridad**: Los intentos de login fallidos deben limpiarse después del bloqueo

3. **Notificaciones**: Considerar límite máximo de notificaciones (ej: 50) para no saturar memoria

4. **Ayuda contextual**: El contenido puede moverse a archivos JSON separados para facilitar actualización

5. **Términos y condiciones**: Versionar los términos y requerir nueva aceptación al cambiar

6. **GDPR**: Implementar "derecho al olvido" en eliminación de cuenta

## Testing Recomendado

- [ ] Login con recordar sesión
- [ ] Login sin recordar sesión (verificar expiración)
- [ ] 3 intentos fallidos -> bloqueo
- [ ] Recuperación de contraseña flujo completo
- [ ] Edición de perfil
- [ ] Aceptación de términos en primer login
- [ ] Notificaciones aparecen correctamente
- [ ] Ayuda contextual en todas las páginas
- [ ] Registro de nuevo usuario con validaciones
