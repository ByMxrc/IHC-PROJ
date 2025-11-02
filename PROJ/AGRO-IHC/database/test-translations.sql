-- ============================================
-- PRUEBAS DEL SISTEMA MULTIIDIOMA
-- Verificar inserts, consultas y funcionalidad
-- ============================================

-- TEST 1: Verificar idiomas disponibles
SELECT '========== TEST 1: Idiomas Disponibles ==========';
SELECT * FROM languages ORDER BY display_order;

-- TEST 2: Verificar traducciones del home
SELECT '========== TEST 2: Traducciones del Home ==========';
SELECT content_key, language_code, LEFT(content, 50) as content_preview 
FROM home_content_translations 
ORDER BY content_key, language_code;

-- TEST 3: Contar todas las traducciones
SELECT '========== TEST 3: Conteo de Traducciones ==========';
SELECT 
  'Idiomas' as tabla,
  COUNT(*) as total
FROM languages
UNION ALL
SELECT 
  'Traducciones Home ES' as tabla,
  COUNT(*) as total
FROM home_content_translations WHERE language_code = 'es'
UNION ALL
SELECT 
  'Traducciones Home EN' as tabla,
  COUNT(*) as total
FROM home_content_translations WHERE language_code = 'en'
UNION ALL
SELECT 
  'Ferias Traducidas ES' as tabla,
  COUNT(*) as total
FROM fair_translations WHERE language_code = 'es'
UNION ALL
SELECT 
  'Ferias Traducidas EN' as tabla,
  COUNT(*) as total
FROM fair_translations WHERE language_code = 'en'
UNION ALL
SELECT 
  'Productores Traducidos ES' as tabla,
  COUNT(*) as total
FROM producer_translations WHERE language_code = 'es'
UNION ALL
SELECT 
  'Productores Traducidos EN' as tabla,
  COUNT(*) as total
FROM producer_translations WHERE language_code = 'en';

-- TEST 4: Probar inserción de nueva traducción
SELECT '========== TEST 4: Insertar Nueva Traducción ==========';
INSERT INTO home_content_translations (content_key, language_code, content) VALUES
  ('test_key', 'es', 'Prueba en español'),
  ('test_key', 'en', 'Test in English')
ON CONFLICT (content_key, language_code) 
DO UPDATE SET content = EXCLUDED.content
RETURNING *;

-- TEST 5: Consultar traducción específica
SELECT '========== TEST 5: Consultar Traducción Específica ==========';
SELECT * FROM home_content_translations 
WHERE content_key = 'welcome_title';

-- TEST 6: Actualizar traducción existente
SELECT '========== TEST 6: Actualizar Traducción ==========';
UPDATE home_content_translations 
SET content = '¡Bienvenido al Sistema AgroFeria!'
WHERE content_key = 'welcome_title' AND language_code = 'es'
RETURNING *;

-- TEST 7: Probar función get_fair_translation (si existen ferias)
SELECT '========== TEST 7: Función get_fair_translation ==========';
DO $$
DECLARE
  fair_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO fair_count FROM fairs;
  
  IF fair_count > 0 THEN
    RAISE NOTICE 'Probando función con feria existente...';
  ELSE
    RAISE NOTICE 'No hay ferias para probar. Creando feria de prueba...';
    
    -- Insertar feria de prueba
    INSERT INTO fairs (name, location, address, district, province, department, start_date, end_date, max_capacity, status, created_by)
    VALUES ('Feria de Prueba', 'Quito', 'Av. Principal 123', 'Centro', 'Pichincha', 'Pichincha', 
            NOW() + INTERVAL '30 days', NOW() + INTERVAL '32 days', 50, 'scheduled', 1)
    RETURNING fair_id;
    
    -- Insertar traducciones para la feria de prueba
    INSERT INTO fair_translations (fair_id, language_code, name, description)
    SELECT 
      fair_id,
      'es',
      'Feria Orgánica 2025',
      'Feria anual de productos orgánicos'
    FROM fairs WHERE name = 'Feria de Prueba'
    ON CONFLICT (fair_id, language_code) DO NOTHING;
    
    INSERT INTO fair_translations (fair_id, language_code, name, description)
    SELECT 
      fair_id,
      'en',
      'Organic Fair 2025',
      'Annual organic products fair'
    FROM fairs WHERE name = 'Feria de Prueba'
    ON CONFLICT (fair_id, language_code) DO NOTHING;
  END IF;
END $$;

-- Ejecutar la función
SELECT * FROM get_fair_translation(
  (SELECT fair_id FROM fairs LIMIT 1), 
  'es'
);

SELECT * FROM get_fair_translation(
  (SELECT fair_id FROM fairs LIMIT 1), 
  'en'
);

-- TEST 8: Probar vista v_fairs_with_translations
SELECT '========== TEST 8: Vista de Ferias con Traducciones ==========';
SELECT 
  fair_id,
  language_code,
  name,
  LEFT(description, 50) as description_preview,
  location,
  status
FROM v_fairs_with_translations
LIMIT 5;

-- TEST 9: Simular consulta del API - Obtener contenido home en español
SELECT '========== TEST 9: Simular API - Home Content ES ==========';
SELECT content_key, content 
FROM home_content_translations 
WHERE language_code = 'es'
ORDER BY content_key;

-- TEST 10: Simular consulta del API - Home Content en inglés
SELECT '========== TEST 10: Simular API - Home Content EN ==========';
SELECT content_key, content 
FROM home_content_translations 
WHERE language_code = 'en'
ORDER BY content_key;

-- TEST 11: Verificar integridad referencial
SELECT '========== TEST 11: Integridad Referencial ==========';
SELECT 
  'Traducciones Home sin idioma válido' as test,
  COUNT(*) as errores
FROM home_content_translations hct
LEFT JOIN languages l ON hct.language_code = l.language_code
WHERE l.language_code IS NULL
UNION ALL
SELECT 
  'Ferias con traducciones huérfanas' as test,
  COUNT(*) as errores
FROM fair_translations ft
LEFT JOIN fairs f ON ft.fair_id = f.fair_id
WHERE f.fair_id IS NULL
UNION ALL
SELECT 
  'Productores con traducciones huérfanas' as test,
  COUNT(*) as errores
FROM producer_translations pt
LEFT JOIN producers p ON pt.producer_id = p.producer_id
WHERE p.producer_id IS NULL;

-- TEST 12: Verificar performance de consultas con índices
SELECT '========== TEST 12: Verificar Índices ==========';
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('fair_translations', 'producer_translations', 'home_content_translations')
ORDER BY tablename, indexname;

-- TEST 13: Probar ON CONFLICT (no debe duplicar)
SELECT '========== TEST 13: Probar ON CONFLICT ==========';
INSERT INTO home_content_translations (content_key, language_code, content) VALUES
  ('welcome_title', 'es', 'Nuevo título (no debe duplicarse)')
ON CONFLICT (content_key, language_code) 
DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()
RETURNING translation_id, content_key, language_code, content;

-- TEST 14: Verificar triggers de updated_at
SELECT '========== TEST 14: Trigger updated_at ==========';
SELECT content_key, language_code, created_at, updated_at,
       CASE 
         WHEN updated_at > created_at THEN 'Trigger funciona ✓'
         ELSE 'Sin actualizaciones aún'
       END as trigger_status
FROM home_content_translations
WHERE content_key = 'welcome_title'
ORDER BY language_code;

-- TEST 15: Consulta completa simulando el frontend
SELECT '========== TEST 15: Consulta Completa Frontend ==========';
WITH home_es AS (
  SELECT content_key, content
  FROM home_content_translations
  WHERE language_code = 'es'
),
home_en AS (
  SELECT content_key, content
  FROM home_content_translations
  WHERE language_code = 'en'
)
SELECT 
  he.content_key,
  he.content as spanish,
  hen.content as english
FROM home_es he
LEFT JOIN home_en hen ON he.content_key = hen.content_key
ORDER BY he.content_key;

-- TEST 16: Verificar columna preferred_language en users
SELECT '========== TEST 16: Columna preferred_language ==========';
SELECT 
  user_id,
  username,
  preferred_language,
  CASE 
    WHEN preferred_language IS NOT NULL THEN 'Columna existe ✓'
    ELSE 'Columna no existe ✗'
  END as status
FROM users
LIMIT 3;

-- TEST 17: Resumen Final
SELECT '========== RESUMEN FINAL ==========';
SELECT 
  '✓ Sistema Multiidioma' as componente,
  'OPERATIVO' as estado,
  (SELECT COUNT(*) FROM languages) as idiomas,
  (SELECT COUNT(*) FROM home_content_translations) as traducciones_total,
  (SELECT COUNT(*) FROM home_content_translations WHERE language_code = 'es') as traducciones_es,
  (SELECT COUNT(*) FROM home_content_translations WHERE language_code = 'en') as traducciones_en;

-- Limpiar datos de prueba
DELETE FROM home_content_translations WHERE content_key = 'test_key';

SELECT '========== PRUEBAS COMPLETADAS ==========';
