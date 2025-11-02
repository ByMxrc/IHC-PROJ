-- =====================================================
-- SISTEMA DE GESTIÓN DE FERIAS AGROPRODUCTIVAS
-- Base de Datos PostgreSQL
-- Versión: 1.0
-- Fecha: 2025-11-02
-- =====================================================

-- Crear la base de datos
DROP DATABASE IF EXISTS agroferia_db;
CREATE DATABASE agroferia_db
    WITH 
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Spain.1252'
    LC_CTYPE = 'Spanish_Spain.1252'
    TEMPLATE = template0;

-- Conectar a la base de datos
\c agroferia_db;

-- =====================================================
-- TABLA: USERS (Usuarios del Sistema)
-- =====================================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'coordinator', 'producer', 'user')),
    
    -- Seguridad
    is_blocked BOOLEAN DEFAULT FALSE,
    blocked_until TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    session_token VARCHAR(255),
    session_expiry TIMESTAMP,
    
    -- Legal
    terms_accepted BOOLEAN DEFAULT FALSE,
    terms_accepted_date TIMESTAMP,
    privacy_accepted BOOLEAN DEFAULT FALSE,
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    
    -- Estado
    is_active BOOLEAN DEFAULT TRUE
);

-- Índices para users
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_session_token ON users(session_token);

-- =====================================================
-- TABLA: PASSWORD_RESET_TOKENS
-- =====================================================
CREATE TABLE password_reset_tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_password_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX idx_password_tokens_token ON password_reset_tokens(token);

-- =====================================================
-- TABLA: PRODUCERS (Productores Agrícolas)
-- =====================================================
CREATE TABLE producers (
    producer_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(user_id) ON DELETE SET NULL,
    
    -- Datos Personales
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    document_type VARCHAR(20) NOT NULL CHECK (document_type IN ('DNI', 'RUC', 'CE', 'Pasaporte')),
    document_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    secondary_phone VARCHAR(20),
    
    -- Ubicación
    address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Datos de Producción
    farm_name VARCHAR(100),
    farm_size DECIMAL(10, 2), -- hectáreas
    main_products TEXT[], -- array de productos
    organic_certified BOOLEAN DEFAULT FALSE,
    certifications TEXT[], -- certificaciones adicionales
    
    -- Auditoría
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended'))
);

-- Índices para producers
CREATE INDEX idx_producers_user_id ON producers(user_id);
CREATE INDEX idx_producers_document ON producers(document_number);
CREATE INDEX idx_producers_province ON producers(province);
CREATE INDEX idx_producers_status ON producers(status);

-- =====================================================
-- TABLA: FAIRS (Ferias Agroproductivas)
-- =====================================================
CREATE TABLE fairs (
    fair_id SERIAL PRIMARY KEY,
    
    -- Información Básica
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Ubicación
    location VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    district VARCHAR(100),
    province VARCHAR(100),
    department VARCHAR(100),
    
    -- Fechas
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_start DATE,
    registration_end DATE,
    
    -- Capacidad
    max_capacity INTEGER NOT NULL,
    current_capacity INTEGER DEFAULT 0,
    
    -- Categorías y Requisitos
    product_categories TEXT[],
    requirements TEXT[],
    
    -- Costos
    registration_fee DECIMAL(10, 2) DEFAULT 0,
    stand_fee DECIMAL(10, 2) DEFAULT 0,
    
    -- Estado
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
    
    -- Auditoría
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para fairs
CREATE INDEX idx_fairs_status ON fairs(status);
CREATE INDEX idx_fairs_dates ON fairs(start_date, end_date);
CREATE INDEX idx_fairs_province ON fairs(province);

-- =====================================================
-- TABLA: REGISTRATIONS (Inscripciones a Ferias)
-- =====================================================
CREATE TABLE registrations (
    registration_id SERIAL PRIMARY KEY,
    producer_id INTEGER NOT NULL REFERENCES producers(producer_id) ON DELETE CASCADE,
    fair_id INTEGER NOT NULL REFERENCES fairs(fair_id) ON DELETE CASCADE,
    
    -- Productos a Vender
    products_to_sell TEXT[] NOT NULL,
    estimated_quantity DECIMAL(10, 2),
    quantity_unit VARCHAR(50),
    
    -- Stand
    stand_number VARCHAR(20),
    stand_size VARCHAR(50),
    
    -- Transporte
    needs_transport BOOLEAN DEFAULT FALSE,
    transport_notes TEXT,
    
    -- Pagos
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
    total_amount DECIMAL(10, 2),
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    
    -- Estado
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    rejection_reason TEXT,
    
    -- Auditoría
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by INTEGER REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint: Un productor no puede inscribirse dos veces a la misma feria
    UNIQUE(producer_id, fair_id)
);

-- Índices para registrations
CREATE INDEX idx_registrations_producer ON registrations(producer_id);
CREATE INDEX idx_registrations_fair ON registrations(fair_id);
CREATE INDEX idx_registrations_status ON registrations(status);

-- =====================================================
-- TABLA: TRANSPORT_ROUTES (Rutas de Transporte)
-- =====================================================
CREATE TABLE transport_routes (
    route_id SERIAL PRIMARY KEY,
    fair_id INTEGER NOT NULL REFERENCES fairs(fair_id) ON DELETE CASCADE,
    
    -- Información de la Ruta
    route_name VARCHAR(100) NOT NULL,
    driver_name VARCHAR(100),
    driver_phone VARCHAR(20),
    vehicle_type VARCHAR(50),
    vehicle_plate VARCHAR(20),
    
    -- Capacidad
    max_capacity INTEGER NOT NULL,
    current_capacity INTEGER DEFAULT 0,
    
    -- Detalles
    departure_time TIME,
    pickup_points TEXT[],
    estimated_arrival TIME,
    
    -- Costos
    cost_per_person DECIMAL(10, 2),
    
    -- Estado
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para transport_routes
CREATE INDEX idx_transport_fair ON transport_routes(fair_id);
CREATE INDEX idx_transport_status ON transport_routes(status);

-- =====================================================
-- TABLA: TRANSPORT_ASSIGNMENTS (Asignaciones de Transporte)
-- =====================================================
CREATE TABLE transport_assignments (
    assignment_id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL REFERENCES transport_routes(route_id) ON DELETE CASCADE,
    registration_id INTEGER NOT NULL REFERENCES registrations(registration_id) ON DELETE CASCADE,
    
    -- Detalles
    pickup_point VARCHAR(200),
    confirmed BOOLEAN DEFAULT FALSE,
    
    -- Auditoría
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint: Una inscripción solo puede estar en una ruta
    UNIQUE(registration_id)
);

-- Índices para transport_assignments
CREATE INDEX idx_transport_assignments_route ON transport_assignments(route_id);
CREATE INDEX idx_transport_assignments_registration ON transport_assignments(registration_id);

-- =====================================================
-- TABLA: SALES (Ventas en Ferias)
-- =====================================================
CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    registration_id INTEGER NOT NULL REFERENCES registrations(registration_id) ON DELETE CASCADE,
    
    -- Información de Venta
    sale_date DATE NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Detalles Adicionales
    payment_method VARCHAR(50),
    customer_type VARCHAR(50), -- mayorista, minorista, consumidor final
    notes TEXT,
    
    -- Auditoría
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recorded_by INTEGER REFERENCES users(user_id)
);

-- Índices para sales
CREATE INDEX idx_sales_registration ON sales(registration_id);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_product ON sales(product_name);

-- =====================================================
-- TABLA: NOTIFICATIONS (Notificaciones del Sistema)
-- =====================================================
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Contenido
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
    category VARCHAR(50) CHECK (category IN ('system', 'fair', 'registration', 'transport', 'security', 'sales')),
    
    -- Acción
    action_url VARCHAR(255),
    
    -- Estado
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- =====================================================
-- TABLA: AUDIT_LOG (Registro de Auditoría)
-- =====================================================
CREATE TABLE audit_log (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    
    -- Acción
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    
    -- Detalles
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para audit_log
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_log(created_at);

-- =====================================================
-- TABLA: SYSTEM_SETTINGS (Configuración del Sistema)
-- =====================================================
CREATE TABLE system_settings (
    setting_id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(20) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(user_id)
);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_producers_updated_at BEFORE UPDATE ON producers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fairs_updated_at BEFORE UPDATE ON fairs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transport_routes_updated_at BEFORE UPDATE ON transport_routes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER PARA ACTUALIZAR CAPACIDAD DE FERIAS
-- =====================================================
CREATE OR REPLACE FUNCTION update_fair_capacity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'approved' THEN
        UPDATE fairs 
        SET current_capacity = current_capacity + 1 
        WHERE fair_id = NEW.fair_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
            UPDATE fairs 
            SET current_capacity = current_capacity + 1 
            WHERE fair_id = NEW.fair_id;
        ELSIF OLD.status = 'approved' AND NEW.status != 'approved' THEN
            UPDATE fairs 
            SET current_capacity = current_capacity - 1 
            WHERE fair_id = NEW.fair_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'approved' THEN
        UPDATE fairs 
        SET current_capacity = current_capacity - 1 
        WHERE fair_id = OLD.fair_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fair_capacity_trigger
AFTER INSERT OR UPDATE OR DELETE ON registrations
FOR EACH ROW EXECUTE FUNCTION update_fair_capacity();

-- =====================================================
-- TRIGGER PARA ACTUALIZAR CAPACIDAD DE RUTAS
-- =====================================================
CREATE OR REPLACE FUNCTION update_route_capacity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE transport_routes 
        SET current_capacity = current_capacity + 1 
        WHERE route_id = NEW.route_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE transport_routes 
        SET current_capacity = current_capacity - 1 
        WHERE route_id = OLD.route_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_route_capacity_trigger
AFTER INSERT OR DELETE ON transport_assignments
FOR EACH ROW EXECUTE FUNCTION update_route_capacity();

-- =====================================================
-- DATOS INICIALES (SEED DATA)
-- =====================================================

-- Usuario Administrador por defecto
INSERT INTO users (username, email, password_hash, full_name, role, terms_accepted, terms_accepted_date, is_active) 
VALUES 
    ('admin', 'admin@agroferia.com', '$2a$10$rLQvH8Z5hT7qvYvqhYvqhO', 'Administrador del Sistema', 'admin', TRUE, CURRENT_TIMESTAMP, TRUE),
    ('coordinator1', 'coord@agroferia.com', '$2a$10$rLQvH8Z5hT7qvYvqhYvqhO', 'Juan Coordinador', 'coordinator', TRUE, CURRENT_TIMESTAMP, TRUE);

-- Configuraciones del Sistema
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) 
VALUES 
    ('max_login_attempts', '3', 'number', 'Máximo número de intentos de login fallidos'),
    ('lockout_duration_minutes', '15', 'number', 'Duración del bloqueo en minutos'),
    ('session_duration_days', '1', 'number', 'Duración de sesión sin "recordar"'),
    ('session_duration_remember_days', '30', 'number', 'Duración de sesión con "recordar"'),
    ('registration_fee_default', '0', 'number', 'Tarifa de inscripción por defecto'),
    ('enable_notifications', 'true', 'boolean', 'Habilitar sistema de notificaciones');

-- Provincias del Ecuador (para validación)
CREATE TABLE provinces (
    province_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    region VARCHAR(50) NOT NULL
);

INSERT INTO provinces (name, region) VALUES
    ('Azuay', 'Sierra'),
    ('Bolívar', 'Sierra'),
    ('Cañar', 'Sierra'),
    ('Carchi', 'Sierra'),
    ('Chimborazo', 'Sierra'),
    ('Cotopaxi', 'Sierra'),
    ('El Oro', 'Costa'),
    ('Esmeraldas', 'Costa'),
    ('Galápagos', 'Insular'),
    ('Guayas', 'Costa'),
    ('Imbabura', 'Sierra'),
    ('Loja', 'Sierra'),
    ('Los Ríos', 'Costa'),
    ('Manabí', 'Costa'),
    ('Morona Santiago', 'Amazonía'),
    ('Napo', 'Amazonía'),
    ('Orellana', 'Amazonía'),
    ('Pastaza', 'Amazonía'),
    ('Pichincha', 'Sierra'),
    ('Santa Elena', 'Costa'),
    ('Santo Domingo', 'Costa'),
    ('Sucumbíos', 'Amazonía'),
    ('Tungurahua', 'Sierra'),
    ('Zamora Chinchipe', 'Amazonía');

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista: Resumen de Productores
CREATE VIEW v_producers_summary AS
SELECT 
    p.producer_id,
    p.first_name || ' ' || p.last_name AS full_name,
    p.document_number,
    p.phone,
    p.province,
    p.status,
    COUNT(DISTINCT r.registration_id) AS total_fairs,
    COALESCE(SUM(s.total_amount), 0) AS total_sales,
    p.registration_date
FROM producers p
LEFT JOIN registrations r ON p.producer_id = r.producer_id AND r.status = 'approved'
LEFT JOIN sales s ON r.registration_id = s.registration_id
GROUP BY p.producer_id;

-- Vista: Resumen de Ferias
CREATE VIEW v_fairs_summary AS
SELECT 
    f.fair_id,
    f.name,
    f.location,
    f.start_date,
    f.end_date,
    f.status,
    f.current_capacity,
    f.max_capacity,
    ROUND((f.current_capacity::DECIMAL / f.max_capacity) * 100, 2) AS occupancy_percentage,
    COUNT(DISTINCT r.registration_id) AS total_registrations,
    COUNT(DISTINCT CASE WHEN r.status = 'pending' THEN r.registration_id END) AS pending_registrations,
    COALESCE(SUM(s.total_amount), 0) AS total_sales
FROM fairs f
LEFT JOIN registrations r ON f.fair_id = r.fair_id
LEFT JOIN sales s ON r.registration_id = s.registration_id
GROUP BY f.fair_id;

-- Vista: Notificaciones No Leídas por Usuario
CREATE VIEW v_unread_notifications AS
SELECT 
    n.user_id,
    u.username,
    COUNT(*) AS unread_count,
    MAX(n.created_at) AS latest_notification
FROM notifications n
JOIN users u ON n.user_id = u.user_id
WHERE n.is_read = FALSE
GROUP BY n.user_id, u.username;

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función: Obtener ventas totales de un productor
CREATE OR REPLACE FUNCTION get_producer_total_sales(p_producer_id INTEGER)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
    total DECIMAL(10, 2);
BEGIN
    SELECT COALESCE(SUM(s.total_amount), 0)
    INTO total
    FROM sales s
    JOIN registrations r ON s.registration_id = r.registration_id
    WHERE r.producer_id = p_producer_id;
    
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Función: Verificar disponibilidad en feria
CREATE OR REPLACE FUNCTION check_fair_availability(p_fair_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    available BOOLEAN;
BEGIN
    SELECT current_capacity < max_capacity
    INTO available
    FROM fairs
    WHERE fair_id = p_fair_id;
    
    RETURN COALESCE(available, FALSE);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PERMISOS (Opcional - para múltiples roles de BD)
-- =====================================================

-- Crear roles de base de datos
-- CREATE ROLE agroferia_admin WITH LOGIN PASSWORD 'admin_password';
-- CREATE ROLE agroferia_app WITH LOGIN PASSWORD 'app_password';
-- CREATE ROLE agroferia_readonly WITH LOGIN PASSWORD 'readonly_password';

-- GRANT ALL PRIVILEGES ON DATABASE agroferia_db TO agroferia_admin;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO agroferia_app;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO agroferia_readonly;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

-- Verificar la creación
SELECT 
    'Base de datos creada exitosamente' AS status,
    COUNT(*) AS total_tables
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Mostrar todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;
