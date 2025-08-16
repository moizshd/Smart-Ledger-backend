const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { createStore, getStores } = require('../controllers/store.controller');

router.post('/', auth, createStore);
router.get('/', auth, getStores);

module.exports = router;
