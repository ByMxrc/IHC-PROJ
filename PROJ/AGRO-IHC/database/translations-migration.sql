-- ============================================
-- MIGRACIÓN: Sistema Multiidioma
-- Agregar soporte para traducciones español/inglés
-- ============================================

-- Tabla de idiomas soportados
CREATE TABLE IF NOT EXISTS languages (
  language_code VARCHAR(5) PRIMARY KEY,
  language_name VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

-- Insertar idiomas
INSERT INTO languages (language_code, language_name, is_active, display_order) VALUES
  ('es', 'Español', true, 1),
  ('en', 'English', true, 2)
ON CONFLICT (language_code) DO NOTHING;

-- Tabla de traducciones para ferias
CREATE TABLE IF NOT EXISTS fair_translations (
  translation_id SERIAL PRIMARY KEY,
  fair_id INTEGER NOT NULL REFERENCES fairs(fair_id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL REFERENCES languages(language_code),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  requirements TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(fair_id, language_code)
);

-- Tabla de traducciones para productores
CREATE TABLE IF NOT EXISTS producer_translations (
  translation_id SERIAL PRIMARY KEY,
  producer_id INTEGER NOT NULL REFERENCES producers(producer_id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL REFERENCES languages(language_code),
  farm_name VARCHAR(200),
  main_products TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(producer_id, language_code)
);

-- Tabla de traducciones para configuraciones del sistema
CREATE TABLE IF NOT EXISTS system_setting_translations (
  translation_id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL,
  language_code VARCHAR(5) NOT NULL REFERENCES languages(language_code),
  translated_value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(setting_key, language_code)
);

-- Tabla de traducciones para contenido del home (editor)
CREATE TABLE IF NOT EXISTS home_content_translations (
  translation_id SERIAL PRIMARY KEY,
  content_key VARCHAR(100) NOT NULL, -- 'welcome_message', 'description', etc.
  language_code VARCHAR(5) NOT NULL REFERENCES languages(language_code),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(content_key, language_code)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_fair_translations_fair_id ON fair_translations(fair_id);
CREATE INDEX IF NOT EXISTS idx_fair_translations_language ON fair_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_producer_translations_producer_id ON producer_translations(producer_id);
CREATE INDEX IF NOT EXISTS idx_producer_translations_language ON producer_translations(language_code);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_translation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fair_translation_timestamp
  BEFORE UPDATE ON fair_translations
  FOR EACH ROW
  EXECUTE FUNCTION update_translation_timestamp();

CREATE TRIGGER update_producer_translation_timestamp
  BEFORE UPDATE ON producer_translations
  FOR EACH ROW
  EXECUTE FUNCTION update_translation_timestamp();

-- Migrar datos existentes a traducciones en español
INSERT INTO fair_translations (fair_id, language_code, name, description, requirements)
SELECT 
  fair_id, 
  'es', 
  name, 
  description, 
  requirements
FROM fairs
ON CONFLICT (fair_id, language_code) DO NOTHING;

-- Crear traducciones en inglés (placeholder - se pueden actualizar después)
INSERT INTO fair_translations (fair_id, language_code, name, description, requirements)
SELECT 
  fair_id, 
  'en', 
  name || ' (EN)', -- Placeholder
  description, 
  requirements
FROM fairs
ON CONFLICT (fair_id, language_code) DO NOTHING;

INSERT INTO producer_translations (producer_id, language_code, farm_name, main_products)
SELECT 
  producer_id, 
  'es', 
  farm_name, 
  main_products
FROM producers
ON CONFLICT (producer_id, language_code) DO NOTHING;

INSERT INTO producer_translations (producer_id, language_code, farm_name, main_products)
SELECT 
  producer_id, 
  'en', 
  farm_name || ' (EN)', 
  main_products
FROM producers
ON CONFLICT (producer_id, language_code) DO NOTHING;

-- Insertar contenido del home en ambos idiomas
INSERT INTO home_content_translations (content_key, language_code, content) VALUES
  ('welcome_title', 'es', '¡Bienvenido a AgroFeria!'),
  ('welcome_title', 'en', 'Welcome to AgroFeria!'),
  ('welcome_message', 'es', 'Sistema de gestión de ferias agrícolas para productores locales.'),
  ('welcome_message', 'en', 'Agricultural fair management system for local producers.'),
  ('mission', 'es', 'Conectar productores agrícolas con ferias locales, facilitando el comercio directo y apoyando la economía local.'),
  ('mission', 'en', 'Connect agricultural producers with local fairs, facilitating direct trade and supporting the local economy.')
ON CONFLICT (content_key, language_code) DO NOTHING;

-- Vista optimizada para ferias con traducciones
CREATE OR REPLACE VIEW v_fairs_with_translations AS
SELECT 
  f.fair_id,
  f.location,
  f.address,
  f.district,
  f.province,
  f.department,
  f.start_date,
  f.end_date,
  f.max_capacity,
  f.current_occupancy,
  f.status,
  f.product_categories,
  f.created_by,
  f.created_at,
  ft.language_code,
  ft.name,
  ft.description,
  ft.requirements,
  ROUND((f.current_occupancy::NUMERIC / NULLIF(f.max_capacity, 0)) * 100, 2) as occupancy_percentage
FROM fairs f
LEFT JOIN fair_translations ft ON f.fair_id = ft.fair_id;

-- Vista optimizada para productores con traducciones
CREATE OR REPLACE VIEW v_producers_with_translations AS
SELECT 
  p.producer_id,
  p.first_name,
  p.last_name,
  p.document_type,
  p.document_number,
  p.email,
  p.phone,
  p.address,
  p.district,
  p.province,
  p.department,
  p.farm_size,
  p.registration_date,
  p.is_active,
  pt.language_code,
  pt.farm_name,
  pt.main_products
FROM producers p
LEFT JOIN producer_translations pt ON p.producer_id = pt.producer_id;

-- Función helper para obtener traducción de feria
CREATE OR REPLACE FUNCTION get_fair_translation(
  p_fair_id INTEGER,
  p_language_code VARCHAR(5) DEFAULT 'es'
) RETURNS TABLE (
  fair_id INTEGER,
  name VARCHAR(200),
  description TEXT,
  requirements TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ft.fair_id,
    ft.name,
    ft.description,
    ft.requirements
  FROM fair_translations ft
  WHERE ft.fair_id = p_fair_id 
    AND ft.language_code = p_language_code
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Función helper para obtener traducción de productor
CREATE OR REPLACE FUNCTION get_producer_translation(
  p_producer_id INTEGER,
  p_language_code VARCHAR(5) DEFAULT 'es'
) RETURNS TABLE (
  producer_id INTEGER,
  farm_name VARCHAR(200),
  main_products TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pt.producer_id,
    pt.farm_name,
    pt.main_products
  FROM producer_translations pt
  WHERE pt.producer_id = p_producer_id 
    AND pt.language_code = p_language_code
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Agregar columna de idioma preferido al usuario
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(5) DEFAULT 'es';
ALTER TABLE users ADD CONSTRAINT fk_users_language 
  FOREIGN KEY (preferred_language) REFERENCES languages(language_code);

COMMENT ON TABLE fair_translations IS 'Traducciones de ferias en múltiples idiomas';
COMMENT ON TABLE producer_translations IS 'Traducciones de productores en múltiples idiomas';
COMMENT ON TABLE home_content_translations IS 'Traducciones del contenido editable del home';

-- Verificación
SELECT 'Migración completada exitosamente!' as status,
       (SELECT COUNT(*) FROM languages) as languages_count,
       (SELECT COUNT(*) FROM fair_translations) as fair_translations_count,
       (SELECT COUNT(*) FROM producer_translations) as producer_translations_count;
