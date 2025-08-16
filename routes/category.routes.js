const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { createCategory, getCategories } = require('../controllers/category.controller');

router.post('/', auth, createCategory);
router.get('/', auth, getCategories);

module.exports = router;
