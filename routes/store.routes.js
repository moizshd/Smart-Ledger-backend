// routes/store.routes.js
const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const {
  createStore,
  getStores,
  updateStore,   // NEW
  deleteStore    // NEW
} = require('../controllers/store.controller');

router.post('/', auth, createStore);
router.get('/', auth, getStores);
router.put('/:id', auth, updateStore);     // NEW
router.delete('/:id', auth, deleteStore);  // NEW

module.exports = router;
