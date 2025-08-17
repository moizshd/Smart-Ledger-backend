// routes/category.routes.js
const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const {
  createCategory,
  getCategories,
  updateCategory,   // NEW
  deleteCategory    // NEW
} = require('../controllers/category.controller');

router.post('/', auth, createCategory);
router.get('/', auth, getCategories);
router.put('/:id', auth, updateCategory);     // NEW
router.delete('/:id', auth, deleteCategory);  // NEW

module.exports = router;
