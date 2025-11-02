-- ============================================
-- INSERTAR TRADUCCIONES DE EJEMPLO
-- Datos en inglés para productores, ferias y contenido
-- ============================================

-- Traducciones de ejemplo para ferias (asumiendo que ya existen ferias)
-- Nota: Ajusta los fair_id según los datos reales de tu base de datos

-- Si tienes ferias existentes, obtén los IDs primero:
-- SELECT fair_id, name FROM fairs;

-- Ejemplo de traducción para feria 1 (si existe)
INSERT INTO fair_translations (fair_id, language_code, name, description, requirements) VALUES
  (1, 'en', 'Organic Products Fair 2025', 
   'Annual fair dedicated to organic and sustainable agricultural products. Ideal space for local producers to showcase and sell their products.',
   ARRAY['Valid health permit', 'Product liability insurance', 'Organic certification'])
ON CONFLICT (fair_id, language_code) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description, requirements = EXCLUDED.requirements;

-- Traducciones de ejemplo para productores
-- Nota: Ajusta los producer_id según los datos reales

INSERT INTO producer_translations (producer_id, language_code, farm_name, main_products) VALUES
  (1, 'en', 'Green Valley Farm', ARRAY['Organic vegetables', 'Fresh fruits', 'Herbs']),
  (2, 'en', 'Mountain Coffee Estate', ARRAY['Organic coffee', 'Cocoa', 'Honey'])
ON CONFLICT (producer_id, language_code) DO UPDATE 
SET farm_name = EXCLUDED.farm_name, main_products = EXCLUDED.main_products;

-- Contenido del home en ambos idiomas (expandido)
INSERT INTO home_content_translations (content_key, language_code, content) VALUES
  -- Español
  ('welcome_title', 'es', '¡Bienvenido a AgroFeria!'),
  ('welcome_message', 'es', 'Sistema integral de gestión de ferias agrícolas para productores locales. Conecta, inscribe y vende tus productos.'),
  ('mission_title', 'es', 'Nuestra Misión'),
  ('mission', 'es', 'Conectar productores agrícolas con ferias locales, facilitando el comercio directo y apoyando la economía local sostenible.'),
  ('features_title', 'es', 'Características Principales'),
  ('feature_1', 'es', 'Registro de Productores: Gestiona tu perfil y productos'),
  ('feature_2', 'es', 'Inscripción a Ferias: Participa en eventos locales'),
  ('feature_3', 'es', 'Control de Ventas: Registra y analiza tus ventas'),
  ('feature_4', 'es', 'Transporte: Coordina logística de transporte'),
  ('cta_title', 'es', 'Comienza Ahora'),
  ('cta_message', 'es', 'Regístrate como productor y accede a ferias agrícolas en tu región'),
  
  -- English
  ('welcome_title', 'en', 'Welcome to AgroFeria!'),
  ('welcome_message', 'en', 'Comprehensive agricultural fair management system for local producers. Connect, register and sell your products.'),
  ('mission_title', 'en', 'Our Mission'),
  ('mission', 'en', 'Connect agricultural producers with local fairs, facilitating direct trade and supporting sustainable local economy.'),
  ('features_title', 'en', 'Main Features'),
  ('feature_1', 'en', 'Producer Registration: Manage your profile and products'),
  ('feature_2', 'en', 'Fair Registration: Participate in local events'),
  ('feature_3', 'en', 'Sales Control: Record and analyze your sales'),
  ('feature_4', 'en', 'Transportation: Coordinate transportation logistics'),
  ('cta_title', 'en', 'Get Started Now'),
  ('cta_message', 'en', 'Register as a producer and access agricultural fairs in your region')
ON CONFLICT (content_key, language_code) DO UPDATE 
SET content = EXCLUDED.content;

-- Traducciones de configuraciones del sistema
INSERT INTO system_setting_translations (setting_key, language_code, translated_value) VALUES
  ('site_name', 'es', 'AgroFeria - Sistema de Gestión'),
  ('site_name', 'en', 'AgroFeria - Management System'),
  ('admin_email_label', 'es', 'Correo del Administrador'),
  ('admin_email_label', 'en', 'Administrator Email'),
  ('max_upload_size_label', 'es', 'Tamaño Máximo de Subida'),
  ('max_upload_size_label', 'en', 'Maximum Upload Size'),
  ('maintenance_message', 'es', 'El sistema está en mantenimiento. Volveremos pronto.'),
  ('maintenance_message', 'en', 'The system is under maintenance. We will be back soon.')
ON CONFLICT (setting_key, language_code) DO UPDATE 
SET translated_value = EXCLUDED.translated_value;

-- Verificar traducciones insertadas
SELECT 'Traducciones insertadas exitosamente!' as status,
       (SELECT COUNT(*) FROM fair_translations WHERE language_code = 'en') as fair_translations_en,
       (SELECT COUNT(*) FROM producer_translations WHERE language_code = 'en') as producer_translations_en,
       (SELECT COUNT(*) FROM home_content_translations WHERE language_code = 'en') as home_content_en;

-- Consulta para ver todas las traducciones del home
SELECT content_key, language_code, content 
FROM home_content_translations 
ORDER BY content_key, language_code;
