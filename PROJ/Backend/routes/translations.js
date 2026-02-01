/**
 * Rutas de Traducciones
 */

const express = require('express');
const router = express.Router();
const { query } = require('../db');

// GET - Obtener todas las traducciones
router.get('/', async (req, res) => {
  try {
    // Tabla translations podría no existir, devolver datos estáticos
    const translations = [
      { id: 1, key: 'app.title', language: 'es', value: 'AgroFeria' },
      { id: 2, key: 'app.title', language: 'en', value: 'AgroFair' }
    ];
    
    res.json({
      success: true,
      data: translations
    });
  } catch (error) {
    console.error('Error al obtener traducciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener traducciones'
    });
  }
});

// ============================================
// OBTENER IDIOMAS DISPONIBLES
// ============================================
router.get('/languages', async (req, res) => {
  try {
    // Devolver idiomas disponibles como datos estáticos
    const languages = [
      { 
        id: 1, 
        code: 'es', 
        name: 'Español',
        displayName: 'Español',
        isActive: true, 
        displayOrder: 1 
      },
      { 
        id: 2, 
        code: 'en', 
        name: 'English',
        displayName: 'English',
        isActive: true, 
        displayOrder: 2 
      }
    ];

    res.json({
      success: true,
      data: languages
    });
  } catch (error) {
    console.error('Error al obtener idiomas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener idiomas'
    });
  }
});

// ============================================
// FERIAS CON TRADUCCIONES
// ============================================
router.get('/fairs/:lang?', async (req, res) => {
  try {
    const lang = req.params.lang || req.query.lang || 'es';

    const result = await query(
      `SELECT 
        f.fair_id, 
        f.location, 
        f.address, 
        f.district, 
        f.province, 
        f.department,
        f.start_date, 
        f.end_date, 
        f.max_capacity, 
        f.status, 
        f.product_categories,
        ft.name, 
        ft.description, 
        ft.requirements
      FROM fairs f
      LEFT JOIN fair_translations ft ON f.fair_id = ft.fair_id AND ft.language_code = $1
      ORDER BY f.start_date DESC`,
      [lang]
    );

    res.json({
      success: true,
      data: result.rows,
      language: lang
    });
  } catch (error) {
    console.error('Error al obtener ferias:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ferias'
    });
  }
});

// ============================================
// PRODUCTORES CON TRADUCCIONES
// ============================================
router.get('/producers/:lang?', async (req, res) => {
  try {
    const lang = req.params.lang || req.query.lang || 'es';

    const result = await query(
      `SELECT 
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
        pt.farm_name, 
        pt.main_products
      FROM producers p
      LEFT JOIN producer_translations pt ON p.producer_id = pt.producer_id AND pt.language_code = $1
      ORDER BY p.registration_date DESC`,
      [lang]
    );

    res.json({
      success: true,
      data: result.rows,
      language: lang
    });
  } catch (error) {
    console.error('Error al obtener productores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productores'
    });
  }
});

// ============================================
// CREAR/ACTUALIZAR TRADUCCIÓN DE FERIA
// ============================================
router.post('/fairs/:fairId/translations', async (req, res) => {
  try {
    const { fairId } = req.params;
    const { languageCode, name, description, requirements } = req.body;

    if (!languageCode || !name) {
      return res.status(400).json({
        success: false,
        message: 'Language code y nombre son requeridos'
      });
    }

    const result = await query(
      `INSERT INTO fair_translations (fair_id, language_code, name, description, requirements)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (fair_id, language_code) 
       DO UPDATE SET name = $3, description = $4, requirements = $5, updated_at = NOW()
       RETURNING *`,
      [fairId, languageCode, name, description, requirements]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al guardar traducción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar traducción'
    });
  }
});

// ============================================
// CREAR/ACTUALIZAR TRADUCCIÓN DE PRODUCTOR
// ============================================
router.post('/producers/:producerId/translations', async (req, res) => {
  try {
    const { producerId } = req.params;
    const { languageCode, farmName, mainProducts } = req.body;

    if (!languageCode || !farmName) {
      return res.status(400).json({
        success: false,
        message: 'Language code y nombre de finca son requeridos'
      });
    }

    const result = await query(
      `INSERT INTO producer_translations (producer_id, language_code, farm_name, main_products)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (producer_id, language_code) 
       DO UPDATE SET farm_name = $3, main_products = $4, updated_at = NOW()
       RETURNING *`,
      [producerId, languageCode, farmName, mainProducts]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al guardar traducción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar traducción'
    });
  }
});

// ============================================
// CONTENIDO HOME CON TRADUCCIONES
// ============================================
router.get('/home-content/:lang?', async (req, res) => {
  try {
    const lang = req.params.lang || req.query.lang || 'es';

    // Contenido estático en diferentes idiomas
    const homeContent = {
      es: {
        'home.title': 'Bienvenido a AgroFeria',
        'home.subtitle': 'La plataforma de ferias agrícolas más grande del Perú',
        'home.description': 'Conecta con productores y compradores de productos agrícolas',
        'home.features.title': 'Características principales',
        'home.cta.button': 'Comenzar ahora'
      },
      en: {
        'home.title': 'Welcome to AgroFair',
        'home.subtitle': 'The largest agricultural fair platform in Peru',
        'home.description': 'Connect with agricultural product producers and buyers',
        'home.features.title': 'Key features',
        'home.cta.button': 'Get started now'
      }
    };

    const content = homeContent[lang] || homeContent.es;

    res.json({
      success: true,
      data: content,
      language: lang
    });
  } catch (error) {
    console.error('Error al obtener contenido home:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener contenido'
    });
  }
});

// ============================================
// ACTUALIZAR CONTENIDO HOME
// ============================================
router.post('/home-content', async (req, res) => {
  try {
    const { contentKey, languageCode, content } = req.body;

    if (!contentKey || !languageCode || !content) {
      return res.status(400).json({
        success: false,
        message: 'contentKey, languageCode y content son requeridos'
      });
    }

    const result = await query(
      `INSERT INTO home_content_translations (content_key, language_code, content)
       VALUES ($1, $2, $3)
       ON CONFLICT (content_key, language_code) 
       DO UPDATE SET content = $3, updated_at = NOW()
       RETURNING *`,
      [contentKey, languageCode, content]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al guardar contenido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar contenido'
    });
  }
});

// ============================================
// ACTUALIZAR IDIOMA PREFERIDO DEL USUARIO
// ============================================
router.put('/users/:userId/language', async (req, res) => {
  try {
    const { userId } = req.params;
    const { languageCode } = req.body;

    if (!languageCode) {
      return res.status(400).json({
        success: false,
        message: 'languageCode es requerido'
      });
    }

    const result = await query(
      'UPDATE users SET preferred_language = $1 WHERE user_id = $2 RETURNING user_id, preferred_language',
      [languageCode, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar idioma:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar idioma'
    });
  }
});

module.exports = router;
